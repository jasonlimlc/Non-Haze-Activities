/**
 * Serverless HSA Retail Pharmacy Locations Endpoint
 * Dataset: d_bb92615f43de22933e4479558b1f6c36
 * Source: Health Sciences Authority (HSA) via data.gov.sg
 * Route: GET /api/pharmacies
 */

import { HSA_RETAIL_PHARMACIES, RetailPharmacy } from '../src/data/retailPharmacies.ts';

// In-memory cache for live fetched pharmacies
let cachedPharmacies: RetailPharmacy[] = HSA_RETAIL_PHARMACIES;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

// Haversine distance calculator in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

async function refreshFromDataGovSg(): Promise<void> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && cachedPharmacies.length > 0) {
    return;
  }

  try {
    const initRes = await fetch(
      'https://api-open.data.gov.sg/v1/public/api/datasets/d_bb92615f43de22933e4479558b1f6c36/initiate-download',
      { headers: { Accept: 'application/json' } }
    );

    if (!initRes.ok) return;
    const initJson = await initRes.json();
    const downloadUrl = initJson?.data?.url;

    if (!downloadUrl) return;

    const geoRes = await fetch(downloadUrl);
    if (!geoRes.ok) return;

    const geoJson = await geoRes.json();
    if (!Array.isArray(geoJson?.features)) return;

    const fresh: RetailPharmacy[] = geoJson.features.map((f: any, i: number) => {
      const p = f.properties || {};
      const c = f.geometry?.coordinates || [103.85, 1.3];
      const lng = Number(c[0]);
      const lat = Number(c[1]);

      let chain = 'Independent / Other';
      const name = p.PHARMACY_NAME || '';
      if (/guardian/i.test(name)) chain = 'Guardian';
      else if (/watson/i.test(name)) chain = 'Watsons';
      else if (/unity/i.test(name)) chain = 'Unity';
      else if (/hospital|medical|polyclinic/i.test(name)) chain = 'Hospital / Medical Centre';

      const cleanName = name
        .replace(/^Watson's Personal Care Stores Pte Ltd\s*/i, 'Watsons ')
        .replace(/^Guardian Health & Beauty\s*(Pte Ltd)?\s*/i, 'Guardian ')
        .replace(/^NTUC Health Co-operative Limited\s*/i, 'Unity Pharmacy ')
        .trim();

      let region: 'central' | 'south' | 'north' | 'east' | 'west' = 'central';
      if (lat > 1.39) region = 'north';
      else if (lng < 103.77) region = 'west';
      else if (lng > 103.89) region = 'east';
      else if (lat < 1.285) region = 'south';

      const parts: string[] = [];
      if (p.HOUSE_BLK_NO && p.HOUSE_BLK_NO !== 'NIL') parts.push(p.HOUSE_BLK_NO);
      if (p.ROAD_NAME && p.ROAD_NAME !== 'NIL') parts.push(p.ROAD_NAME);
      if (p.LEVEL_NO && p.LEVEL_NO !== 'NIL' && p.UNIT_NO && p.UNIT_NO !== 'NIL') {
        parts.push(p.LEVEL_NO + '-' + p.UNIT_NO);
      }
      if (p.BUILDING_NAME && p.BUILDING_NAME !== 'NIL' && p.BUILDING_NAME !== 'Singapore') {
        parts.push('(' + p.BUILDING_NAME + ')');
      }
      if (p.POSTAL_CODE) {
        parts.push('Singapore ' + p.POSTAL_CODE);
      }

      const address = parts.length > 0 ? parts.join(' ') : name;

      return {
        id: 'pharmacy-' + (p.OBJECTID_1 || i + 1),
        name: cleanName,
        officialName: name,
        chain,
        building: p.BUILDING_NAME !== 'Singapore' && p.BUILDING_NAME !== 'NIL' ? p.BUILDING_NAME : '',
        road: p.ROAD_NAME || '',
        block: p.HOUSE_BLK_NO || '',
        unit: p.LEVEL_NO ? p.LEVEL_NO + '-' + (p.UNIT_NO || '') : (p.UNIT_NO || ''),
        postal: p.POSTAL_CODE || '',
        address,
        lat,
        lng,
        region,
        isHsaRegistered: true,
      };
    });

    if (fresh.length > 0) {
      cachedPharmacies = fresh;
      lastFetchTime = now;
    }
  } catch (err) {
    console.warn('Failed to refresh pharmacies from data.gov.sg, using bundled cache:', err);
  }
}

export default async function handler(req: any, res?: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  // Trigger non-blocking refresh if needed
  refreshFromDataGovSg().catch(() => {});

  const query = req.query || (req.url ? Object.fromEntries(new URL(req.url, 'http://localhost').searchParams) : {});
  const searchTerm = (query.search || query.q || '').trim().toLowerCase();
  const regionFilter = (query.region || 'all').toLowerCase();
  const chainFilter = (query.chain || 'all').toLowerCase();
  const userLat = parseFloat(query.lat);
  const userLng = parseFloat(query.lng);
  const hasUserCoords = !isNaN(userLat) && !isNaN(userLng);
  const limit = Math.min(parseInt(query.limit || '100', 10), 300);

  let results: RetailPharmacy[] = [...cachedPharmacies];

  // 1. Filter by Region
  if (regionFilter && regionFilter !== 'all' && regionFilter !== 'national') {
    results = results.filter((p) => p.region === regionFilter);
  }

  // 2. Filter by Chain
  if (chainFilter && chainFilter !== 'all') {
    results = results.filter((p) => p.chain.toLowerCase().includes(chainFilter));
  }

  // 3. Search query filter
  if (searchTerm) {
    results = results.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchTerm) ||
        p.officialName.toLowerCase().includes(searchTerm) ||
        p.building.toLowerCase().includes(searchTerm) ||
        p.road.toLowerCase().includes(searchTerm) ||
        p.postal.includes(searchTerm) ||
        p.address.toLowerCase().includes(searchTerm) ||
        p.chain.toLowerCase().includes(searchTerm)
      );
    });
  }

  // 4. Calculate Distance and sort
  if (hasUserCoords) {
    results = results.map((p) => ({
      ...p,
      distanceKm: calculateDistanceKm(userLat, userLng, p.lat, p.lng),
    }));
    results.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  const total = results.length;
  const items = results.slice(0, limit);

  const payload = {
    datasetId: 'd_bb92615f43de22933e4479558b1f6c36',
    source: 'Health Sciences Authority (HSA) - Registered Retail Pharmacies',
    total,
    count: items.length,
    userLocation: hasUserCoords ? { lat: userLat, lng: userLng } : null,
    pharmacies: items,
  };

  if (res && typeof res.status === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(payload);
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

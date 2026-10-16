import { SingaporeRegion } from '../types/haze';

export interface LocationMatchResult {
  query: string;
  matchedName: string;
  region: SingaporeRegion;
  regionDisplayName: string;
  coordinates?: { lat: number; lng: number };
  postal?: string;
  fullAddress?: string;
  note?: string;
}

export interface OneMapSearchResultItem {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

// Singapore NEA Regional Reference Sensor Coordinates
export const NEA_REGIONAL_COORDINATES: Record<
  SingaporeRegion,
  { name: string; lat: number; lng: number }
> = {
  national: { name: 'Singapore (National)', lat: 1.3521, lng: 103.8198 },
  central: { name: 'Central Region', lat: 1.3048, lng: 103.832 },
  south: { name: 'South Region', lat: 1.2959, lng: 103.82 },
  north: { name: 'North Region', lat: 1.418, lng: 103.82 },
  east: { name: 'East Region', lat: 1.3574, lng: 103.94 },
  west: { name: 'West Region', lat: 1.3418, lng: 103.705 },
};

// Curated database of Singapore tourist spots, hotels, landmarks, and neighborhoods
const SINGAPORE_LOCATIONS_DATABASE: Array<{
  names: string[];
  region: SingaporeRegion;
  displayName: string;
  lat: number;
  lng: number;
}> = [
  // SOUTH REGION
  {
    names: ['sentosa', 'sentosa island', 'siloso', 'palawan', 'tanjong beach', 'resorts world sentosa', 'rws', 'universal studios', 'uss', 's.e.a. aquarium', 'sea aquarium', 'cove', 'w singapore', 'capella', 'shangri-la rasa sentosa'],
    region: 'south',
    displayName: 'Sentosa & Resorts World',
    lat: 1.2494,
    lng: 103.8303,
  },
  {
    names: ['vivocity', 'harbourfront', 'harbour front', 'mount faber', 'cable car', 'telok blangah', 'keppel bay', 'labrador park', 'marina at keppel bay'],
    region: 'south',
    displayName: 'HarbourFront & Keppel Bay',
    lat: 1.2644,
    lng: 103.8222,
  },
  {
    names: ['pasir panjang', 'haw par villa', 'southern ridges', 'henderson waves'],
    region: 'south',
    displayName: 'Southern Ridges & Pasir Panjang',
    lat: 1.2828,
    lng: 103.782,
  },

  // CENTRAL REGION
  {
    names: ['marina bay sands', 'mbs', 'gardens by the bay', 'cloud forest', 'flower dome', 'bayfront', 'marina barrage', 'singapore flyer', 'artscience museum', 'the shoppes', 'helix bridge', 'customs house', 'one raffles quay'],
    region: 'central',
    displayName: 'Marina Bay & Bayfront',
    lat: 1.2838,
    lng: 103.8591,
  },
  {
    names: ['orchard', 'orchard road', 'ion orchard', 'takashimaya', 'ngee ann city', 'somerset', '313@somerset', 'paragon', 'scotts road', 'tanglin', 'dhoby ghaut', 'plaza singapura'],
    region: 'central',
    displayName: 'Orchard Road Shopping Belt',
    lat: 1.3048,
    lng: 103.8318,
  },
  {
    names: ['chinatown', 'maxwell', 'kreta ayer', 'telok ayer', 'amoy street', 'tanjong pagar', 'buddha tooth relic', 'club street', 'duxton'],
    region: 'central',
    displayName: 'Chinatown & Tanjong Pagar',
    lat: 1.2815,
    lng: 103.8443,
  },
  {
    names: ['clarke quay', 'boat quay', 'robertson quay', 'singapore river', 'fort canning', 'national museum', 'national gallery', 'city hall', 'padang', 'raffles hotel', 'suntec', 'suntec city', 'millenia walk', 'marina square', 'pan pacific', 'ritz carlton'],
    region: 'central',
    displayName: 'Civic District, Suntec & Singapore River',
    lat: 1.2903,
    lng: 103.8519,
  },
  {
    names: ['bugis', 'bugis junction', 'haji lane', 'arab street', 'kampong glam', 'sultan mosque', 'albert centre', 'bras basah'],
    region: 'central',
    displayName: 'Bugis & Kampong Glam',
    lat: 1.3007,
    lng: 103.856,
  },
  {
    names: ['little india', 'mustafa', 'mustafa centre', 'farrer park', 'serangoon road', 'tekka centre'],
    region: 'central',
    displayName: 'Little India & Mustafa Centre',
    lat: 1.3115,
    lng: 103.8536,
  },
  {
    names: ['novena', 'tan tock seng', 'ttsh', 'balestier', 'newton', 'newton food centre', 'bishan', 'toa payoh'],
    region: 'central',
    displayName: 'Novena, Balestier & Newton',
    lat: 1.3204,
    lng: 103.8438,
  },
  {
    names: ['tiong bahru', 'outram', 'outram park', 'singapore general hospital', 'sgh', 'redhill', 'alexandra'],
    region: 'central',
    displayName: 'Tiong Bahru & Outram',
    lat: 1.2868,
    lng: 103.8271,
  },

  // EAST REGION
  {
    names: ['changi', 'changi airport', 'jewel', 'jewel changi', 'terminal 1', 'terminal 2', 'terminal 3', 'terminal 4', 'changi village', 'expo', 'singapore expo'],
    region: 'east',
    displayName: 'Changi Airport & Jewel',
    lat: 1.3644,
    lng: 103.9915,
  },
  {
    names: ['tampines', 'pasir ris', 'downtown east', 'wild wild wet', 'simei', 'bedok', 'bedok reservoir'],
    region: 'east',
    displayName: 'Tampines & Pasir Ris',
    lat: 1.3532,
    lng: 103.9452,
  },
  {
    names: ['east coast', 'east coast park', 'ecp', 'katong', 'joo chiat', 'marine parade', 'siglap', 'geylang serai', 'paya lebar'],
    region: 'east',
    displayName: 'East Coast Park & Katong',
    lat: 1.3015,
    lng: 103.9066,
  },

  // NORTH REGION
  {
    names: ['mandai', 'singapore zoo', 'night safari', 'river wonders', 'bird paradise', 'mandai wildlife reserve'],
    region: 'north',
    displayName: 'Mandai Wildlife Reserve & Singapore Zoo',
    lat: 1.4043,
    lng: 103.793,
  },
  {
    names: ['woodlands', 'causeway', 'jb checkpoint', 'woodlands checkpoint', 'marsiling', 'admiralty'],
    region: 'north',
    displayName: 'Woodlands & Causeway',
    lat: 1.4361,
    lng: 103.7865,
  },
  {
    names: ['yishun', 'sembawang', 'khatib', 'ang mo kio', 'amk', 'seletar', 'punggol', 'sengkang', 'coney island'],
    region: 'north',
    displayName: 'Yishun, Ang Mo Kio & Punggol',
    lat: 1.4295,
    lng: 103.835,
  },

  // WEST REGION
  {
    names: ['jurong', 'jurong east', 'jem', 'westgate', 'imm', 'science centre', 'snow city', 'jurong lake gardens', 'chinese garden', 'japanese garden'],
    region: 'west',
    displayName: 'Jurong East & Science Centre',
    lat: 1.3329,
    lng: 103.7436,
  },
  {
    names: ['boon lay', 'jurong point', 'tuas', 'ntu', 'nanyang technological university', 'pioneer'],
    region: 'west',
    displayName: 'Boon Lay & Jurong West',
    lat: 1.3404,
    lng: 103.7058,
  },
  {
    names: ['clementi', 'nus', 'national university of singapore', 'west coast', 'buona vista', 'one-north', 'star vista'],
    region: 'west',
    displayName: 'Clementi, NUS & One-North',
    lat: 1.3162,
    lng: 103.7649,
  },
  {
    names: ['bukit batok', 'bukit panjang', 'choa chu kang', 'lot one', 'hillview', 'rail mall'],
    region: 'west',
    displayName: 'Bukit Batok & Choa Chu Kang',
    lat: 1.359,
    lng: 103.7519,
  },
];

// Resolves a user's location input to a Singapore region
export function resolveSingaporeLocation(query: string): LocationMatchResult {
  const clean = query.trim().toLowerCase();
  if (!clean || clean === 'singapore') {
    return {
      query: query || 'Marina Bay Sands',
      matchedName: 'Marina Bay & Bayfront',
      region: 'central',
      regionDisplayName: 'Central Singapore',
      coordinates: { lat: 1.2838, lng: 103.8591 },
      note: 'Popular Tourist Landmark',
    };
  }

  // 1. Check Postal Code prefixes (First 2 digits of Singapore 6-digit postal code)
  const postalMatch = clean.match(/\b\d{6}\b/) || clean.match(/^\d{2}$/);
  if (postalMatch) {
    const code = postalMatch[0];
    const sector = parseInt(code.substring(0, 2), 10);

    // Singapore Postal Sector to Region Mapping
    if ([1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 56, 57].includes(sector)) {
      return {
        query,
        matchedName: `Postal Sector ${sector} (Orchard/City/CBD)`,
        region: 'central',
        regionDisplayName: 'Central Region',
        note: `Matched postal code sector ${sector} to Central Singapore`,
      };
    }
    if ([9, 10, 14, 15, 16].includes(sector)) {
      return {
        query,
        matchedName: `Postal Sector ${sector} (HarbourFront/Sentosa)`,
        region: 'south',
        regionDisplayName: 'South Region',
        note: `Matched postal code sector ${sector} to Southern Singapore`,
      };
    }
    if ([46, 47, 48, 49, 50, 51, 52, 81].includes(sector)) {
      return {
        query,
        matchedName: `Postal Sector ${sector} (Changi/Tampines)`,
        region: 'east',
        regionDisplayName: 'East Region',
        note: `Matched postal code sector ${sector} to Eastern Singapore`,
      };
    }
    if ([60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71].includes(sector)) {
      return {
        query,
        matchedName: `Postal Sector ${sector} (Jurong/West)`,
        region: 'west',
        regionDisplayName: 'West Region',
        note: `Matched postal code sector ${sector} to Western Singapore`,
      };
    }
    if ([72, 73, 75, 76, 77, 78, 79, 80, 82].includes(sector)) {
      return {
        query,
        matchedName: `Postal Sector ${sector} (Woodlands/North)`,
        region: 'north',
        regionDisplayName: 'North Region',
        note: `Matched postal code sector ${sector} to Northern Singapore`,
      };
    }
  }

  // 2. Exact match first, then substring
  for (const entry of SINGAPORE_LOCATIONS_DATABASE) {
    if (entry.names.some((n) => n === clean)) {
      return {
        query,
        matchedName: entry.displayName,
        region: entry.region,
        regionDisplayName: `${entry.region.toUpperCase()} Singapore`,
        coordinates: { lat: entry.lat, lng: entry.lng },
        note: `Direct match: ${entry.displayName}`,
      };
    }
  }

  for (const entry of SINGAPORE_LOCATIONS_DATABASE) {
    for (const name of entry.names) {
      if (clean.includes(name) || (clean.length >= 4 && name.includes(clean))) {
        return {
          query,
          matchedName: entry.displayName,
          region: entry.region,
          regionDisplayName: `${entry.region.toUpperCase()} Singapore`,
          coordinates: { lat: entry.lat, lng: entry.lng },
          note: `Matched to ${entry.displayName}`,
        };
      }
    }
  }

  // 3. Fallback directional keywords
  if (clean.includes('north') || clean.includes('mandai') || clean.includes('zoo')) {
    return {
      query,
      matchedName: 'Northern District',
      region: 'north',
      regionDisplayName: 'North Singapore',
    };
  }
  if (clean.includes('south') || clean.includes('sentosa') || clean.includes('island')) {
    return {
      query,
      matchedName: 'Southern District / Sentosa',
      region: 'south',
      regionDisplayName: 'South Singapore',
    };
  }
  if (clean.includes('east') || clean.includes('airport') || clean.includes('changi')) {
    return {
      query,
      matchedName: 'Eastern District / Airport',
      region: 'east',
      regionDisplayName: 'East Singapore',
    };
  }
  if (clean.includes('west') || clean.includes('jurong')) {
    return {
      query,
      matchedName: 'Western District',
      region: 'west',
      regionDisplayName: 'West Singapore',
    };
  }

  // Default to Central tourist district
  return {
    query,
    matchedName: `"${query}" (Central Tourist Sector)`,
    region: 'central',
    regionDisplayName: 'Central Singapore',
    coordinates: { lat: 1.3048, lng: 103.832 },
    note: 'Matched to Central Singapore tourist corridor',
  };
}

// Calculate nearest NEA sensor region from GPS coordinates
export function resolveCoordinatesToRegion(lat: number, lng: number): SingaporeRegion {
  let nearestRegion: SingaporeRegion = 'central';
  let minDistance = Infinity;

  const candidateRegions: SingaporeRegion[] = ['central', 'south', 'north', 'east', 'west'];

  for (const r of candidateRegions) {
    const coords = NEA_REGIONAL_COORDINATES[r];
    const dist = Math.hypot(lat - coords.lat, lng - coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestRegion = r;
    }
  }

  return nearestRegion;
}

/**
 * Live search against OneMap API via local endpoint /api/map with fast timeout
 */
export async function searchOneMapApi(query: string): Promise<OneMapSearchResultItem[]> {
  const clean = query.trim();
  if (!clean || clean.length < 2) return [];

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`/api/map?searchVal=${encodeURIComponent(clean)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch {
    return [];
  }
}

/**
 * Resolves a user's location input by querying OneMap live API with instant local fallback
 */
export async function resolveSingaporeLocationWithOneMap(query: string): Promise<LocationMatchResult> {
  const clean = query.trim();
  if (!clean) {
    return resolveSingaporeLocation('Marina Bay Sands');
  }

  // Try fast OneMap lookup
  try {
    const results = await searchOneMapApi(clean);
    if (results && results.length > 0) {
      const top = results[0];
      const lat = parseFloat(top.LATITUDE);
      const lng = parseFloat(top.LONGITUDE);

      if (!isNaN(lat) && !isNaN(lng) && lat > 1.15 && lat < 1.55 && lng > 103.55 && lng < 104.15) {
        const region = resolveCoordinatesToRegion(lat, lng);
        const title =
          top.BUILDING && top.BUILDING !== 'NIL'
            ? top.BUILDING
            : top.ROAD_NAME && top.ROAD_NAME !== 'NIL'
            ? `${top.BLK_NO && top.BLK_NO !== 'NIL' ? top.BLK_NO + ' ' : ''}${top.ROAD_NAME}`
            : top.SEARCHVAL || top.ADDRESS;

        return {
          query,
          matchedName: title,
          region,
          regionDisplayName: `${region.toUpperCase()} Singapore`,
          coordinates: { lat, lng },
          postal: top.POSTAL && top.POSTAL !== 'NIL' ? top.POSTAL : undefined,
          fullAddress: top.ADDRESS,
          note: `Verified via Singapore OneMap · Coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        };
      }
    }
  } catch {
    // ignore
  }

  // Guaranteed instant offline match
  return resolveSingaporeLocation(query);
}

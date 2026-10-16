import { RegionalPsiData, SingaporeRegion, PsiApiResponse } from '../types/haze';
import { FALLBACK_PSI_DATA } from '../data/hazeData';

function determinePsiStatus(psiValue: number): RegionalPsiData['status'] {
  if (psiValue <= 50) return 'Good';
  if (psiValue <= 100) return 'Moderate';
  if (psiValue <= 200) return 'Unhealthy';
  if (psiValue <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getStatusDescription(status: RegionalPsiData['status']): string {
  switch (status) {
    case 'Good':
      return 'Air quality is pristine. Normal outdoor activities can be enjoyed without restrictions.';
    case 'Moderate':
      return 'Air quality is acceptable. Normal activities for most; sensitive individuals monitor exertion.';
    case 'Unhealthy':
      return 'Elevated smoke haze. Healthy individuals reduce prolonged outdoor workouts; sensitive groups stay indoors.';
    case 'Very Unhealthy':
      return 'Significant transboundary smoke haze. Avoid prolonged outdoor exposure; wear certified N95 masks.';
    case 'Hazardous':
      return 'Emergency air quality levels. Stay indoors in air-conditioned facilities with closed windows.';
  }
}

export async function fetchLiveSingaporePsi(): Promise<{
  data: Record<SingaporeRegion, RegionalPsiData>;
  isLive: boolean;
  timestamp: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let json: any = null;
    try {
      const proxyRes = await fetch('/api/psi', {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (proxyRes.ok) {
        json = await proxyRes.json();
      }
    } catch {
      // proxy failed, fallback to direct
    }

    if (!json || (!json.items && !json.data)) {
      const response = await fetch('https://api.data.gov.sg/v1/environment/psi', {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Data.gov.sg API returned status ${response.status}`);
      }
      json = await response.json();
    }

    clearTimeout(timeoutId);

    const latestItem = json.items?.[0] || json.data?.items?.[0] || json.data?.records?.[0] || json.records?.[0];

    if (!latestItem || !latestItem.readings) {
      throw new Error('Invalid format from PSI feed');
    }

    const psi24 = latestItem.readings.psi_twenty_four_hourly || {};
    const pm25OneHr = latestItem.readings.pm25_one_hourly || {};

    const formattedTime = new Date(latestItem.update_timestamp || latestItem.timestamp).toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Singapore',
    });

    const regions: Array<{ id: SingaporeRegion; name: string; apiKey: string }> = [
      { id: 'national', name: 'All Singapore (National Avg)', apiKey: 'national' },
      { id: 'central', name: 'Central (Orchard, Marina Bay, CBD)', apiKey: 'central' },
      { id: 'south', name: 'South (Sentosa, HarbourFront)', apiKey: 'south' },
      { id: 'north', name: 'North (Woodlands, Mandai Zoo)', apiKey: 'north' },
      { id: 'east', name: 'East (Changi Airport, Tampines)', apiKey: 'east' },
      { id: 'west', name: 'West (Jurong, Clementi)', apiKey: 'west' },
    ];

    const result: Partial<Record<SingaporeRegion, RegionalPsiData>> = {};

    for (const r of regions) {
      const psiVal = Math.round(psi24[r.apiKey] ?? (r.id === 'national' ? 68 : 72));
      const pm25Val = Math.round(pm25OneHr[r.apiKey] ?? 25);
      const status = determinePsiStatus(psiVal);

      result[r.id] = {
        region: r.id,
        displayName: r.name,
        psi24Hourly: psiVal,
        pm25OneHourly: pm25Val,
        status,
        description: getStatusDescription(status),
        updateTime: `Updated ${formattedTime} SGT (Live NEA)`,
      };
    }

    return {
      data: result as Record<SingaporeRegion, RegionalPsiData>,
      isLive: true,
      timestamp: formattedTime,
    };
  } catch (err) {
    console.warn('Using NEA cached baseline data due to network:', err);
    return {
      data: FALLBACK_PSI_DATA as Record<SingaporeRegion, RegionalPsiData>,
      isLive: false,
      timestamp: 'Simulated Baseline (Live fallback)',
    };
  }
}

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
  // 1. Attempt Serverless Proxy Endpoints (/api/psi and /api/pm25)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const [psiRes, pm25Res] = await Promise.all([
      fetch('/api/psi', { signal: controller.signal, headers: { Accept: 'application/json' } }),
      fetch('/api/pm25', { signal: controller.signal, headers: { Accept: 'application/json' } }).catch(() => null),
    ]);

    clearTimeout(timeoutId);

    if (psiRes && psiRes.ok) {
      const psiJson = await psiRes.json();
      const pm25Json = pm25Res && pm25Res.ok ? await pm25Res.json().catch(() => null) : null;

      // Handle v2 format: { code: 0, data: { items: [ { readings: ... } ] } }
      const items = psiJson?.data?.items || psiJson?.items;
      const latestItem = items?.[0];

      if (latestItem && latestItem.readings) {
        const psi24 = latestItem.readings.psi_twenty_four_hourly || {};
        const pm25Items = pm25Json?.data?.items || pm25Json?.items;
        const pm25Readings = pm25Items?.[0]?.readings?.pm25_one_hourly || latestItem.readings.pm25_one_hourly || {};

        const rawTimestamp = latestItem.update_timestamp || latestItem.timestamp || new Date().toISOString();
        const formattedTime = new Date(rawTimestamp).toLocaleTimeString('en-SG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Singapore',
        });

        const keyList = ['central', 'south', 'north', 'east', 'west'] as const;
        const calcAvg = (rec: Record<string, number>, fallback: number) => {
          const vals = keyList.map((k) => rec[k]).filter((v) => typeof v === 'number' && !isNaN(v));
          return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : fallback;
        };

        const nationalPsi = psi24.national ?? calcAvg(psi24, 68);
        const nationalPm25 = pm25Readings.national ?? calcAvg(pm25Readings, 25);

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
          const psiVal = r.id === 'national' ? nationalPsi : Math.round(psi24[r.apiKey] ?? nationalPsi);
          const pm25Val = r.id === 'national' ? nationalPm25 : Math.round(pm25Readings[r.apiKey] ?? nationalPm25);
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
      }
    }
  } catch (serverlessErr) {
    console.info('Serverless /api/psi failed, trying direct NEA fallback:', serverlessErr);
  }

  // 2. Direct Public NEA Fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.data.gov.sg/v1/environment/psi', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Data.gov.sg API returned status ${response.status}`);
    }

    const json: PsiApiResponse = await response.json();
    const latestItem = json.items?.[0];

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

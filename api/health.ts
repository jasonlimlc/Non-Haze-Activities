/**
 * Serverless Health Check Endpoint
 * Route: GET /api/health
 */

export default async function handler(req: any, res?: any) {
  const healthData = {
    status: 'ok',
    service: 'sg-itinerary-serverless-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      hasDataGovKey: Boolean(process.env.DATA_GOV_SG_API_KEY),
      hasOneMapKey: Boolean(process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN),
    },
    endpoints: {
      pm25: '/api/pm25',
      psi: '/api/psi',
      map: '/api/map',
      pharmacies: '/api/pharmacies',
    },
  };

  // Node.js / Express / Vercel Serverless Function response
  if (res && typeof res.status === 'function') {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(healthData);
  }

  // Web Standard Response (Edge Runtime)
  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

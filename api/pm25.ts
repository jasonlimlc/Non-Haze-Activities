/**
 * Serverless PM2.5 Live Data Endpoint
 * Route: GET /api/pm25
 * Upstream: GET https://api-open.data.gov.sg/v2/real-time/api/pm25
 */

export default async function handler(req: any, res?: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
      },
    });
  }

  try {
    // Construct upstream URL with optional query parameters (e.g. date_time, date)
    const upstreamBase = 'https://api-open.data.gov.sg/v2/real-time/api/pm25';
    const url = new URL(upstreamBase);

    // Extract query parameters from request
    const query = req.query || (req.url ? Object.fromEntries(new URL(req.url, 'http://localhost').searchParams) : {});
    for (const [key, value] of Object.entries(query)) {
      if (value && typeof value === 'string') {
        url.searchParams.append(key, value);
      }
    }

    // Prepare headers - check environment for optional API key without hardcoding
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'CaptainHaze/1.0',
    };

    const apiKey = process.env.DATA_GOV_SG_API_KEY || process.env.DATA_GOV_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const upstreamResponse = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    const data = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const errorPayload = {
        error: 'Upstream data.gov.sg PM2.5 API returned an error',
        statusCode: upstreamResponse.status,
        details: data,
      };

      if (res && typeof res.status === 'function') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(upstreamResponse.status).json(errorPayload);
      }

      return new Response(JSON.stringify(errorPayload), {
        status: upstreamResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Success response
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    const errorPayload = {
      error: 'Failed to fetch PM2.5 data from data.gov.sg',
      message: error?.message || 'Internal connection error',
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

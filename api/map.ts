/**
 * Serverless OneMap Search Endpoint
 * Route: GET /api/map
 * Upstream: GET https://www.onemap.gov.sg/api/common/elastic/search?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1
 */

export default async function handler(req: any, res?: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const upstreamBase = 'https://www.onemap.gov.sg/api/common/elastic/search';
    const url = new URL(upstreamBase);

    // Extract query parameters from incoming request
    const query = req.query || (req.url ? Object.fromEntries(new URL(req.url, 'http://localhost').searchParams) : {});

    // Set defaults from specified requirements or pass incoming overrides
    const searchVal = (query.searchVal as string) || '178903';
    const returnGeom = (query.returnGeom as string) || 'Y';
    const getAddrDetails = (query.getAddrDetails as string) || 'Y';
    const pageNum = (query.pageNum as string) || '1';

    url.searchParams.set('searchVal', searchVal);
    url.searchParams.set('returnGeom', returnGeom);
    url.searchParams.set('getAddrDetails', getAddrDetails);
    url.searchParams.set('pageNum', pageNum);

    // Prepare headers - check environment for optional OneMap key/token without hardcoding
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'CaptainHaze/1.0',
    };

    const oneMapToken =
      process.env.ONEMAP_API_KEY ||
      process.env.ONEMAP_TOKEN ||
      process.env.ONEMAP_ACCESS_TOKEN;

    if (oneMapToken) {
      headers['Authorization'] = oneMapToken.startsWith('Bearer ') ? oneMapToken : `Bearer ${oneMapToken}`;
    }

    const upstreamResponse = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    const data = await upstreamResponse.json().catch(() => null);

    if (!upstreamResponse.ok) {
      const errorPayload = {
        error: 'Upstream OneMap search API returned an error',
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
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    const errorPayload = {
      error: 'Failed to fetch search results from OneMap SG',
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

<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';

const getBackendBaseUrl = () =>
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.umuhinzi-backend.echo-solution.com/api/v1';

const PRODUCT_PATHS = ['/products', '/products/all', '/products/available', '/market/products'];

async function tryFetchProducts(
  baseUrl: string,
  path: string,
  query: string,
  headers: HeadersInit
): Promise<Response> {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}${query ? `?${query}` : ''}`;
  return fetch(url, {
    method: 'GET',
    headers,
  });
}

export async function GET(request: NextRequest) {
  const backendBaseUrl = getBackendBaseUrl();
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  const authHeader = request.headers.get('authorization');
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
  };

  let lastResponse: Response | null = null;

  for (const path of PRODUCT_PATHS) {
    try {
      const response = await tryFetchProducts(backendBaseUrl, path, searchParams, headers);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let data: unknown = null;

        if (contentType.includes('application/json')) {
          data = await response.json().catch(() => null);
        } else {
          const text = await response.text().catch(() => '');
          data = text ? { message: text } : null;
        }

        const nextResponse =
          data !== null
            ? NextResponse.json(data, { status: response.status })
            : new NextResponse(null, { status: response.status });

        nextResponse.headers.set('Access-Control-Allow-Origin', '*');
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return nextResponse;
      }

      lastResponse = response;

      if (response.status !== 404) {
        break;
      }
    } catch (error) {
      console.error(`Products proxy error for path ${path}:`, error);
    }
  }

  if (lastResponse) {
    const errorBody = await lastResponse.text().catch(() => null);
    const message =
      errorBody && errorBody.length < 500
        ? errorBody
        : 'Failed to fetch products from the backend service.';

    return NextResponse.json(
      {
        success: false,
        message,
        status: lastResponse.status,
      },
      { status: lastResponse.status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Unable to reach the products service.',
    },
    { status: 502 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

=======
import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrlFromEnv } from '@/lib/backend-config';

const PRODUCT_PATHS = ['/products', '/products/all', '/products/available', '/market/products'];

async function tryFetchProducts(
  baseUrl: string,
  path: string,
  query: string,
  headers: HeadersInit
): Promise<Response> {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}${query ? `?${query}` : ''}`;
  return fetch(url, {
    method: 'GET',
    headers,
  });
}

export async function GET(request: NextRequest) {
  const backendBaseUrl = getBackendBaseUrlFromEnv();
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  const authHeader = request.headers.get('authorization');
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
  };

  let lastResponse: Response | null = null;

  for (const path of PRODUCT_PATHS) {
    try {
      const response = await tryFetchProducts(backendBaseUrl, path, searchParams, headers);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let data: unknown = null;

        if (contentType.includes('application/json')) {
          data = await response.json().catch(() => null);
        } else {
          const text = await response.text().catch(() => '');
          data = text ? { message: text } : null;
        }

        const nextResponse =
          data !== null
            ? NextResponse.json(data, { status: response.status })
            : new NextResponse(null, { status: response.status });

        nextResponse.headers.set('Access-Control-Allow-Origin', '*');
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return nextResponse;
      }

      lastResponse = response;

      if (response.status !== 404) {
        break;
      }
    } catch (error) {
      console.error(`Products proxy error for path ${path}:`, error);
    }
  }

  if (lastResponse) {
    const errorBody = await lastResponse.text().catch(() => null);
    const message =
      errorBody && errorBody.length < 500
        ? errorBody
        : 'Failed to fetch products from the backend service.';

    return NextResponse.json(
      {
        success: false,
        message,
        status: lastResponse.status,
      },
      { status: lastResponse.status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Unable to reach the products service.',
    },
    { status: 502 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
>>>>>>> b725023a91e881d2f9ed5610176694ddf07567aa

import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrlFromEnv } from '@/lib/backend-config';

const ORDER_PATHS = ['/orders/farmer', '/orders/farmers', '/farmers/orders'];

async function tryFetchOrders(
  baseUrl: string,
  path: string,
  headers: HeadersInit
): Promise<Response> {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}`;
  return fetch(url, {
    method: 'GET',
    headers,
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      {
        success: false,
        message: 'Authorization token is required',
      },
      { status: 401 }
    );
  }

  const backendBaseUrl = getBackendBaseUrlFromEnv();
  const headers: HeadersInit = {
    Accept: 'application/json',
    Authorization: authHeader,
  };

  let lastResponse: Response | null = null;

  for (const path of ORDER_PATHS) {
    try {
      const response = await tryFetchOrders(backendBaseUrl, path, headers);

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
      console.error(`Farmer orders proxy error for path ${path}:`, error);
    }
  }

  if (lastResponse) {
    const errorBody = await lastResponse.text().catch(() => null);
    const message =
      errorBody && errorBody.length < 500
        ? errorBody
        : 'Failed to fetch farmer orders from the backend service.';

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
      message: 'Unable to reach the farmer orders service.',
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

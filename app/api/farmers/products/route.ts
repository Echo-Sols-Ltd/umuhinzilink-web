<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';

const getBackendBaseUrl = () =>
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.umuhinzi-backend.echo-solution.com/api/v1';

const PRODUCT_PATHS = ['/products/farmer', '/farmers/products', '/products'];

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

  const backendBaseUrl = getBackendBaseUrl();
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  const headers: HeadersInit = {
    Accept: 'application/json',
    Authorization: authHeader,
  };

  let lastResponse: Response | null = null;
  let lastStatus: number | null = null;
  let lastMessage: string | null = null;

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
      lastStatus = response.status;
      lastMessage = await response.text().catch(() => null);

      if (response.status !== 404) {
        break;
      }
    } catch (error) {
      console.error(`Farmer products proxy error for path ${path}:`, error);
    }
  }

  if (lastResponse) {
    const message =
      lastStatus === 404 && lastMessage?.toLowerCase().includes('no static resource')
        ? 'No products found for this farmer.'
        : lastMessage && lastMessage.length < 500
          ? lastMessage
          : 'Failed to fetch farmer products from the backend service.';

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
      message: 'Unable to reach the farmer products service.',
    },
    { status: 502 }
  );
}

export async function POST(request: NextRequest) {
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

  const backendBaseUrl = getBackendBaseUrl();
  const formData = await request.formData();
  const createPaths = [
    '/products',
    '/products/',
    '/products/farmer',
    '/farmers/products',
    '/products/create',
    '/farmer/products',
    '/farmer/products/create',
    '/farmers/products/create',
    '/produce',
    '/products/upload',
    '/products/add',
    '/farmers/products/add',
    '/farmer/products/add',
    '/farmers/product',
    '/farmers/product/create',
    '/farmer/product',
    '/farmer/product/create',
    '/products/new',
    '/farmer/products/new',
    '/farmers/products/new',
  ];

  let lastStatus: number | null = null;
  let lastMessage: string | null = null;

  for (const path of createPaths) {
    const uploadUrl = `${backendBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        body: formData,
      });

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
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return nextResponse;
      }

      lastStatus = response.status;
      lastMessage = await response.text().catch(() => null);

      if (response.status === 404 && lastMessage?.toLowerCase().includes('no static resource')) {
        continue;
      }

      return NextResponse.json(
        {
          success: false,
          message:
            lastMessage && lastMessage.length < 500
              ? lastMessage
              : 'Failed to create farmer product.',
          status: response.status,
        },
        { status: response.status }
      );
    } catch (error) {
      console.error(`Farmer products POST proxy error for path ${path}:`, error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create farmer product.',
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  const fallbackMessage =
    lastStatus === 404 && lastMessage?.toLowerCase().includes('no static resource')
      ? 'Product creation endpoint is not available on the backend.'
      : lastMessage && lastMessage.length < 500
        ? lastMessage
        : 'Failed to create farmer product.';

  return NextResponse.json(
    {
      success: false,
      message: fallbackMessage,
      status: lastStatus ?? 404,
    },
    { status: lastStatus ?? 404 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

=======
import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrlFromEnv } from '@/lib/backend-config';

const PRODUCT_PATHS = ['/products/farmer', '/farmers/products', '/products'];

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
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();

  const headers: HeadersInit = {
    Accept: 'application/json',
    Authorization: authHeader,
  };

  let lastResponse: Response | null = null;
  let lastStatus: number | null = null;
  let lastMessage: string | null = null;

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
      lastStatus = response.status;
      lastMessage = await response.text().catch(() => null);

      if (response.status !== 404) {
        break;
      }
    } catch (error) {
      console.error(`Farmer products proxy error for path ${path}:`, error);
    }
  }

  if (lastResponse) {
    const message =
      lastStatus === 404 && lastMessage?.toLowerCase().includes('no static resource')
        ? 'No products found for this farmer.'
        : lastMessage && lastMessage.length < 500
          ? lastMessage
          : 'Failed to fetch farmer products from the backend service.';

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
      message: 'Unable to reach the farmer products service.',
    },
    { status: 502 }
  );
}

export async function POST(request: NextRequest) {
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
  const formData = await request.formData();
  const createPaths = [
    '/products',
    '/products/',
    '/products/farmer',
    '/farmers/products',
    '/products/create',
    '/farmer/products',
    '/farmer/products/create',
    '/farmers/products/create',
    '/produce',
    '/products/upload',
    '/products/add',
    '/farmers/products/add',
    '/farmer/products/add',
    '/farmers/product',
    '/farmers/product/create',
    '/farmer/product',
    '/farmer/product/create',
    '/products/new',
    '/farmer/products/new',
    '/farmers/products/new',
  ];

  let lastStatus: number | null = null;
  let lastMessage: string | null = null;

  for (const path of createPaths) {
    const uploadUrl = `${backendBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        body: formData,
      });

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
        nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return nextResponse;
      }

      lastStatus = response.status;
      lastMessage = await response.text().catch(() => null);

      if (response.status === 404 && lastMessage?.toLowerCase().includes('no static resource')) {
        continue;
      }

      return NextResponse.json(
        {
          success: false,
          message:
            lastMessage && lastMessage.length < 500
              ? lastMessage
              : 'Failed to create farmer product.',
          status: response.status,
        },
        { status: response.status }
      );
    } catch (error) {
      console.error(`Farmer products POST proxy error for path ${path}:`, error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create farmer product.',
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  const fallbackMessage =
    lastStatus === 404 && lastMessage?.toLowerCase().includes('no static resource')
      ? 'Product creation endpoint is not available on the backend.'
      : lastMessage && lastMessage.length < 500
        ? lastMessage
        : 'Failed to create farmer product.';

  return NextResponse.json(
    {
      success: false,
      message: fallbackMessage,
      status: lastStatus ?? 404,
    },
    { status: lastStatus ?? 404 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
>>>>>>> b725023a91e881d2f9ed5610176694ddf07567aa

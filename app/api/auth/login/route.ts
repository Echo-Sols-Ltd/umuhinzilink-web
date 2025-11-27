import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
=======
import { getBackendBaseUrlFromEnv } from '@/lib/backend-config';
>>>>>>> b725023a91e881d2f9ed5610176694ddf07567aa

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Email and password are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

<<<<<<< HEAD
    const backendBaseUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://api.umuhinzi-backend.echo-solution.com/api/v1';
=======
    const backendBaseUrl = getBackendBaseUrlFromEnv();
>>>>>>> b725023a91e881d2f9ed5610176694ddf07567aa

    const apiUrl = `${backendBaseUrl.replace(/\/$/, '')}/auth/login`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data: unknown = null;
    const contentType = response.headers.get('content-type') || '';

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
<<<<<<< HEAD
    nextResponse.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
=======
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
>>>>>>> b725023a91e881d2f9ed5610176694ddf07567aa

    return nextResponse;
  } catch (error: unknown) {
    console.error('Login API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

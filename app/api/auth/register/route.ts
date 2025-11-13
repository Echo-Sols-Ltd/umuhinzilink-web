import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.names || !body.email || !body.phoneNumber || !body.password || !body.role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Determine backend base URL from environment
    const backendBaseUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://api.umuhinzi-backend.echo-solution.com/api/v1';

    if (!backendBaseUrl) {
      throw new Error('Backend API URL is not configured');
    }

    const apiUrl = `${backendBaseUrl.replace(/\/$/, '')}/auth/register`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    let data: unknown = null;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      data = text ? { message: text } : null;
    }

    // Return the response with proper CORS headers
    const nextResponse =
      data !== null
        ? NextResponse.json(data, { status: response.status })
        : new NextResponse(null, { status: response.status });

    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    nextResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    return nextResponse;
  } catch (error: unknown) {
    console.error('Registration API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: errorMessage,
      },
      {
        status: 500,
        headers: {
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

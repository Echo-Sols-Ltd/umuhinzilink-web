import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LEGACY_ROUTE_REDIRECTS } from '@/lib/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const redirectPath = LEGACY_ROUTE_REDIRECTS[pathname];
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (pathname.startsWith('/supplier/products/restock/')) {
    const id = pathname.split('/').pop();
    if (id) {
      return NextResponse.redirect(new URL(`/products/${id}/edit`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/products/mine',
    '/chat',
    '/seller/dashboard',
    '/buyer/profile',
    '/seller/profile',
    '/admin/profile',
    '/supplier/products',
    '/supplier/orders',
    '/buyer/orders',
    '/purchases',
    '/supplier/products/restock/:path*',
    '/about',
  ],
};

import { UserRole } from '@/types';

/** Canonical app routes — single source of truth for navigation links. */
export const ROUTES = {
  home: '/',
  products: '/products',
  productDetail: (id: string) => `/products/${id}` as const,
  productEdit: (id: string) => `/products/${id}/edit` as const,
  productCreate: '/products/create',
  sellerProducts: '/products/seller',
  savedProducts: '/products/saved',
  orders: '/orders',
  orderDetail: (id: string) => `/orders/${id}` as const,
  negotiations: '/negotiations',
  negotiationDetail: (id: string) => `/negotiations/${id}` as const,
  dashboard: '/dashboard',
  profile: '/profile',
  profileEdit: '/profile/edit',
  wallet: '/wallet',
  settings: '/settings',
  notifications: '/notifications',
  becomeSeller: '/become-seller',
  homeWho: '/#who',
  homeFeatures: '/#features',
  homeContact: '/#contact',
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    userDetail: (id: string) => `/admin/users/${id}` as const,
    orders: '/admin/orders',
    orderDetail: (id: string) => `/admin/orders/${id}` as const,
    products: '/admin/products',
    productDetail: (id: string) => `/admin/products/${id}` as const,
    wallets: '/admin/wallets',
    walletDetail: (id: string) => `/admin/wallets/${id}` as const,
    analytics: '/admin/analytics',
    settings: '/admin/settings',
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export interface AdminNavItem extends NavLink {
  /** Used for prefix matching on nested admin routes (e.g. /admin/users/[id]). */
  matchPrefix?: boolean;
}

const GUEST_NAV: NavLink[] = [
  { label: 'Who is it for', href: ROUTES.homeWho },
  { label: 'Features', href: ROUTES.homeFeatures },
  { label: 'Become a seller', href: ROUTES.becomeSeller },
];

const BUYER_NAV: NavLink[] = [
  { label: 'Browse', href: ROUTES.products },
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'My Orders', href: ROUTES.orders },
  { label: 'Negotiations', href: ROUTES.negotiations },
];

const SELLER_NAV: NavLink[] = [
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'My Listings', href: ROUTES.sellerProducts },
  { label: 'My Orders', href: ROUTES.orders },
  { label: 'Negotiations', href: ROUTES.negotiations },
];

const ADMIN_NAV: NavLink[] = [
  { label: 'Dashboard', href: ROUTES.admin.dashboard },
  { label: 'Users', href: ROUTES.admin.users },
  { label: 'Orders', href: ROUTES.admin.orders },
  { label: 'Products', href: ROUTES.admin.products },
  { label: 'Wallets', href: ROUTES.admin.wallets },
];

export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: ROUTES.admin.dashboard },
  { label: 'Users', href: ROUTES.admin.users, matchPrefix: true },
  { label: 'Orders', href: ROUTES.admin.orders, matchPrefix: true },
  { label: 'Products', href: ROUTES.admin.products, matchPrefix: true },
  { label: 'Wallets', href: ROUTES.admin.wallets, matchPrefix: true },
  { label: 'Analytics', href: ROUTES.admin.analytics },
  { label: 'Settings', href: ROUTES.admin.settings },
];

export const BUYER_SIDEBAR_NAV: AdminNavItem[] = [
  { label: 'Browse', href: ROUTES.products, matchPrefix: true },
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'My Orders', href: ROUTES.orders, matchPrefix: true },
  { label: 'Negotiations', href: ROUTES.negotiations, matchPrefix: true },
  { label: 'Saved', href: ROUTES.savedProducts },
];

export const BUYER_SIDEBAR_ACCOUNT: AdminNavItem[] = [
  { label: 'Wallet', href: ROUTES.wallet },
  { label: 'Profile', href: ROUTES.profile, matchPrefix: true },
  { label: 'Notifications', href: ROUTES.notifications },
  { label: 'Settings', href: ROUTES.settings },
];

export const SELLER_SIDEBAR_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'My Listings', href: ROUTES.sellerProducts, matchPrefix: true },
  { label: 'Add Listing', href: ROUTES.productCreate },
  { label: 'My Orders', href: ROUTES.orders, matchPrefix: true },
  { label: 'Negotiations', href: ROUTES.negotiations, matchPrefix: true },
];

export const SELLER_SIDEBAR_ACCOUNT: AdminNavItem[] = [
  { label: 'Wallet', href: ROUTES.wallet },
  { label: 'Profile', href: ROUTES.profile, matchPrefix: true },
  { label: 'Notifications', href: ROUTES.notifications },
  { label: 'Settings', href: ROUTES.settings },
];

export const ADMIN_SIDEBAR_ACCOUNT: AdminNavItem[] = [
  { label: 'Notifications', href: ROUTES.notifications },
];

/** Marketplace routes reserved for buyers and sellers — not admins. */
const PARTICIPANT_ROUTE_PREFIXES = ['/products', '/orders', '/negotiations', '/profile'] as const;
const PARTICIPANT_ROUTE_EXACT = ['/dashboard', '/wallet', '/become-seller', '/settings'] as const;

export function isParticipantMarketplaceRoute(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return false;
  if (PARTICIPANT_ROUTE_EXACT.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return true;
  }
  return PARTICIPANT_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** Map a participant URL to the closest admin oversight screen. */
export function getAdminRedirectForRoute(pathname: string): string {
  if (pathname.startsWith('/products/') && pathname !== '/products/create' && pathname !== '/products/seller' && pathname !== '/products/saved') {
    const segments = pathname.split('/').filter(Boolean);
    const productId = segments[1];
    if (productId && productId !== 'create' && productId !== 'seller' && productId !== 'saved') {
      return ROUTES.admin.productDetail(productId);
    }
  }
  if (pathname.startsWith('/products')) return ROUTES.admin.products;
  if (pathname.startsWith('/orders/')) {
    const orderId = pathname.split('/')[2];
    if (orderId) return ROUTES.admin.orderDetail(orderId);
  }
  if (pathname.startsWith('/orders')) return ROUTES.admin.orders;
  if (pathname.startsWith('/wallet')) return ROUTES.admin.wallets;
  if (pathname.startsWith('/settings') || pathname.startsWith('/profile')) return ROUTES.admin.settings;
  return ROUTES.admin.dashboard;
}

/** Default landing route after sign-in, by role. */
export function getDashboardRoute(role?: UserRole | null): string {
  if (role === UserRole.ADMIN) return ROUTES.admin.dashboard;
  return ROUTES.dashboard;
}

/** Resolve a safe internal redirect after auth; falls back to the role dashboard. */
export function resolvePostAuthRoute(role?: UserRole | null, redirect?: string | null): string {
  const fallback = getDashboardRoute(role);
  if (!redirect) return fallback;

  const path = redirect.trim();
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/auth/')) {
    return fallback;
  }
  if (role === UserRole.ADMIN && isParticipantMarketplaceRoute(path)) {
    return getAdminRedirectForRoute(path);
  }
  return path;
}

/** Read optional ?redirect= from the current URL and resolve the post-auth destination. */
export function getPostAuthRouteFromWindow(role?: UserRole | null): string {
  if (typeof window === 'undefined') return getDashboardRoute(role);
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  return resolvePostAuthRoute(role, redirect);
}

export function getNavbarLinks(role?: UserRole | null): NavLink[] {
  if (!role) return GUEST_NAV;
  switch (role) {
    case UserRole.ADMIN:
      return ADMIN_NAV;
    case UserRole.SELLER:
      return SELLER_NAV;
    case UserRole.BUYER:
    default:
      return BUYER_NAV;
  }
}

/** Avatar / profile menu links shown in sidebar and navbar dropdowns. */
export function getProfileMenuLinks(role: UserRole): NavLink[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        { label: 'Profile', href: ROUTES.admin.settings },
        { label: 'Admin Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Platform Wallets', href: ROUTES.admin.wallets },
        { label: 'Notifications', href: ROUTES.notifications },
      ];
    case UserRole.SELLER:
      return [
        { label: 'Profile', href: ROUTES.profile },
        { label: 'Seller Dashboard', href: ROUTES.dashboard },
        { label: 'Wallet', href: ROUTES.wallet },
        { label: 'Notifications', href: ROUTES.notifications },
        { label: 'Settings', href: ROUTES.settings },
      ];
    case UserRole.BUYER:
    default:
      return [
        { label: 'Profile', href: ROUTES.profile },
        { label: 'Dashboard', href: ROUTES.dashboard },
        { label: 'Become a Seller', href: ROUTES.becomeSeller },
        { label: 'Wallet', href: ROUTES.wallet },
        { label: 'Notifications', href: ROUTES.notifications },
        { label: 'Settings', href: ROUTES.settings },
      ];
  }
}

/** Returns true when `pathname` corresponds to the given nav href. */
export function isNavLinkActive(pathname: string, href: string, matchPrefix = false): boolean {
  if (href.includes('#')) {
    return pathname === href.split('#')[0];
  }
  if (matchPrefix) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

/** Legacy paths that should redirect to canonical routes (handled in middleware). */
export const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/products/mine': ROUTES.sellerProducts,
  '/chat': ROUTES.negotiations,
  '/seller/dashboard': ROUTES.dashboard,
  '/buyer/profile': ROUTES.profile,
  '/seller/profile': ROUTES.profile,
  '/admin/profile': ROUTES.profile,
  '/supplier/products': ROUTES.sellerProducts,
  '/supplier/orders': ROUTES.orders,
  '/about': ROUTES.home,
};

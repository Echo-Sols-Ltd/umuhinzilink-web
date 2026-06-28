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
  { label: 'Browse', href: ROUTES.products },
  { label: 'Dashboard', href: ROUTES.dashboard },
  { label: 'My Listings', href: ROUTES.sellerProducts },
  { label: 'My Orders', href: ROUTES.orders },
  { label: 'Negotiations', href: ROUTES.negotiations },
];

const ADMIN_NAV: NavLink[] = [
  { label: 'Browse', href: ROUTES.products },
  { label: 'Admin', href: ROUTES.admin.dashboard },
  { label: 'Orders', href: ROUTES.orders },
  { label: 'Negotiations', href: ROUTES.negotiations },
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

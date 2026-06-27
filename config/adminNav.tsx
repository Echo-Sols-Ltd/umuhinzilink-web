import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Sprout,
  Wallet,
  BarChart2,
  Settings,
  Store,
} from 'lucide-react';

export interface AdminNavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

export interface AdminNavGroup {
  labelKey?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    labelKey: 'sidebar.groups.overview',
    items: [
      { labelKey: 'sidebar.items.dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
      { labelKey: 'sidebar.items.platformAnalytics', href: '/admin/analytics', icon: <BarChart2 size={16} /> },
    ],
  },
  {
    labelKey: 'nav.groups.manage',
    items: [
      { labelKey: 'sidebar.items.userManagement', href: '/admin/users', icon: <Users size={16} /> },
      { labelKey: 'sidebar.items.productManagement', href: '/admin/products', icon: <Sprout size={16} /> },
      { labelKey: 'sidebar.items.orderManagement', href: '/admin/orders', icon: <ShoppingCart size={16} /> },
      { labelKey: 'sidebar.items.walletManagement', href: '/admin/wallets', icon: <Wallet size={16} /> },
    ],
  },
  {
    labelKey: 'nav.groups.system',
    items: [
      { labelKey: 'sidebar.items.settings', href: '/admin/settings', icon: <Settings size={16} /> },
      { labelKey: 'sidebar.items.marketplace', href: '/products', icon: <Store size={16} /> },
    ],
  },
];

/** Flat links for the top Navbar when an admin browses outside the admin shell */
export const ADMIN_TOP_NAV_LINKS = [
  { labelKey: 'nav.adminTop.console', href: '/admin/dashboard' },
  { labelKey: 'nav.adminTop.users', href: '/admin/users' },
  { labelKey: 'nav.adminTop.orders', href: '/admin/orders' },
  { labelKey: 'nav.adminTop.products', href: '/admin/products' },
  { labelKey: 'nav.adminTop.wallets', href: '/admin/wallets' },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') {
    return pathname === '/admin/dashboard';
  }
  if (href === '/products') {
    return pathname === '/products' || pathname.startsWith('/products/');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

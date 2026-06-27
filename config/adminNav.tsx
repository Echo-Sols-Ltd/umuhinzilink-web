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
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface AdminNavGroup {
  label?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: 'Analytics', href: '/admin/analytics', icon: <BarChart2 size={16} /> },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Users', href: '/admin/users', icon: <Users size={16} /> },
      { label: 'Products', href: '/admin/products', icon: <Sprout size={16} /> },
      { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={16} /> },
      { label: 'Wallets', href: '/admin/wallets', icon: <Wallet size={16} /> },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: <Settings size={16} /> },
      { label: 'Marketplace', href: '/products', icon: <Store size={16} /> },
    ],
  },
];

/** Flat links for the top Navbar when an admin browses outside the admin shell */
export const ADMIN_TOP_NAV_LINKS = [
  { label: 'Console', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Wallets', href: '/admin/wallets' },
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

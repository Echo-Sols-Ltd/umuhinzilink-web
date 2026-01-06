import {
  CheckCircle,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Mail,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { SupplierPages } from '@/types';

type MenuItem = {
  label: string;
  page: SupplierPages;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', page: SupplierPages.DASHBOARD, href: '/supplier/dashboard', icon: CheckCircle },
  { label: 'My Inputs', page: SupplierPages.PRODUCTS, href: '/supplier/products', icon: LayoutGrid },
  { label: 'Farmer Request', page: SupplierPages.REQUESTS, href: '/supplier/requests', icon: FilePlus },
  { label: 'Orders', page: SupplierPages.ORDERS, href: '/supplier/orders', icon: ShoppingCart },
  { label: 'Message', page: SupplierPages.MESSAGE, href: '/supplier/message', icon: Mail },
  { label: 'Profile', page: SupplierPages.PROFILE, href: '/supplier/profile', icon: User },
  { label: 'Contact', page: SupplierPages.CONTACT, href: '/supplier/contact', icon: Phone },
  { label: 'Settings', page: SupplierPages.SETTINGS, href: '/supplier/settings', icon: Settings },
  { label: 'Logout', page: SupplierPages.LOGOUT, href: '#', icon: LogOut, isLogout: true },
];

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

interface Props {
  activePage: SupplierPages;
  handleLogout: () => void;
  logoutPending: boolean;
}

export default function SupplierSidebar({ activePage, handleLogout, logoutPending }: Props) {
  return (
    <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-1">
        <Logo />
        {MENU_ITEMS.map((item, index) => {
          const isActive = item.page === activePage;
          const Icon = item.icon;
          const showDivider = index === 3 || index === 7;
          return (
            <div key={item.label}>
              {item.isLogout ? (
                <div
                  onClick={handleLogout}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium text-white hover:bg-green-700`}
                >
                  {logoutPending ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </>
                  )}
                </div>
              ) : (
                <Link href={item.href} className="block">
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                      ${isActive
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-white hover:bg-green-700'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )}
              {showDivider && <div className="border-t border-green-500 my-2 mx-3"></div>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

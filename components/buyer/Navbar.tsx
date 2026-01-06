import {
  CheckCircle,
  Heart,
  Mail,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  FilePlus,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { BuyerPages } from '@/types';

type MenuItem = {
  label: string;
  page: BuyerPages;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', page: BuyerPages.DASHBOARD, href: '/buyer/dashboard', icon: CheckCircle },
  { label: 'My Purchase', page: BuyerPages.PURCHASES, href: '/buyer/purchases', icon: ShoppingCart },
  { label: 'Browse Product', page: BuyerPages.PRODUCT, href: '/buyer/product', icon: FilePlus },
  { label: 'Saved Items', page: BuyerPages.SAVED, href: '/buyer/saved', icon: Heart },
  { label: 'Message', page: BuyerPages.MESSAGE, href: '/buyer/message', icon: Mail },
  { label: 'Profile', page: BuyerPages.PROFILE, href: '/buyer/profile', icon: User },
  { label: 'Contact', page: BuyerPages.CONTACT, href: '/buyer/contact', icon: Phone },
  { label: 'Settings', page: BuyerPages.SETTINGS, href: '/buyer/settings', icon: Settings },
  { label: 'Logout', page: BuyerPages.LOGOUT, href: '#', icon: LogOut, isLogout: true },
];

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

interface Props {
  activePage: BuyerPages;
  handleLogout: () => void;
  logoutPending: boolean;
}

export default function BuyerSidebar({ activePage, handleLogout, logoutPending }: Props) {
  return (
    <aside className="w-64 bg-green-600 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item, index) => {
          const isActive = item.page === activePage;
          const Icon = item.icon;
          const showDivider = index === 4 || index === 8;
          return (
            <div key={item.label}>
              {item.isLogout ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutPending}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-white ${logoutPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                    }`}
                >
                  {logoutPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <Icon className="w-5 h-5 text-white" />
                      <span>{item.label}</span>
                    </>
                  )}
                </button>
              ) : (
                <Link href={item.href} className="block">
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                      ${isActive
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-white hover:bg-green-700'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )}
              {showDivider && <div className="border-t border-green-500 my-2 mx-4"></div>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

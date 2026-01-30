'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  BarChart2,
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  Search,
  ChevronDown,
  Tractor,
  DollarSign,
  Loader2,
  Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { GovernmentPages, UserType } from '@/types';

export type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/government/dashboard', icon: LayoutGrid },
  { label: 'Farmers Produce', href: '/government/farmer/s-produce', icon: Tractor },
  { label: 'Suppliers Produce', href: '/government/suppliers-produce', icon: Package },
  { label: 'Market analytics', href: '/government/market-analytics', icon: BarChart2 },
  { label: 'Notifications', href: '/government/notifications', icon: Bell },
  { label: 'Profile', href: '/government/profile', icon: UserIcon },
  { label: 'Settings', href: '/government/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function formatDate() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

interface GovernmentLayoutProps {
  children: React.ReactNode;
  activePage: GovernmentPages;
  headerTitle?: string;
  showDateInHeader?: boolean;
}

export function GovernmentLayout({
  children,
  activePage,
  headerTitle,
  showDateInHeader = false,
}: GovernmentLayoutProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {
    if (logoutPending) return;


  };

  const shortName = useMemo(() => {
    if (!user?.names) return 'Admin';
    const parts = user.names.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  }, [user?.names]);

  const initials = useMemo(() => getInitials(user?.names || 'Admin'), [user?.names]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          userType={UserType.GOVERNMENT}
          activeItem={activePage === GovernmentPages.DASHBOARD ? 'Dashboard' :
            activePage === GovernmentPages.FARMERS_PRODUCE ? 'Farmers Produce' :
              activePage === GovernmentPages.SUPPLIERS_PRODUCE ? 'Suppliers Produce' :
                activePage === GovernmentPages.NOTIFICATIONS ? 'Notifications' :
                  activePage === GovernmentPages.PROFILE ? 'Profile' :
                    activePage === GovernmentPages.SETTINGS ? 'Settings' : 'Dashboard'}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64 relative bg-white">
          <header className="fixed top-0 left-64 right-0 z-30 bg-gray-800 border-b h-16 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center space-x-4 flex-1">
              {headerTitle && (
                <h1 className="text-lg font-semibold text-gray-200">{headerTitle}</h1>
              )}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="search here"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {showDateInHeader && (
                <div className="text-sm text-gray-300">{formatDate()}</div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span role="img" aria-label="UK flag">
                  🇬🇧
                </span>
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Bell className="w-5 h-5 text-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{initials || 'A'}</span>
                </div>
                <span className="text-sm font-medium text-gray-200">{shortName}</span>
                <ChevronDown className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </header>
          <div className="p-6 mt-16">{children}</div>
        </main>
      </div>
    </div>
  );
}


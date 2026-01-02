'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  Mail,
  LayoutGrid,
  FilePlus,
  MessageSquare,
  BarChart2,
  ShoppingCart,
  Settings,
  LogOut,
  Leaf,
  Mail as MailIcon,
  Bell,
  Package,
  Loader2,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

type FarmerProfile = {
  id: string;
  names: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    district?: string;
    province?: string;
  } | null;
  farmSize?: string;
  crops?: string[];
  experienceLevel?: string;
  createdAt?: string;
  updatedAt?: string;
};

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: LayoutGrid },
  { label: 'Products', href: '/farmer/products', icon: Package },
  { label: 'Input Request', href: '/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/farmer/market_analysis', icon: BarChart2 },
  { label: 'Messages', href: '/farmer/message', icon: MailIcon },
  { label: 'Notifications', href: '/farmer/notifications', icon: Bell },
  { label: 'Orders', href: '/farmer/orders', icon: ShoppingCart },
  { label: 'Profile', href: '/farmer/profile', icon: User },
  { label: 'Settings', href: '/farmer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

export default function FarmerProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user: currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutPending, setLogoutPending] = useState(false);


  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError('You need to sign in to view your profile.');
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {

    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);
    logout();

  };

  const displayName = profile?.names || currentUser?.names || 'Farmer';
  const [firstName, ...restNames] = displayName.split(' ');
  const lastName = restNames.join(' ');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-[#00A63E] flex flex-col fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="flex items-center px-6 py-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-bold text-xl text-white">UmuhinziLink</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const showDivider = index === 4 || index === 9;

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
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${isActive
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-white hover:bg-green-700'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )}
                {showDivider && <div className="border-t border-gray-200 my-2 mx-4" />}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 ml-64 bg-gray-50">
        <header className="bg-white border-b h-16 flex items-center px-8 shadow-sm justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <p className="text-xs text-gray-500">Manage your farmer details</p>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex items-center justify-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6 text-red-600">
              {error}
            </div>
          ) : !profile ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-500">
              Profile data is not available right now.
            </div>
          ) : (
            <section className="max-w-4xl bg-white rounded-lg shadow-sm border p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                    <p className="text-gray-500">Registered Farmer</p>
                    {profile.farmSize && (
                      <p className="text-xs text-gray-400">Farm size: {profile.farmSize}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(profile.updatedAt || profile.createdAt)}
                </div>
              </div>

              <div className="space-y-6">
                <Section title="Personal Information">
                  <Field
                    label="First Name"
                    value={firstName}
                    icon={<User className="w-4 h-4 text-gray-500" />}
                  />
                  <Field
                    label="Last Name"
                    value={lastName || '—'}
                    icon={<User className="w-4 h-4 text-gray-500" />}
                  />
                </Section>

                <Section title="Contact Information">
                  <Field
                    label="Phone Number"
                    value={profile.phoneNumber || '—'}
                    icon={<Phone className="w-4 h-4 text-gray-500" />}
                  />
                  <Field
                    label="Email"
                    value={profile.email || '—'}
                    icon={<Mail className="w-4 h-4 text-gray-500" />}
                  />
                </Section>

                <Section title="Address">
                  <Field
                    label="District"
                    value={profile.address?.district || '—'}
                    icon={<MapPin className="w-4 h-4 text-gray-500" />}
                  />
                  <Field
                    label="Province"
                    value={profile.address?.province || '—'}
                    icon={<MapPin className="w-4 h-4 text-gray-500" />}
                  />
                </Section>

                <Section title="Farming Details">
                  <Field label="Farm Size" value={profile.farmSize || '—'} />
                  <Field
                    label="Crops"
                    value={profile.crops && profile.crops.length ? profile.crops.join(', ') : '—'}
                  />
                  <Field label="Experience Level" value={profile.experienceLevel || '—'} />
                </Section>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  const content = value ? (
    <span>{value}</span>
  ) : (
    <span className="text-gray-400">Not provided</span>
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 min-h-[2.5rem]">
        {icon}
        {content}
      </div>
    </div>
  );
}

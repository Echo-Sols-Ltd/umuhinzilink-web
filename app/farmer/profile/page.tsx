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
  Bell,
  Package,
  Loader2,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import FarmerSidebar from '@/components/farmer/Navbar';
import { FarmerPages } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

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

function FarmerProfileComponent() {
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

    const fetchProfile = async () => {};

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

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
      <FarmerSidebar
        activePage={FarmerPages.PROFILE}
        logoutPending={logoutPending}
        handleLogout={handleLogout}
      />

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

export default function FarmerProfilePage() {
  return (
    <FarmerGuard>
      <FarmerProfileComponent />
    </FarmerGuard>
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

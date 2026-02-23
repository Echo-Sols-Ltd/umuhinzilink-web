'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { useProfile } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Import role-specific profile components
import FarmerProfileComponent from '@/components/profile/FarmerProfile';
import SupplierProfileComponent from '@/components/profile/SupplierProfile';
import BuyerProfileComponent from '@/components/profile/BuyerProfile';
import GovernmentProfileComponent from '@/components/profile/GovernmentProfile';
import AdminProfileComponent from '@/components/profile/AdminProfile';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function GlobalProfileComponent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { profile, farmerProfile, supplierProfile, buyerProfile, loading: profileLoading, error, getRoleInfo } = useProfile();

  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className='text-green-600 animate-spin' size={50} />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading profile: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo();

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={user?.role as UserType}
            activeItem='Profile'
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full bg-white overflow-auto">
          {/* Header */}
          <header className="bg-white border-b h-16 flex items-center px-6 shadow-sm justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
              <p className="text-xs text-gray-500">
                Manage your {roleInfo?.label.toLowerCase() || 'user'} details
              </p>
            </div>
            {roleInfo && (
              <div className="flex items-center gap-2">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {roleInfo.label}
                </span>
              </div>
            )}
          </header>

          {/* Role-specific profile content */}
          <div className="p-6">
            {user.role === UserType.FARMER && (
              <FarmerProfileComponent profile={farmerProfile} />
            )}
            {user.role === UserType.SUPPLIER && (
              <SupplierProfileComponent profile={supplierProfile} />
            )}
            {user.role === UserType.BUYER && (
              <BuyerProfileComponent profile={buyerProfile} />
            )}
            {user.role === UserType.GOVERNMENT && (
              <GovernmentProfileComponent profile={user} />
            )}
            {user.role === UserType.ADMIN && (
              <AdminProfileComponent profile={user} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GlobalProfilePage() {
  return <GlobalProfileComponent />;
}

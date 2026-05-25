'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Import role-specific profile components
import FarmerProfileComponent from '@/components/profile/FarmerProfile';
import SupplierProfileComponent from '@/components/profile/SellerProfile';
import BuyerProfileComponent from '@/components/profile/BuyerProfile';
import AdminProfileComponent from '@/components/profile/AdminProfile';
import { useUser } from '@/contexts/UserContext';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-success">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function GlobalProfileComponent() {
  const { user, loading: authLoading, } = useAuth();
  const router = useRouter();
  const { loading: userLoading } = useUser()
  const loading = authLoading || userLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className='text-success animate-spin' size={50} />
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
          <div className="text-destructive mb-4">Error loading profile: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-success text-white rounded hover:bg-success/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={user?.role as UserRole}
            activeItem='Profile'
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full bg-background overflow-auto">
          {/* Header */}
          <header className="bg-card border-b h-16 flex items-center px-6 shadow-sm justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Profile</h1>
              <p className="text-xs text-muted-foreground">
                Manage your {roleInfo?.label.toLowerCase() || 'user'} details
              </p>
            </div>
            {roleInfo && (
              <div className="flex items-center gap-2">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                  {roleInfo.label}
                </span>
              </div>
            )}
          </header>

          {/* Role-specific profile content */}
          <div className="p-6">
            {user.role === UserRole.SELLER && (
              <SupplierProfileComponent profile={supplierProfile} />
            )}
            {user.role === UserRole.BUYER && (
              <BuyerProfileComponent profile={buyerProfile} />
            )}

            {user.role === UserRole.ADMIN && (
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

'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import AdminGuard from '@/contexts/guard/AdminGuard';
import AdminProfileComponent from '@/components/profile/AdminProfile';

function AdminProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Profile'
      />

      <main className="flex-1 h-full bg-white overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center px-6 shadow-sm justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Profile</h1>
            <p className="text-xs text-gray-500">Manage your administrator account</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Administrator
            </span>
          </div>
        </header>

        {/* Profile Content */}
        <div className="p-6">
          <AdminProfileComponent profile={user} />
        </div>
      </main>
    </div>
  );
}

export default function AdminProfilePageWrapper() {
  return (
    <AdminGuard>
      <AdminProfilePage />
    </AdminGuard>
  );
}

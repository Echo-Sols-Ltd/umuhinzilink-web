'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      if (!user.verified) {
        // router.push('/auth/verify-otp');
        return
      }
      // Redirect to role-specific dashboard
      switch (user.role) {
        case UserType.FARMER:
          router.push('/farmer/dashboard');
          break;
        case UserType.BUYER:
          router.push('/buyer/dashboard');
          break;
        case UserType.SUPPLIER:
          router.push('/supplier/dashboard');
          break;
        case UserType.ADMIN:
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } else if (!loading && !user) {
      router.push('/dashboard');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

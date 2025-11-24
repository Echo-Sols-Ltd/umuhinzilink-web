'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/enums';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleBasedDashboardProps {
  children: React.ReactNode;
}

export function RoleBasedDashboard({ children }: RoleBasedDashboardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Route users to their appropriate dashboard based on role
      const currentPath = window.location.pathname;

      // If user is on generic /dashboard, redirect to role-specific dashboard
      if (currentPath === '/dashboard') {
        switch (user.role) {
          case UserType.FARMER:
            router.replace('/farmer_dashboard');
            break;
          case UserType.BUYER:
            router.replace('/buyer_dashboard');
            break;
          case UserType.SUPPLIER:
            router.replace('/supplier_dashboard');
            break;
          default:
            // Keep on generic dashboard for admin or unknown roles
            break;
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return <>{children}</>;
}

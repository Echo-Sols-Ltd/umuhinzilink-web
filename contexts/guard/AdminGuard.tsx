'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import PageLoading from '@/components/layout/PageLoading';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { startFetchingResources } = useAdmin();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.replace('/unauthorized');
      return;
    }
    startFetchingResources();
  }, [loading, user, router, startFetchingResources]);

  // Show spinner while auth is loading
  if (loading) {
    return (
      <PageLoading
        label="Loading your session"
        description="Verifying admin access…"
      />
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;

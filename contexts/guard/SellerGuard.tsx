'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole} from '@/types';
import PageLoading from '@/components/layout/PageLoading';

const SellerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still initializing — wait

    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    if (user.role !== UserRole.SELLER) {
      router.replace('/unauthorized');
    }
  }, [user, loading, router]);

  // Show spinner while auth is loading
  if (loading) {
    return (
      <PageLoading
        label="Loading your session"
        description="Verifying seller access…"
      />
    );
  }

  // Don't render children until we know user is the right role
  if (!user || user.role !== UserRole.SELLER) {
    return null;
  }

  return <>{children}</>;
};

export default SellerGuard;

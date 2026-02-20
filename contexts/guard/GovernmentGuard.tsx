'use client';

import React, { useEffect } from 'react';
import { useGovernment } from '@/contexts/GovernmentContext';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const GovernmentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { startFetchingResources } = useGovernment();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still initializing — wait

    if (!user) {
      router.replace('/auth/login');
      return;
    }

    if (user.role !== 'GOVERNMENT') {
      router.replace('/unauthorized');
      return;
    }

    startFetchingResources();
  }, [loading, user, router, startFetchingResources]);

  // Show spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          <p className="text-sm text-gray-500 font-medium">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'GOVERNMENT') {
    return null;
  }

  return <>{children}</>;
};

export default GovernmentGuard;

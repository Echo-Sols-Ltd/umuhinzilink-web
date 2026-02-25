'use client';

import React, { useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { usePolling } from '@/lib/polling';

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
    usePolling(startFetchingResources, 5000, []);
  }, [loading, user, router, startFetchingResources]);

  // Show spinner while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          <p className="text-sm text-gray-500 font-medium">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
};

export default AdminGuard;

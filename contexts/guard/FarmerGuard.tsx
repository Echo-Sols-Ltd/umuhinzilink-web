'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types';
import { Loader2 } from 'lucide-react';

const FarmerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still initializing — wait

    if (!user) {
      router.replace('/auth/farmer');
      return;
    }

    if (user.role !== UserType.FARMER) {
      router.replace('/unauthorized');
    }
  }, [user, loading, router]);

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

  // Don't render children until we know user is the right role
  if (!user || user.role !== UserType.FARMER) {
    return null;
  }

  return <>{children}</>;
};

export default FarmerGuard;

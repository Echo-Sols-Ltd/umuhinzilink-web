'use client';

import React, { useState, useEffect } from 'react';
import { useFarmer } from '@/contexts/FarmerContext';
import { useAuth } from '../AuthContext';
import { UserType } from '@/types';

const FarmerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (loading || !user) return

        if (user.role !== UserType.FARMER) {
          window.location.href = '/unauthorized';
          return;
        }
      } catch (error) {
        console.error('Authorization error:', error);
        window.location.href = '/unauthorized';
      }
    };

    checkAuth();
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FarmerGuard;

'use client';

import React, { useState, useEffect } from 'react';
import { useFarmer } from '@/contexts/FarmerContext';

const FarmerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { isValidFarmer, startFetchingFarmerResources } = useFarmer();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isValidFarmer()) {
          window.location.href = '/unauthorized';
          return;
        }
        await startFetchingFarmerResources();
        setLoading(false);
      } catch (error) {
        console.error('Authorization error:', error);
        window.location.href = '/unauthorized';
      }
    };

    checkAuth();
  }, [isValidFarmer, startFetchingFarmerResources]);

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

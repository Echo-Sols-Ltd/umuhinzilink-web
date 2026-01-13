'use client';

import React, { useState, useEffect } from 'react';
import { useGovernment } from '@/contexts/GovernmentContext';

const GovernmentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { isValidGovernmentUser, startFetchingResources } = useGovernment();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isValidGovernmentUser()) {
          window.location.href = '/unauthorized';
          return;
        }
        await startFetchingResources();
        setLoading(false);
      } catch (error) {
        console.error('Authorization error:', error);
        window.location.href = '/unauthorized';
      }
    };

    checkAuth();
  }, [isValidGovernmentUser, startFetchingResources]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GovernmentGuard;

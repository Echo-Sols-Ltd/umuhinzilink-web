import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { isValidAdmin, startFetchingResources } = useAdmin();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isValidAdmin()) {
          window.location.href = '/unauthorized';
          return;
        }
        await startFetchingResources();
        setLoading(false);
      } catch (error) {
        console.error('Authorization error:', error);
      }
    };

    checkAuth();
  }, [isValidAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '../AuthContext';

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { startFetchingResources } = useAdmin();

  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (loading||!user) return
        if (user.role !== 'ADMIN') {
          window.location.href = '/unauthorized';
          return;
        }
        await startFetchingResources();
      } catch (error) {
        console.error('Authorization error:', error);
      }
    };

    checkAuth();
  }, [loading, startFetchingResources, user]);

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

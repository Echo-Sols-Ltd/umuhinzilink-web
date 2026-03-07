'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { useI18n } from '@/contexts/I18nContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useI18n();

  React.useEffect(() => {
    if (!loading && user && user.verified) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case UserType.FARMER:
          router.push('/farmer/dashboard');
          break;
        case UserType.BUYER:
          router.push('/buyer/dashboard');
          break;
        case UserType.SUPPLIER:
          router.push('/supplier/dashboard');
          break;
        case UserType.ADMIN:
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } else if (!loading && !user) {
      router.push('/dashboard');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-800">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('dashboard.redirecting')}</p>
      </div>
    </div>
  );
}

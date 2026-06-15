'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageLoading from '@/components/layout/PageLoading';

export default function DashboardPage() {
  const { loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.push('/dashboard');
  }, [loading, router]);

  return (
    <PageLoading
      label={loading ? t('dashboard.loading') : t('dashboard.redirecting')}
      description="Taking you to your dashboard…"
    />
  );
}

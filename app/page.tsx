'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageLoading from '@/components/layout/PageLoading';
import { getHomePathForRole } from '@/lib/appPaths';

export default function DashboardPage() {
  const { loading, user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.push(getHomePathForRole(user?.role));
    }
  }, [loading, user, router]);

  return (
    <PageLoading
      label={loading ? t('dashboard.loading') : t('dashboard.redirecting')}
      description="Taking you to your dashboard…"
    />
  );
}

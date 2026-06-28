'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';
import BuyerDashboard from '@/components/dashboard/buyer/BuyerDashboard';
import SellerDashboard from '@/components/dashboard/seller/SellerDashboard';
import { UserRole } from '@/types';
import { ROUTES } from '@/lib/routes';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(`${ROUTES.signIn}?redirect=${encodeURIComponent(ROUTES.dashboard)}`);
      return;
    }

    if (user.role === UserRole.ADMIN) {
      router.replace(ROUTES.admin.dashboard);
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <PageLoading
        label={t('dashboard.loading')}
        description="Loading your dashboard…"
      />
    );
  }

  if (!user) {
    return (
      <PageLoading
        label={t('dashboard.redirecting')}
        description="Taking you to sign in…"
      />
    );
  }

  if (user.role === UserRole.ADMIN) {
    return (
      <PageLoading
        label={t('dashboard.redirecting')}
        description="Taking you to the admin dashboard…"
      />
    );
  }

  const isSeller = user.role === UserRole.SELLER;

  return (
    <AppLayout maxWidth="max-w-6xl">
      <PageHeader
        title={isSeller ? 'Seller dashboard' : 'Buyer dashboard'}
        description={
          isSeller
            ? 'Overview of your listings, orders, and sales.'
            : 'Overview of your orders, wallet, and saved products.'
        }
      />
      {isSeller ? <SellerDashboard /> : <BuyerDashboard />}
    </AppLayout>
  );
}

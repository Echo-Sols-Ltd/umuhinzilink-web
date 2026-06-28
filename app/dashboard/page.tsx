'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight } from '@/lib/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';
import BuyerDashboard from '@/components/dashboard/buyer/BuyerDashboard';
import SellerDashboard from '@/components/dashboard/seller/SellerDashboard';
import { Button } from '@/components/ui/button';
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
      <div className="space-y-6 pb-8">
        <PageHeader
          title={
            isSeller
              ? t('farmer.dashboard.title')
              : t('buyer.dashboard.title')
          }
          description={
            isSeller
              ? t('farmer.dashboard.subtitle')
              : t('buyer.dashboard.subtitle')
          }
          actions={
            isSeller ? (
              <>
                <Button asChild className="gap-2">
                  <Link href={ROUTES.productCreate}>
                    <Plus size={16} />
                    {t('farmer.dashboard.actions.addProduct')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link href={ROUTES.sellerProducts}>
                    {t('supplier.wallet.quickLinks.listings')}
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </>
            ) : undefined
          }
        />
        {isSeller ? <SellerDashboard /> : <BuyerDashboard />}
      </div>
    </AppLayout>
  );
}

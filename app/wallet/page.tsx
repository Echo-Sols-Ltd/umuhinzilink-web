'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ChevronRight } from '@/lib/icons';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';
import { ROUTES } from '@/lib/routes';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { Button } from '@/components/ui/button';

export default function WalletPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { wallet, transactions, loading, handleDeposit } = useWallet();
  const [depositOpen, setDepositOpen] = useState(false);

  const isSeller = user?.role === UserRole.SELLER;
  const copyPrefix = isSeller ? 'supplier.wallet' : 'buyer.wallet';

  if (loading && !wallet) {
    return (
      <AppLayout maxWidth="max-w-6xl">
        <PageLoading
          fullScreen={false}
          label={t(`${copyPrefix}.title`)}
          description={t(`${copyPrefix}.subtitle`)}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout maxWidth="max-w-6xl">
      <div className="space-y-6 pb-8">
        <PageHeader
          title={t(`${copyPrefix}.title`)}
          description={t(`${copyPrefix}.subtitle`)}
          actions={
            <>
              <Button
                type="button"
                onClick={() => setDepositOpen(true)}
                className="gap-2"
              >
                <Plus size={16} />
                {t(`${copyPrefix}.addMoney`)}
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href={isSeller ? ROUTES.sellerProducts : ROUTES.orders}>
                  {isSeller
                    ? t('supplier.wallet.quickLinks.listings')
                    : t('nav.myOrders')}
                  <ChevronRight size={14} />
                </Link>
              </Button>
            </>
          }
        />

        <WalletDashboard
          wallet={wallet}
          transactions={transactions}
          loading={loading}
          onDeposit={handleDeposit}
          depositOpen={depositOpen}
          onDepositOpenChange={setDepositOpen}
          variant={isSeller ? 'seller' : 'buyer'}
        />
      </div>
    </AppLayout>
  );
}

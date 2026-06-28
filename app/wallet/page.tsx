'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ChevronRight } from '@/lib/icons';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';

export default function WalletPage() {
  const { t } = useI18n();
  const { wallet, transactions, loading, handleDeposit } = useWallet();
  const [depositOpen, setDepositOpen] = useState(false);

  if (loading && !wallet) {
    return (
      <AppLayout maxWidth="max-w-6xl">
        <PageLoading
          fullScreen={false}
          label="Loading wallet"
          description="Fetching balance and transactions…"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t('buyer.wallet.title')}
        description={t('buyer.wallet.subtitle')}
        actions={
          <>
            <button
              type="button"
              onClick={() => setDepositOpen(true)}
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              {t('buyer.wallet.addMoney')}
            </button>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 h-9 px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Orders <ChevronRight size={12} />
            </Link>
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
      />
    </AppLayout>
  );
}

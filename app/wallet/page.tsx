'use client';

import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';

export default function WalletPage() {
  const { wallet, transactions, loading, handleDeposit } = useWallet();

  return (
    <AppLayout maxWidth="max-w-5xl">
      <PageHeader
        title="My Wallet"
        description="Deposit funds, view balance, and track transactions."
      />
      <WalletDashboard
        wallet={wallet}
        transactions={transactions}
        loading={loading}
        onDeposit={handleDeposit}
      />
    </AppLayout>
  );
}

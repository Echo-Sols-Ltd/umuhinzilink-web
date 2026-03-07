'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import { useI18n } from '@/contexts/I18nContext';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function WalletPageComponent() {
  const { wallet, transactions, loading, handleDeposit } = useWallet();
  const { t } = useI18n();

  const handleLogout = async () => {
    // Logout logic here
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userType={UserType.BUYER}
        activeItem={t('common.wallet')}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
       
        {/* Wallet Dashboard */}
        <WalletDashboard
          wallet={wallet}
          transactions={transactions}
          loading={loading}
          onDeposit={handleDeposit}
          className='overflow-auto h-full'
        />
      </main>
    </div>
  );
}

export default function WalletPage() {
  return (
    <BuyerGuard>
      <WalletPageComponent />
    </BuyerGuard>
  );
}
'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import { useI18n } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';


function WalletPageComponent() {
  const { wallet, transactions, loading, handleDeposit } = useWallet();
  const { t } = useI18n();

  return (
    <div className="flex h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto mt-20">

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
    <>
      <WalletPageComponent />
    </>
  );
}
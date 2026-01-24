'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import BuyerSidebar from '@/components/buyer/Navbar';
import { BuyerPages } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import useWalletAction from '@/hooks/useWalletAction';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function WalletPageComponent() {
  const { wallet, transactions, loading } = useWallet();
  const { handleDeposit } = useWalletAction();

  const handleLogout = async () => {
    // Logout logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        <BuyerSidebar
          activePage={BuyerPages.WALLET}
          handleLogout={handleLogout}
          logoutPending={false}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <Wallet className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                <p className="text-gray-600">Manage your wallet balance and transactions</p>
              </div>
            </div>
          </div>

          {/* Wallet Dashboard */}
          <WalletDashboard
            wallet={wallet}
            transactions={transactions}
            loading={loading}
            onDeposit={handleDeposit}
          />
        </main>
      </div>
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
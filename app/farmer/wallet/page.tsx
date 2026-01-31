'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import useWalletAction from '@/hooks/useWalletAction';

function WalletPage() {
    const { wallet, transactions, loading } = useWallet();
    const { handleDeposit } = useWalletAction();

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                userType={UserType.FARMER}
                activeItem='My Wallet'
            />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-3">
                        <Wallet className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                            <p className="text-gray-600">Manage your earnings, balance and transactions</p>
                        </div>
                    </div>
                </div>

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

export default function FarmerWalletPage() {
    return (
        <FarmerGuard>
            <WalletPage />
        </FarmerGuard>
    );
}

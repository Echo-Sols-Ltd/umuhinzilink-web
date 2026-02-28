'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';

function WalletPage() {
    const { wallet, transactions, loading, handleDeposit } = useWallet();

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                userType={UserType.SUPPLIER}
                activeItem='My Wallet'
            />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-3">
                        <Wallet className="w-8 h-8 text-success" />
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">My Wallet</h1>
                            <p className="text-muted-foreground">Manage your business earnings, balance and transactions</p>
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

export default function SupplierWalletPage() {
    return (
        <SupplierGuard>
            <WalletPage />
        </SupplierGuard>
    );
}

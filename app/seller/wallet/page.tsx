'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { useWallet } from '@/contexts/WalletContext';
import { useI18n } from '@/contexts/I18nContext';

function WalletPage() {
    const { wallet, transactions, loading, handleDeposit } = useWallet();
    const { t } = useI18n();

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                userType={UserType.FARMER}
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

export default function FarmerWalletPage() {
    return (
        <FarmerGuard>
            <WalletPage />
        </FarmerGuard>
    );
}

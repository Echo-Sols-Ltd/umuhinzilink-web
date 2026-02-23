'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types';
import { Loader2 } from 'lucide-react';

export default function BuyerGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // Still initializing — wait

        if (!user) {
            router.replace('/auth/buyer');
            return;
        }

        if (user.role !== UserType.BUYER) {
            router.replace('/unauthorized');
        }
    }, [user, loading, router]);

    // Show spinner while auth is loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                    <p className="text-sm text-gray-500 font-medium">Loading your session...</p>
                </div>
            </div>
        );
    }

    // Don't render children until we know user is the right role
    if (!user || user.role !== UserType.BUYER) {
        return null;
    }

    return <>{children}</>;
}

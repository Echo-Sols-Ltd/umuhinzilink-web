'use client';

import NegotiationChat from '@/components/negotiation/NegotiationChat';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { Loader2 } from 'lucide-react';

export default function NegotiationDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const { id } = useParams() as { id: string };
    const negotiationId = id;
    const { fetchNegotiationMessages, fetchNegotiationById } = useNegotiation();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace(`/auth/signin?redirect=/negotiations/${negotiationId}`);
        }
    }, [authLoading, user, router, negotiationId]);

    useEffect(() => {
        const load = async () => {
            if (!negotiationId) return;
            await fetchNegotiationById(negotiationId);
            await fetchNegotiationMessages(negotiationId);
        };
        load();
    }, [negotiationId, fetchNegotiationById, fetchNegotiationMessages]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className="flex-1 pt-16 overflow-hidden">
                <NegotiationChat
                    negotiationId={negotiationId}
                    currentRole={user.role}
                    onBack={() => router.push('/negotiations')}
                />
            </div>
        </div>
    );
}

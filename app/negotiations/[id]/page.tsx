'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Negotiation, NegotiationStatus, UserType } from '@/types';
import { DealCard } from '@/components/negotiations/DealCard';
import { NegotiationThread } from '@/components/negotiations/NegotiationThread';
import { NegotiationActionBar } from '@/components/negotiations/NegotiationActionBar';
import { NegotiationEmptyState } from '@/components/negotiations/NegotiationEmptyState';
import useNegotiationAction from '@/hooks/useNegotiationAction';
import { useAuth } from '@/contexts/AuthContext';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { notify } from '@/lib/notify';
import { ChevronLeft, WifiOff } from 'lucide-react';


export default function NegotiationPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { setCurrentNegotiation } = useNegotiation()

    const negotiationId = params.id as string;


    const {
        getNegotiation,
        acceptNegotiation,
        rejectNegotiation,
        setAgreedPrice,
    } = useNegotiationAction();

    const {
        messages: socketMessages,
        isConnected,
        sendNegotiationMessage
    } = useNegotiation();

    const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(false);



    useEffect(() => {
        // ── fetch ──────────────────────────────────────────────────────
        const fetchNegotiation = async () => {
            if (!negotiationId) return;


            const data = await getNegotiation(negotiationId);

            if (data) {
                setNegotiation(data);
                setCurrentNegotiation(data)
            }
            setLoading(false);
        }
        fetchNegotiation();
    }, [negotiationId]);



    // ── turn detection ─────────────────────────────────────────────
    const isBuyer = user?.role === UserType.BUYER;
    const isSeller = user?.role === UserType.FARMER || user?.role === UserType.SUPPLIER;


    // ── action handler ─────────────────────────────────────────────
    const handleAction = async (action: string, data?: {
        price?: number;
        message?: string;
    }) => {
        if (!negotiation || acting) return;

        setActing(true);
        try {
            // orderId lives on negotiation.order.id — order is still fully embedded in NegotiationDTO
            const nOrderId = negotiation.order.id;

            if (action === 'ACCEPT') {
                const result = await acceptNegotiation(nOrderId);
                if (result) {
                    setNegotiation(result);
                    notify.success('Price agreed — you can now proceed to checkout', 'Accepted');
                }

            } else if (action === 'SET_PRICE') {
                if (!data?.price) {
                    notify.error('Please enter a price', 'Missing price');
                    return;
                }

                // frontend price range guard (backend also validates)
                const listed = negotiation.order.product.unitPrice;
                const min = listed * 0.5;
                const max = listed * 1.5;
                if (data.price < min || data.price > max) {
                    notify.error(
                        `Price must be between RWF ${Math.round(min).toLocaleString()} and RWF ${Math.round(max).toLocaleString()}`,
                        'Price out of range'
                    );
                    return;
                }

                // frontend counter limit guard
                if ((negotiation as any).counterCount >= 3) {
                    notify.error('Maximum counter offers reached — you can only Accept or Reject', 'Limit reached');
                    return;
                }

                const result = await setAgreedPrice(negotiation.id, {
                    agreedPrice: data.price,
                });
                if (result) {
                    setNegotiation(result);
                    notify.success('Counter offer sent', 'Sent');
                }

            } else if (action === 'REJECT') {
                const result = await rejectNegotiation(nOrderId, data?.message ?? 'Negotiation declined');
                if (result) {
                    setNegotiation(result);
                    notify.info('Negotiation declined', 'Declined');
                }

            } else if (action === 'GO_TO_CART') {
                // only buyers go to cart after acceptance
                if (isBuyer) {
                    router.push('/cart');
                }

            } else if (action === 'NEW_NEGOTIATION') {
                router.push('/buyer/products');
            }
            else {
                sendNegotiationMessage(negotiationId, data?.message!)
            }

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Action failed';
            notify.error(msg, 'Error');
        } finally {
            setActing(false);
        }
    };

    const isExpired = negotiation?.status === NegotiationStatus.EXPIRED;

    // ── derived label for mobile bar ───────────────────────────────
    const statusLabel = isExpired
        ? 'Expired'
        : negotiation?.status ?? '';

    const statusColor =
        negotiation?.status === NegotiationStatus.ACCEPTED ? 'text-green-600' :
            negotiation?.status === NegotiationStatus.REJECTED ? 'text-red-500' :
                negotiation?.status === NegotiationStatus.EXPIRED ? 'text-gray-400' :
                    negotiation?.status === NegotiationStatus.COUNTERED ? 'text-blue-600' :
                        'text-amber-600'; // PENDING

    // ── loading ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading negotiation…</p>
            </div>
        );
    }

    if (!negotiation) return <NegotiationEmptyState />;

    const buyerOrSeller: 'buyer' | 'seller' = isBuyer ? 'buyer' : 'seller';

    return (
        <div className="h-screen bg-background overflow-auto">

            {/* ── disconnected banner ────────────────────────────── */}
            {!isConnected && (
                <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2">
                    <WifiOff size={14} className="text-amber-600" />
                    <span className="text-[12px] text-amber-700 font-medium">
                        Connection lost — refreshing every 30s
                    </span>
                </div>
            )}

            {/* ── mobile mini-bar ────────────────────────────────── */}
            <div className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1.5 hover:bg-accent rounded-xl transition-colors text-muted-foreground"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <p className="font-semibold text-[13px] text-foreground leading-tight">
                            {negotiation.order.product.name}
                        </p>
                        <p className={`text-[10px] font-semibold uppercase tracking-wide ${statusColor}`}>
                            {statusLabel}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Proposed</p>
                    <p className="font-bold text-[13px] text-foreground">
                        RWF {negotiation.buyerProposedPrice.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* ── main ───────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">

                {/* desktop back button */}
                <button
                    onClick={() => router.back()}
                    className="hidden lg:flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ChevronLeft size={14} />
                    </div>
                    <span className="text-[12px] font-medium uppercase tracking-wider">Back to negotiations</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">

                    {/* ── deal card (desktop only) ──────────────── */}
                    <div className="lg:col-span-4 hidden lg:block">
                        <DealCard negotiation={negotiation} />
                    </div>

                    {/* ── thread + action bar ───────────────────── */}
                    <div className="lg:col-span-6 flex flex-col lg:min-h-[680px]">
                        <NegotiationThread
                            negotiation={negotiation}
                            messages={socketMessages}
                            currentUserType={buyerOrSeller}
                        />

                        <div className="mt-3">
                            <NegotiationActionBar
                                negotiation={negotiation}
                                currentUserType={buyerOrSeller}
                                onAction={handleAction}
                                acting={acting}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
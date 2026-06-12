'use client';

import { cn, imageUrl } from "@/lib/utils";
import { Negotiation } from "@/types";
import {
    AlertCircle, CheckCircle, Clock, Loader2,
    Package, Send, XCircle, DollarSign,
    TrendingUp, ChevronRight, Info,
} from "lucide-react";
import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hrs}h left`;
    return `${hrs}h left`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PricePanelProps {
    negotiation: Negotiation;
    onSetOffer: (price: number) => Promise<void>;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
    loading: boolean;
    isSeller: boolean;
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

function ConfirmBox({
    type,
    price,
    loading,
    onConfirm,
    onCancel,
}: {
    type: 'accept' | 'reject';
    price?: number;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const isAccept = type === 'accept';
    return (
        <div className={cn(
            'p-3 rounded-xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200',
            isAccept
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
        )}>
            <p className={cn('text-xs font-medium', isAccept ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600')}>
                {isAccept
                    ? `Accept ${price ? `offer of ${fmt(price)}` : 'this offer'}? The order will be confirmed.`
                    : 'Reject this negotiation? The order will be cancelled.'}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        'flex-1 h-8 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5',
                        isAccept ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                    )}>
                    {loading
                        ? <Loader2 size={12} className="animate-spin" />
                        : isAccept ? <CheckCircle size={12} /> : <XCircle size={12} />
                    }
                    {loading ? (isAccept ? 'Accepting…' : 'Rejecting…') : (isAccept ? 'Yes, accept' : 'Yes, reject')}
                </button>
                <button
                    onClick={onCancel}
                    className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PricePanel({
    negotiation,
    onSetOffer,
    onAccept,
    onReject,
    loading,
    isSeller,
}: PricePanelProps) {
    const [offerInput, setOfferInput] = useState('');
    const [offerError, setOfferError] = useState('');
    const [confirming, setConfirming] = useState<'accept' | 'reject' | null>(null);

    const product = negotiation.order.product;
    const buyerPrice = negotiation.buyerProposedPrice;
    const listedPrice = product.unitPrice;
    const agreedPrice = negotiation.agreedPrice;
    const isActive = negotiation.status === 'PENDING';
    const discount = Math.round((1 - buyerPrice / listedPrice) * 100);

    // Seller has set a price that buyer hasn't responded to yet
    const hasPendingOffer = !!agreedPrice && isActive;

    // ── Seller offer submit ───────────────────────────────────────────────

    const handleSubmitOffer = async () => {
        const val = parseFloat(offerInput);
        if (!offerInput || isNaN(val) || val <= 0) {
            setOfferError('Enter a valid price');
            return;
        }
        if (val > listedPrice) {
            setOfferError("Can't exceed your listed price");
            return;
        }
        setOfferError('');
        await onSetOffer(val);
        setOfferInput('');
    };

    const handleConfirm = async () => {
        if (confirming === 'accept') await onAccept();
        else if (confirming === 'reject') await onReject();
        setConfirming(null);
    };

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-border">

            {/* Panel header */}
            <div className="px-4 py-3.5 border-b border-border shrink-0">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {isSeller ? 'Negotiation Panel' : 'Offer Details'}
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                    {negotiation.order.orderNumber}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* ── Status pill ───────────────────────────────────────── */}
                <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold',
                    isActive && 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
                    negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
                    negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/30 text-red-600',
                    negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800 text-gray-500',
                )}>
                    {isActive && <AlertCircle size={13} />}
                    {negotiation.status === 'ACCEPTED' && <CheckCircle size={13} />}
                    {negotiation.status === 'REJECTED' && <XCircle size={13} />}
                    {negotiation.status === 'EXPIRED' && <Clock size={13} />}
                    {isActive
                        ? `Expires in ${timeUntil(negotiation.expiresAt)}`
                        : negotiation.status.charAt(0) + negotiation.status.slice(1).toLowerCase()
                    }
                </div>

                {/* ── Product card ──────────────────────────────────────── */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                        {product.image ? (
                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {negotiation.order.quantity} {product.measurementUnit?.toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* ── Price breakdown ───────────────────────────────────── */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price breakdown</p>

                    {/* Listed price */}
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <span className="text-xs text-muted-foreground">
                            {isSeller ? 'Your listed price' : 'Listed price'}
                        </span>
                        <span className="text-xs font-bold text-foreground">{fmt(listedPrice)}</span>
                    </div>

                    {/* Buyer's offer */}
                    <div className={cn(
                        'flex items-center justify-between py-2 px-3 rounded-xl',
                        discount > 30 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-amber-50 dark:bg-amber-950/20'
                    )}>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">
                                {isSeller ? "Buyer's offer" : 'Your offer'}
                            </span>
                            {discount > 0 && (
                                <span className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    discount > 30
                                        ? 'bg-red-100 dark:bg-red-900/40 text-red-600'
                                        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                                )}>
                                    -{discount}%
                                </span>
                            )}
                        </div>
                        <span className={cn(
                            'text-sm font-extrabold',
                            discount > 30 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
                        )}>
                            {fmt(buyerPrice)}
                        </span>
                    </div>

                    {/* Seller's counter offer — shown to both */}
                    {agreedPrice && (
                        <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                            <span className="text-xs text-muted-foreground">
                                {isSeller ? 'Your counter offer' : "Seller's counter offer"}
                            </span>
                            <span className="text-sm font-extrabold text-green-700 dark:text-green-400">
                                {fmt(agreedPrice)}
                            </span>
                        </div>
                    )}

                    {/* Order total */}
                    <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                        <span className="text-xs font-semibold text-foreground">Order total</span>
                        <span className="text-sm font-extrabold text-green-700 dark:text-green-400">
                            {fmt((agreedPrice ?? buyerPrice) * negotiation.order.quantity)}
                        </span>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════
                    SELLER SECTION
                ════════════════════════════════════════════════════════ */}
                {isSeller && isActive && (
                    <>
                        {/* Set counter offer */}
                        <div className="space-y-2 pt-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                {agreedPrice ? 'Update your price' : 'Set your price'}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {agreedPrice
                                    ? 'You can update your counter offer — the buyer will be notified.'
                                    : 'Enter the price you are willing to accept. The buyer will be notified.'}
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">RWF</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder={agreedPrice
                                            ? String(agreedPrice)
                                            : String(Math.round(buyerPrice * 1.1))
                                        }
                                        value={offerInput}
                                        onChange={e => { setOfferInput(e.target.value); setOfferError(''); }}
                                        onKeyDown={e => { if (e.key === 'Enter') handleSubmitOffer(); }}
                                        className={cn(
                                            'w-full h-10 pl-11 pr-3 text-sm font-semibold text-foreground bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all',
                                            offerError ? 'border-red-400' : 'border-border'
                                        )}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmitOffer}
                                    disabled={loading || !offerInput}
                                    className="h-10 px-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                    {agreedPrice ? 'Update' : 'Send'}
                                </button>
                            </div>
                            {offerError && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <AlertCircle size={11} /> {offerError}
                                </p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground font-medium">or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Accept / Reject */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Decide now</p>

                            {confirming ? (
                                <ConfirmBox
                                    type={confirming}
                                    price={confirming === 'accept' ? buyerPrice : undefined}
                                    loading={loading}
                                    onConfirm={handleConfirm}
                                    onCancel={() => setConfirming(null)}
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setConfirming('accept')}
                                        className="h-9 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors flex items-center justify-center gap-1.5">
                                        <CheckCircle size={13} /> Accept offer
                                    </button>
                                    <button
                                        onClick={() => setConfirming('reject')}
                                        className="h-9 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5">
                                        <XCircle size={13} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ════════════════════════════════════════════════════════
                    BUYER SECTION — shown when seller has set a price
                ════════════════════════════════════════════════════════ */}
                {!isSeller && isActive && hasPendingOffer && (
                    <div className="space-y-3 pt-1">
                        {/* Banner */}
                        <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                The seller has set a counter offer of{' '}
                                <span className="font-extrabold">{fmt(agreedPrice!)}</span>.
                                Do you want to accept or reject it?
                            </p>
                        </div>

                        {/* Counter offer highlight */}
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border-2 border-green-200 dark:border-green-800 text-center space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Seller's offer</p>
                            <p className="text-2xl font-extrabold text-green-700 dark:text-green-400">
                                {fmt(agreedPrice!)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                per {product.measurementUnit?.toLowerCase()} · total {fmt(agreedPrice! * negotiation.order.quantity)}
                            </p>
                            {agreedPrice! < listedPrice && (
                                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                    {Math.round((1 - agreedPrice! / listedPrice) * 100)}% below listed price
                                </p>
                            )}
                        </div>

                        {/* Buyer action buttons */}
                        {confirming ? (
                            <ConfirmBox
                                type={confirming}
                                price={confirming === 'accept' ? agreedPrice : undefined}
                                loading={loading}
                                onConfirm={handleConfirm}
                                onCancel={() => setConfirming(null)}
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setConfirming('reject')}
                                    className="h-10 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5">
                                    <XCircle size={13} /> Decline
                                </button>
                                <button
                                    onClick={() => setConfirming('accept')}
                                    className="h-10 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-[0.97]">
                                    <CheckCircle size={13} /> Accept {fmt(agreedPrice!)}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Buyer waiting state — no offer yet ───────────────── */}
                {!isSeller && isActive && !hasPendingOffer && (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <Clock size={14} className="text-amber-600 mt-0.5 shrink-0 animate-pulse" />
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                            Waiting for the seller to respond. You can chat with them in the meantime.
                        </p>
                    </div>
                )}

                {/* ── Closed state — both roles ─────────────────────────── */}
                {!isActive && (
                    <div className={cn(
                        'p-5 rounded-2xl text-center space-y-2',
                        negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800',
                        negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800',
                        negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800 border border-border',
                    )}>
                        <div className="flex justify-center">
                            {negotiation.status === 'ACCEPTED' && <CheckCircle size={28} className="text-emerald-500" />}
                            {negotiation.status === 'REJECTED' && <XCircle size={28} className="text-red-500" />}
                            {negotiation.status === 'EXPIRED' && <Clock size={28} className="text-gray-400" />}
                        </div>
                        <p className="text-sm font-bold text-foreground">
                            {negotiation.status === 'ACCEPTED' && 'Deal agreed!'}
                            {negotiation.status === 'REJECTED' && 'Negotiation closed'}
                            {negotiation.status === 'EXPIRED' && 'Offer expired'}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {negotiation.status === 'ACCEPTED' && (
                                <>Final price: <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmt(negotiation.agreedPrice ?? buyerPrice)}</span></>
                            )}
                            {negotiation.status === 'REJECTED' && 'This negotiation was rejected.'}
                            {negotiation.status === 'EXPIRED' && 'No agreement was reached in time.'}
                        </p>

                        {/* Total for accepted */}
                        {negotiation.status === 'ACCEPTED' && (
                            <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                                <p className="text-xs text-muted-foreground">Order total</p>
                                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                                    {fmt((negotiation.agreedPrice ?? buyerPrice) * negotiation.order.quantity)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
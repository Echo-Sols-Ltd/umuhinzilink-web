'use client';

import { cn, imageUrl } from "@/lib/utils";
import { Negotiation } from "@/types";
import {
    AlertCircle, CheckCircle, Clock, Loader2,
    Package, Send, XCircle, Wallet, Info,
} from '@/lib/icons';
import { useState } from "react";
import { useI18n } from '@/contexts/I18nContext';

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeUntil(dateStr: string, t: (key: string) => string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return t('settings.negotiations.expired');
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hrs}h`;
    return `${hrs}h`;
}

interface PricePanelProps {
    negotiation: Negotiation;
    onSetSellerOffer: (price: number) => Promise<void>;
    onSetBuyerOffer: (price: number) => Promise<void>;
    onSellerAcceptBuyer: () => Promise<void>;
    onBuyerAcceptSeller: () => Promise<void>;
    onReject: () => Promise<void>;
    onPayOrder?: () => Promise<void>;
    loading: boolean;
    isSeller: boolean;
}

function ConfirmBox({
    type, price, loading, onConfirm, onCancel, t,
}: {
    type: 'accept' | 'reject';
    price?: number;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
}) {
    const isAccept = type === 'accept';
    return (
        <div className={cn(
            'p-3 rounded-xl border space-y-3',
            isAccept
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
        )}>
            <p className={cn('text-xs font-medium', isAccept ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600')}>
                {isAccept
                    ? price
                        ? t('settings.negotiations.confirm.acceptOffer', { price: fmt(price) }) + ' ' + t('settings.negotiations.confirm.acceptPaymentNote')
                        : t('settings.negotiations.confirm.acceptOfferDefault') + ' ' + t('settings.negotiations.confirm.acceptPaymentNote')
                    : t('settings.negotiations.confirm.rejectNegotiation')}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        'flex-1 h-8 text-white text-xs font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-1.5',
                        isAccept ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                    )}>
                    {loading ? <Loader2 size={12} className="animate-spin" /> : isAccept ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {loading ? t('settings.negotiations.confirm.processing') : isAccept ? t('settings.negotiations.confirm.yesAccept') : t('settings.negotiations.confirm.yesReject')}
                </button>
                <button onClick={onCancel} className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg">
                    {t('settings.negotiations.cancel')}
                </button>
            </div>
        </div>
    );
}

export default function PricePanel({
    negotiation,
    onSetSellerOffer,
    onSetBuyerOffer,
    onSellerAcceptBuyer,
    onBuyerAcceptSeller,
    onReject,
    onPayOrder,
    loading,
    isSeller,
}: PricePanelProps) {
    const { t } = useI18n();
    const [offerInput, setOfferInput] = useState('');
    const [offerError, setOfferError] = useState('');
    const [confirming, setConfirming] = useState<'accept' | 'reject' | null>(null);

    const product = negotiation.order.product;
    const buyerPrice = negotiation.buyerProposedPrice;
    const listedPrice = product.unitPrice;
    const sellerPrice = negotiation.agreedPrice;
    const isActive = negotiation.status === 'PENDING';
    const orderStatus = (negotiation.order.status as string)?.toUpperCase();
    const awaitingPayment = negotiation.status === 'ACCEPTED' && orderStatus === 'PENDING_PAYMENT';
    const hasSellerCounter = !!sellerPrice && isActive;
    const discount = Math.round((1 - buyerPrice / listedPrice) * 100);

    const submitOffer = async () => {
        const val = parseFloat(offerInput);
        if (!offerInput || isNaN(val) || val <= 0) {
            setOfferError(t('settings.negotiations.validation.enterValidPrice'));
            return;
        }
        if (val > listedPrice) {
            setOfferError(t('settings.negotiations.validation.exceedsListedPrice'));
            return;
        }
        setOfferError('');
        if (isSeller) await onSetSellerOffer(val);
        else await onSetBuyerOffer(val);
        setOfferInput('');
    };

    const handleConfirm = async () => {
        if (confirming === 'accept') {
            if (isSeller) await onSellerAcceptBuyer();
            else await onBuyerAcceptSeller();
        } else if (confirming === 'reject') {
            await onReject();
        }
        setConfirming(null);
    };

    return (
        <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col overflow-hidden bg-white dark:bg-gray-900">
            <div className="shrink-0 border-b border-border px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {isSeller ? 'Negotiation Panel' : 'Offer Details'}
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                    {negotiation.order.orderNumber}
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 space-y-3">
                <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold',
                    isActive && 'bg-amber-50 dark:bg-amber-950/30 text-amber-700',
                    awaitingPayment && 'bg-blue-50 dark:bg-blue-950/30 text-blue-700',
                    negotiation.status === 'ACCEPTED' && orderStatus === 'COMPLETED' && 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700',
                    negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/30 text-red-600',
                    negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800 text-gray-500',
                )}>
                    {isActive && <><AlertCircle size={13} /> {t('settings.negotiations.panel.expiresInTime', { time: timeUntil(negotiation.expiresAt, t) })}</>}
                    {awaitingPayment && <><Wallet size={13} /> {t('settings.negotiations.panel.awaitingPayment')}</>}
                    {negotiation.status === 'ACCEPTED' && orderStatus === 'COMPLETED' && <><CheckCircle size={13} /> {t('settings.negotiations.panel.paidCompleted')}</>}
                    {negotiation.status === 'REJECTED' && <><XCircle size={13} /> {t('settings.negotiations.rejected')}</>}
                    {negotiation.status === 'EXPIRED' && <><Clock size={13} /> {t('settings.negotiations.expired')}</>}
                </div>

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

                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prices</p>
                    <div className="flex justify-between gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs min-w-0">
                        <span className="shrink-0 text-muted-foreground">Listed</span>
                        <span className="truncate font-bold text-right">{fmt(listedPrice)}</span>
                    </div>
                    <div className="flex justify-between gap-2 py-2 px-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-xs min-w-0">
                        <span className="shrink-0 text-muted-foreground">{isSeller ? "Buyer's offer" : 'Your offer'}</span>
                        <span className="truncate text-right font-extrabold text-amber-600">
                            {fmt(buyerPrice)}{discount > 0 ? ` (-${discount}%)` : ''}
                        </span>
                    </div>
                    {sellerPrice && (
                        <div className="flex justify-between gap-2 py-2 px-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 text-xs min-w-0">
                            <span className="shrink-0 text-muted-foreground">{isSeller ? 'Your counter' : "Seller's counter"}</span>
                            <span className="truncate text-right font-extrabold text-green-700">{fmt(sellerPrice)}</span>
                        </div>
                    )}
                    <div className="flex justify-between gap-2 py-2.5 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border text-xs min-w-0">
                        <span className="shrink-0 font-semibold">Order total</span>
                        <span className="truncate text-right font-extrabold text-green-700">
                            {fmt((sellerPrice ?? buyerPrice) * negotiation.order.quantity)}
                        </span>
                    </div>
                </div>

                {/* Awaiting payment — buyer pays manually */}
                {awaitingPayment && !isSeller && onPayOrder && (
                    <div className="space-y-3">
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-xl">
                            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                {t('settings.negotiations.panel.dealAgreedHint')}
                            </p>
                        </div>
                        <button
                            onClick={onPayOrder}
                            disabled={loading}
                            className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                            {t('settings.negotiations.panel.pay', { price: fmt(negotiation.order.totalPrice) })}
                        </button>
                    </div>
                )}

                {/* Seller: set counter OR accept buyer OR reject */}
                {isSeller && isActive && (
                    <>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase">Set your counter price</p>
                            <div className="flex min-w-0 gap-2">
                                <input
                                    type="number"
                                    placeholder={String(Math.round(buyerPrice * 1.1))}
                                    value={offerInput}
                                    onChange={e => { setOfferInput(e.target.value); setOfferError(''); }}
                                    onKeyDown={e => { if (e.key === 'Enter') submitOffer(); }}
                                    className={cn('min-w-0 flex-1 h-9 px-2.5 text-sm border rounded-xl', offerError ? 'border-red-400' : 'border-border')}
                                />
                                <button onClick={submitOffer} disabled={loading || !offerInput}
                                    className="h-9 shrink-0 px-2.5 bg-green-600 text-white text-[11px] font-bold rounded-xl disabled:opacity-50 flex items-center gap-1">
                                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Send
                                </button>
                            </div>
                            {offerError && <p className="text-xs text-red-500">{offerError}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">{t('settings.negotiations.panel.or')}</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {confirming ? (
                            <ConfirmBox type={confirming} price={confirming === 'accept' ? buyerPrice : undefined}
                                loading={loading} onConfirm={handleConfirm} onCancel={() => setConfirming(null)} t={t} />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setConfirming('accept')}
                                    className="h-9 w-full border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 px-2">
                                    <CheckCircle size={13} className="shrink-0" />
                                    <span className="truncate">Accept {fmt(buyerPrice)}</span>
                                </button>
                                <button onClick={() => setConfirming('reject')}
                                    className="h-9 w-full border border-red-200 text-red-600 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1">
                                    <XCircle size={13} className="shrink-0" /> Reject
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Buyer: update offer while active */}
                {!isSeller && isActive && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Update your offer</p>
                        <div className="flex min-w-0 gap-2">
                            <input
                                type="number"
                                placeholder={String(buyerPrice)}
                                value={offerInput}
                                onChange={e => { setOfferInput(e.target.value); setOfferError(''); }}
                                onKeyDown={e => { if (e.key === 'Enter') submitOffer(); }}
                                className={cn('min-w-0 flex-1 h-9 px-2.5 text-sm border rounded-xl', offerError ? 'border-red-400' : 'border-border')}
                            />
                            <button onClick={submitOffer} disabled={loading || !offerInput}
                                className="h-9 shrink-0 px-2.5 bg-amber-600 text-white text-[11px] font-bold rounded-xl disabled:opacity-50">
                                Update
                            </button>
                        </div>
                        {offerError && <p className="text-xs text-red-500">{offerError}</p>}
                    </div>
                )}

                {/* Buyer: accept or reject seller counter */}
                {!isSeller && isActive && hasSellerCounter && (
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-xl text-xs text-blue-700">
                            {t('settings.negotiations.panel.sellerCounterHint', { price: fmt(sellerPrice!) })}
                        </div>
                        {confirming ? (
                            <ConfirmBox type={confirming} price={confirming === 'accept' ? sellerPrice! : undefined}
                                loading={loading} onConfirm={handleConfirm} onCancel={() => setConfirming(null)} t={t} />
                        ) : (
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setConfirming('reject')}
                                    className="h-9 w-full border border-red-200 text-red-600 text-[11px] font-bold rounded-xl">
                                    Decline
                                </button>
                                <button onClick={() => setConfirming('accept')}
                                    className="h-9 w-full bg-green-600 text-white text-[11px] font-bold rounded-xl">
                                    Accept & pay
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Buyer waiting for seller */}
                {!isSeller && isActive && !hasSellerCounter && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                        <Clock size={14} className="mt-0.5 animate-pulse shrink-0" />
                        {t('settings.negotiations.panel.waitingForSeller')}
                    </div>
                )}

                {/* Closed states */}
                {(negotiation.status === 'REJECTED' || negotiation.status === 'EXPIRED' ||
                    (negotiation.status === 'ACCEPTED' && orderStatus === 'COMPLETED')) && (
                    <div className="p-5 rounded-2xl text-center space-y-2 bg-gray-50 dark:bg-gray-800 border">
                        <p className="text-sm font-bold">
                            {negotiation.status === 'REJECTED' && t('settings.negotiations.panel.negotiationCancelled')}
                            {negotiation.status === 'EXPIRED' && t('settings.negotiations.panel.negotiationExpiredLabel')}
                            {negotiation.status === 'ACCEPTED' && orderStatus === 'COMPLETED' && t('settings.negotiations.panel.orderCompleted')}
                        </p>
                        {negotiation.status === 'ACCEPTED' && (
                            <p className="text-xs text-muted-foreground">
                                {t('settings.negotiations.panel.finalTotal', { price: fmt((sellerPrice ?? buyerPrice) * negotiation.order.quantity) })}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

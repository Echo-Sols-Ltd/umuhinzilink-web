'use client';

import React, { useState } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { Send, CheckCircle, XCircle, DollarSign, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NegotiationActionConfirm } from './NegotiationActionConfirm';
import { useI18n } from '@/contexts/I18nContext';

interface NegotiationActionBarProps {
    negotiation: Negotiation;
    currentUserType: 'buyer' | 'seller';
    onAction: (action: string, data?: { price?: number; message?: string }) => void;
    acting: boolean;
}

export const NegotiationActionBar: React.FC<NegotiationActionBarProps> = ({
    negotiation,
    currentUserType,
    onAction,
    acting,
}) => {
    const { t } = useI18n();
    const [message, setMessage] = useState('');
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [agreedPrice, setAgreedPrice] = useState('');
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
    const [showCounterConfirm, setShowCounterConfirm] = useState(false);
    const [showMessageConfirm, setShowMessageConfirm] = useState(false);

    // Determine if seller has set final agreed price
    const hasSellerSetFinalPrice = negotiation.status === NegotiationStatus.COUNTERED && 
                                  !!negotiation.agreedPrice;

    // Determine final state - no actions allowed
    const isFinalState = negotiation.status === NegotiationStatus.ACCEPTED || 
                       negotiation.status === NegotiationStatus.REJECTED;

    // Buyer actions when seller has set final price
    const showBuyerFinalActions = currentUserType === 'buyer' && 
                                 hasSellerSetFinalPrice && 
                                 !isFinalState;

    const handleSendMessage = () => {
        if (!message.trim()) return;
        onAction('CHAT', { message });
        setMessage('');
    };

    const handleSetPrice = () => {
        const price = parseFloat(agreedPrice);
        if (!price || price <= 0) return;
        setShowCounterConfirm(true);
    };

    const handleAccept = () => {
        setShowAcceptConfirm(true);
    };

    const handleReject = () => {
        setShowRejectConfirm(true);
    };

    const handleConfirmAction = (type: string, data?: { price?: number; message?: string }) => {
        onAction(type, data);
        // Reset all confirmation states
        setShowAcceptConfirm(false);
        setShowRejectConfirm(false);
        setShowCounterConfirm(false);
        setShowMessageConfirm(false);
        setShowPriceInput(false);
        setAgreedPrice('');
        setMessage('');
    };

  

  

    // ── SELLER action bar — chat + set agreed price + decline ──────
    if (currentUserType === 'seller') {
        return (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">

                {/* Confirmation Dialogs */}
                {showRejectConfirm && (
                    <NegotiationActionConfirm
                        type="REJECT"
                        onConfirm={(data) => handleConfirmAction('REJECT', data)}
                        onCancel={() => setShowRejectConfirm(false)}
                        loading={acting}
                        negotiationData={{
                            buyerProposedPrice: negotiation.buyerProposedPrice,
                            productName: negotiation.order.product.name,
                            quantity: negotiation.order.quantity
                        }}
                    />
                )}

                {showCounterConfirm && (
                    <NegotiationActionConfirm
                        type="COUNTER"
                        onConfirm={(data) => handleConfirmAction('SET_PRICE', data)}
                        onCancel={() => setShowCounterConfirm(false)}
                        loading={acting}
                        negotiationData={{
                            buyerProposedPrice: negotiation.buyerProposedPrice,
                            productName: negotiation.order.product.name,
                            quantity: negotiation.order.quantity
                        }}
                    />
                )}

                {showMessageConfirm && (
                    <NegotiationActionConfirm
                        type="MESSAGE"
                        onConfirm={(data) => handleConfirmAction('CHAT', data)}
                        onCancel={() => setShowMessageConfirm(false)}
                        loading={acting}
                        negotiationData={{
                            productName: negotiation.order.product.name
                        }}
                    />
                )}

                {/* Legacy price input */}
                {showPriceInput && (
                    <div className="p-3 rounded-xl border border-green-200 bg-green-50 space-y-2">
                        <p className="text-[12px] font-medium text-green-800">{t('negotiations.setAgreedPrice')}</p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={agreedPrice}
                                    onChange={e => setAgreedPrice(e.target.value)}
                                    placeholder={`${t('negotiations.proposed')}: ${negotiation.buyerProposedPrice.toLocaleString()}`}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-green-200 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                />
                            </div>
                            <button onClick={() => setShowPriceInput(false)}
                                className="px-3 rounded-xl border border-border bg-background hover:bg-accent text-[13px] transition-colors">
                                {t('negotiations.cancel')}
                            </button>
                            <button onClick={handleSetPrice} disabled={acting || !agreedPrice}
                                className="px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-medium transition-colors disabled:opacity-60 flex items-center gap-1.5">
                                {acting
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <><CheckCircle size={13} /> {t('negotiations.confirm')}</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* chat input row */}
                <div className="flex gap-2">
                    <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder={t('negotiations.typeMessage')}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                        disabled={acting}
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim() || acting}
                        className="px-3 rounded-xl border border-border bg-background hover:bg-accent transition-colors disabled:opacity-40">
                        {acting ? (
                            <Loader2 size={15} className="text-muted-foreground animate-spin" />
                        ) : (
                            <Send size={15} className="text-muted-foreground" />
                        )}
                    </button>
                </div>

                {/* seller action buttons */}
                {!showPriceInput && !showRejectConfirm && !showCounterConfirm && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPriceInput(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-50"
                            disabled={acting}
                        >
                            {acting ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <>
                                    <DollarSign size={14} />
                                    {t('negotiations.setAgreedPrice')}
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-4 py-2.5 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground text-[13px] transition-colors disabled:opacity-50"
                            disabled={acting}
                        >
                            {acting ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                t('negotiations.decline')
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ── BUYER action bar — chat only (seller sets the price) ───────
    return (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">

            {/* Accept Confirmation */}
            {showAcceptConfirm && negotiation.agreedPrice && (
                <NegotiationActionConfirm
                    type="ACCEPT"
                    onConfirm={() => handleConfirmAction('ACCEPT')}
                    onCancel={() => setShowAcceptConfirm(false)}
                    loading={acting}
                    negotiationData={{
                        buyerProposedPrice: negotiation.buyerProposedPrice,
                        sellerResponsePrice: negotiation.agreedPrice || 0,
                        productName: negotiation.order.product.name,
                        quantity: negotiation.order.quantity
                    }}
                />
            )}

            {/* Reject Confirmation for Buyer Final Price */}
            {showRejectConfirm && showBuyerFinalActions && (
                <NegotiationActionConfirm
                    type="REJECT_FINAL"
                    onConfirm={() => handleConfirmAction('REJECT')}
                    onCancel={() => setShowRejectConfirm(false)}
                    loading={acting}
                    negotiationData={{
                        sellerResponsePrice: negotiation.agreedPrice || 0,
                        productName: negotiation.order.product.name,
                        quantity: negotiation.order.quantity
                    }}
                />
            )}

            {/* Message Confirmation */}
            {showMessageConfirm && (
                <NegotiationActionConfirm
                    type="MESSAGE"
                    onConfirm={(data) => handleConfirmAction('CHAT', data)}
                    onCancel={() => setShowMessageConfirm(false)}
                    loading={acting}
                    negotiationData={{
                        productName: negotiation.order.product.name
                    }}
                />
            )}

            {/* Chat input - only show when seller hasn't set final price */}
            {!showBuyerFinalActions && !isFinalState && (
                <div className="flex gap-2">
                    <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder={t('negotiations.typeMessageSeller')}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                        disabled={acting}
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim() || acting}
                        className="px-3 rounded-xl border border-border bg-background hover:bg-accent transition-colors disabled:opacity-40">
                        {acting ? (
                            <Loader2 size={15} className="text-muted-foreground animate-spin" />
                        ) : (
                            <Send size={15} className="text-muted-foreground" />
                        )}
                    </button>
                </div>
            )}

            {/* Buyer final actions - Accept or Reject seller's final price */}
            {showBuyerFinalActions && (
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        disabled={acting}
                    >
                        {acting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={14} />
                                  {t('negotiations.acceptPrice', { price: negotiation.agreedPrice?.toLocaleString() || '0' })}
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-4 py-2.5 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground text-[13px] transition-colors disabled:opacity-50"
                        disabled={acting}
                    >
                        {acting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            t('negotiations.reject')
                        )}
                    </button>
                </div>
            )}

            {/* Legacy accept button - only show when not in final state and no seller final price */}
            {!showBuyerFinalActions && negotiation.agreedPrice && !showAcceptConfirm && (
                <button
                    onClick={handleAccept}
                    className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={acting}
                >
                    {acting ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <CheckCircle size={14} />
                            {t('negotiations.acceptPrice', { price: negotiation.agreedPrice.toLocaleString() })}
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
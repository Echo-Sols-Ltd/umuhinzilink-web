'use client';

import React, { useState } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { Send, CheckCircle, XCircle, DollarSign, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const [message, setMessage]       = useState('');
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [agreedPrice, setAgreedPrice] = useState('');
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);

    const handleSendMessage = () => {
        if (!message.trim()) return;
        onAction('CHAT', { message: message.trim() });
        setMessage('');
    };

    const handleSetPrice = () => {
        const price = parseFloat(agreedPrice);
        if (!price || price <= 0) return;
        onAction('SET_PRICE', { price });
        setAgreedPrice('');
        setShowPriceInput(false);
    };

    const handleAccept = () => {
        onAction('ACCEPT');
        setShowAcceptConfirm(false);
    };

    const handleReject = () => {
        onAction('REJECT', { message: 'Negotiation declined' });
        setShowRejectConfirm(false);
    };

  

  

    // ── SELLER action bar — chat + set agreed price + decline ──────
    if (currentUserType === 'seller') {
        return (
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">

                {/* confirm dialogs */}
                {showRejectConfirm && (
                    <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between gap-3">
                        <p className="text-[13px] text-foreground">Decline this negotiation?</p>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => setShowRejectConfirm(false)}
                                className="px-3 py-1.5 rounded-lg border border-border text-[12px] hover:bg-accent transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleReject} disabled={acting}
                                className="px-3 py-1.5 rounded-lg bg-destructive text-white text-[12px] hover:bg-destructive/90 transition-colors disabled:opacity-60">
                                {acting ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                            </button>
                        </div>
                    </div>
                )}

                {/* agreed price input */}
                {showPriceInput && (
                    <div className="p-3 rounded-xl border border-green-200 bg-green-50 space-y-2">
                        <p className="text-[12px] font-medium text-green-800">Set final agreed price</p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={agreedPrice}
                                    onChange={e => setAgreedPrice(e.target.value)}
                                    placeholder={`Buyer proposed: ${negotiation.buyerProposedPrice.toLocaleString()}`}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-green-200 bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                />
                            </div>
                            <button onClick={() => setShowPriceInput(false)}
                                className="px-3 rounded-xl border border-border bg-background hover:bg-accent text-[13px] transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSetPrice} disabled={acting || !agreedPrice}
                                className="px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-medium transition-colors disabled:opacity-60 flex items-center gap-1.5">
                                {acting
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <><CheckCircle size={13} /> Confirm</>}
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
                        placeholder="Type a message…"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                    <button onClick={handleSendMessage} disabled={!message.trim() || acting}
                        className="px-3 rounded-xl border border-border bg-background hover:bg-accent transition-colors disabled:opacity-40">
                        <Send size={15} className="text-muted-foreground" />
                    </button>
                </div>

                {/* seller action buttons */}
                {!showPriceInput && !showRejectConfirm && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPriceInput(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors"
                        >
                            <DollarSign size={14} />
                            Set agreed price
                        </button>
                        <button
                            onClick={() => setShowRejectConfirm(true)}
                            className="px-4 py-2.5 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground text-[13px] transition-colors"
                        >
                            Decline
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ── BUYER action bar — chat only (seller sets the price) ───────
    return (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">

            {showAcceptConfirm && negotiation.agreedPrice && (
                <div className="p-3 rounded-xl border border-green-200 bg-green-50 flex items-center justify-between gap-3">
                    <p className="text-[13px] text-green-800">
                        Accept RWF {negotiation.agreedPrice.toLocaleString()} for {negotiation.order.quantity} {negotiation.order.product.measurementUnit}?
                    </p>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => setShowAcceptConfirm(false)}
                            className="px-3 py-1.5 rounded-lg border border-border text-[12px] hover:bg-accent transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleAccept} disabled={acting}
                            className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-[12px] hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center gap-1">
                            {acting ? <Loader2 size={12} className="animate-spin" /> : <><CheckCircle size={12} /> Accept</>}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Type a message to the seller…"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button onClick={handleSendMessage} disabled={!message.trim() || acting}
                    className="px-3 rounded-xl border border-border bg-background hover:bg-accent transition-colors disabled:opacity-40">
                    <Send size={15} className="text-muted-foreground" />
                </button>
            </div>

            {/* if seller has set an agreed price, buyer can accept */}
            {negotiation.agreedPrice && !showAcceptConfirm && (
                <button
                    onClick={() => setShowAcceptConfirm(true)}
                    className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCircle size={14} />
                    Accept RWF {negotiation.agreedPrice.toLocaleString()}
                </button>
            )}
        </div>
    );
};
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Send, Paperclip, CheckCheck, Check, Clock,
    ChevronRight, X, Sprout, AlertCircle,
    TrendingUp, XCircle, CheckCircle, User,
    ArrowLeft, MoreVertical, Phone, Package,
    DollarSign, Info, Loader2, CornerUpLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn, imageUrl } from '@/lib/utils';
import { notify } from '@/lib/notify';
import { Client } from '@stomp/stompjs';
import { UserRole, Negotiation, NegotiationMessage } from '@/types';


interface NegotiationChatProps {
    negotiationId: string;
    currentRole: UserRole;
    onBack?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(dateStr).toLocaleDateString('en-RW', { month: 'short', day: 'numeric' });
}

function timeUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hrs}h left`;
    return `${hrs}h left`;
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
    msg, isOwn, onReply,
}: {
    msg: NegotiationMessage;
    isOwn: boolean;
    onReply: (msg: NegotiationMessage) => void;
}) {
    const [showActions, setShowActions] = useState(false);


    return (
        <div
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}>

            {/* Avatar — other person */}
            {!isOwn && (
                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0 mr-2 mt-1">
                    <User size={12} className="text-green-700 dark:text-green-300" />
                </div>
            )}

            <div className="max-w-[70%]">
                {/* Bubble */}
                <div className={`relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-gray-800 text-foreground border border-border rounded-tl-sm'
                    }`}>
                    {msg.content}

                    {/* Reply button */}
                    <button
                        onClick={() => onReply(msg)}
                        className={cn(
                            'absolute -top-2 p-1 rounded-full shadow-md transition-all',
                            isOwn ? '-left-8' : '-right-8',
                            showActions ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                            'bg-white dark:bg-gray-800 text-muted-foreground hover:text-foreground border border-border'
                        )}>
                        <CornerUpLeft size={11} />
                    </button>
                </div>

                {/* Meta */}
                <div className={`flex items-center gap-1.5 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-muted-foreground">{timeAgo(msg.createdAt)}</span>
                    {isOwn && (
                        msg.isRead
                            ? <CheckCheck size={11} className="text-green-400" />
                            : <Check size={11} className="text-muted-foreground" />
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Seller price panel ────────────────────────────────────────────────────────

function SellerPricePanel({
    negotiation,
    onSetOffer,
    onAccept,
    onReject,
    loading,
}: {
    negotiation: Negotiation;
    onSetOffer: (price: number) => Promise<void>;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
    loading: boolean;
}) {
    const [offerInput, setOfferInput] = useState('');
    const [offerError, setOfferError] = useState('');
    const [confirming, setConfirming] = useState<'accept' | 'reject' | null>(null);

    const product = negotiation.order.product;
    const buyerPrice = negotiation.buyerProposedPrice;
    const listedPrice = product.unitPrice;
    const agreedPrice = negotiation.agreedPrice;
    const isActive = negotiation.status === 'PENDING';
    const discount = Math.round((1 - buyerPrice / listedPrice) * 100);

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

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-border">

            {/* Panel header */}
            <div className="px-4 py-3.5 border-b border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Negotiation</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                    {negotiation.order.orderNumber}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Status */}
                <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold',
                    negotiation.status === 'PENDING' && 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
                    negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
                    negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/30 text-red-600',
                    negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800 text-gray-500',
                )}>
                    {negotiation.status === 'PENDING' && <AlertCircle size={13} />}
                    {negotiation.status === 'ACCEPTED' && <CheckCircle size={13} />}
                    {negotiation.status === 'REJECTED' && <XCircle size={13} />}
                    {negotiation.status === 'EXPIRED' && <Clock size={13} />}
                    {negotiation.status === 'PENDING' ? `Expires in ${timeUntil(negotiation.expiresAt)}` : negotiation.status}
                </div>

                {/* Product */}
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

                {/* Price breakdown */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price breakdown</p>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="text-xs text-muted-foreground">Your listed price</span>
                            <span className="text-xs font-bold text-foreground">{fmt(listedPrice)}</span>
                        </div>

                        <div className={cn(
                            'flex items-center justify-between py-2 px-3 rounded-xl',
                            discount > 30
                                ? 'bg-red-50 dark:bg-red-950/20'
                                : 'bg-amber-50 dark:bg-amber-950/20'
                        )}>
                            <div>
                                <span className="text-xs text-muted-foreground">Buyer's offer</span>
                                {discount > 0 && (
                                    <span className={cn(
                                        'ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
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
                            )}>{fmt(buyerPrice)}</span>
                        </div>

                        {agreedPrice && (
                            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                                <span className="text-xs text-muted-foreground">Your counter offer</span>
                                <span className="text-sm font-extrabold text-green-700 dark:text-green-400">{fmt(agreedPrice)}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                            <span className="text-xs font-semibold text-foreground">Order total</span>
                            <span className="text-sm font-extrabold text-green-700 dark:text-green-400">
                                {fmt((agreedPrice ?? buyerPrice) * negotiation.order.quantity)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Set counter offer */}
                {isActive && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Set your price</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Enter the price you're willing to accept. The buyer will be notified.
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">RWF</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder={String(Math.round(buyerPrice * 1.1))}
                                    value={offerInput}
                                    onChange={e => { setOfferInput(e.target.value); setOfferError(''); }}
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
                                Send
                            </button>
                        </div>
                        {offerError && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle size={11} /> {offerError}
                            </p>
                        )}
                    </div>
                )}

                {/* Accept / Reject */}
                {isActive && (
                    <div className="space-y-2 pt-2 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or decide now</p>

                        {confirming === 'accept' ? (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                    Accept buyer's offer of {fmt(buyerPrice)}?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { onAccept(); setConfirming(null); }}
                                        disabled={loading}
                                        className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                        {loading ? 'Accepting…' : 'Yes, accept'}
                                    </button>
                                    <button
                                        onClick={() => setConfirming(null)}
                                        className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : confirming === 'reject' ? (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800 space-y-3">
                                <p className="text-xs text-red-600 font-medium">
                                    Reject this negotiation? The order will be cancelled.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { onReject(); setConfirming(null); }}
                                        disabled={loading}
                                        className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                        {loading ? 'Rejecting…' : 'Yes, reject'}
                                    </button>
                                    <button
                                        onClick={() => setConfirming(null)}
                                        className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
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
                )}

                {/* Closed state */}
                {!isActive && (
                    <div className={cn(
                        'p-4 rounded-xl text-center space-y-1',
                        negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/20',
                        negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/20',
                        negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800',
                    )}>
                        {negotiation.status === 'ACCEPTED' && <CheckCircle size={24} className="text-emerald-500 mx-auto" />}
                        {negotiation.status === 'REJECTED' && <XCircle size={24} className="text-red-500 mx-auto" />}
                        {negotiation.status === 'EXPIRED' && <Clock size={24} className="text-gray-400 mx-auto" />}
                        <p className="text-sm font-bold text-foreground mt-2">
                            {negotiation.status === 'ACCEPTED' && 'Deal agreed!'}
                            {negotiation.status === 'REJECTED' && 'Negotiation closed'}
                            {negotiation.status === 'EXPIRED' && 'Offer expired'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {negotiation.status === 'ACCEPTED' && `Final price: ${fmt(negotiation.agreedPrice ?? buyerPrice)}`}
                            {negotiation.status === 'REJECTED' && 'This negotiation was rejected'}
                            {negotiation.status === 'EXPIRED' && 'No agreement was reached'}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NegotiationChat({
    negotiationId,
    currentRole,
    onBack,
}: NegotiationChatProps) {
    const { user } = useAuth();

    const [negotiation, setNegotiation] = useState<Negotiation | null>();
    const [messages, setMessages] = useState<NegotiationMessage[]>([]);
    const [input, setInput] = useState('');
    const [replyTo, setReplyTo] = useState<NegotiationMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const stompRef = useRef<Client | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const isSeller = currentRole === 'SELLER';


    // ── Scroll to bottom ──────────────────────────────────────────────────

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    // ── Send message ──────────────────────────────────────────────────────

    const sendMessage = async () => {
        if (!input.trim() || sending) return;
        setSending(true);
        const content = input.trim();
        setInput('');
        setReplyTo(null);

        try {
            stompRef.current?.publish({
                destination: `/app/negotiation/${negotiationId}/message`,
                body: JSON.stringify({
                    negotiationId,
                    content,
                    type: 'TEXT',
                    replyToId: replyTo?.id ?? null,
                }),
            });
        } catch {
            notify.error('Failed to send message');
            setInput(content);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // ── Typing indicator ──────────────────────────────────────────────────

    const handleTyping = () => {
        stompRef.current?.publish({
            destination: `/app/negotiation/${negotiationId}/typing`,
            body: JSON.stringify({ isTyping: true }),
        });
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            stompRef.current?.publish({
                destination: `/app/negotiation/${negotiationId}/typing`,
                body: JSON.stringify({ isTyping: false }),
            });
        }, 2000);
    };

    // ── Negotiation actions ───────────────────────────────────────────────

    const handleSetOffer = async (price: number) => {
        setActionLoading(true);
        try {
            // TODO: await negotiationService.setSellerOffer(negotiationId, price);
            // Optimistically update
            setNegotiation(prev => prev ? { ...prev, agreedPrice: price } : prev);

            // Also send as OFFER message via WS
            stompRef.current?.publish({
                destination: `/app/negotiation/${negotiationId}/message`,
                body: JSON.stringify({
                    negotiationId,
                    content: `Offered price: ${fmt(price)}`,
                    type: 'OFFER',
                    offeredPrice: price,
                }),
            });
            notify.success(`Price offer of ${fmt(price)} sent`);
        } catch {
            notify.error('Failed to send offer');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            notify.success('Negotiation accepted!');
        } catch {
            notify.error('Failed to accept negotiation');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            notify.success('Negotiation rejected');
        } catch {
            notify.error('Failed to reject negotiation');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <Loader2 size={28} className="animate-spin text-green-600 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading negotiation…</p>
                </div>
            </div>
        );
    }

    const otherName = negotiation
        ? isSeller
            ? `${negotiation.order.buyer.firstName} ${negotiation.order.buyer.lastName}`
            : 'Seller'
        : 'Unknown';

    const isNegotiationActive = negotiation?.status === 'PENDING';

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className={cn(
            'flex h-full bg-gray-50 dark:bg-gray-950 overflow-hidden',
        )}>

            {/* ── Chat panel ───────────────────────────────────────────── */}
            <div className={cn(
                'flex flex-col w-full',
                isSeller ? 'flex-1' : 'flex-1'
            )}>

                {/* Chat header */}
                <div className="h-14 bg-white dark:bg-gray-900 border-b border-border flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ArrowLeft size={16} />
                            </button>
                        )}
                        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <User size={16} className="text-green-700 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{otherName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {isTyping ? (
                                    <span className="text-green-500 animate-pulse">typing…</span>
                                ) : (
                                    <>
                                        <Sprout size={10} className="text-green-500" />
                                        {negotiation?.order.product.name}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {negotiation && (
                            <span className={cn(
                                'text-xs font-semibold px-2 py-0.5 rounded-full',
                                negotiation.status === 'PENDING' && 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
                                negotiation.status === 'ACCEPTED' && 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700',
                                negotiation.status === 'REJECTED' && 'bg-red-100 dark:bg-red-900/40 text-red-600',
                                negotiation.status === 'EXPIRED' && 'bg-gray-200 dark:bg-gray-700 text-gray-500',
                            )}>
                                {negotiation.status}
                            </span>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">

                    {/* System message at top */}
                    {negotiation && (
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-border rounded-full text-xs text-muted-foreground shadow-sm">
                                <TrendingUp size={12} className="text-amber-500" />
                                Buyer offered <span className="font-bold text-foreground mx-1">{fmt(negotiation.buyerProposedPrice)}</span>
                                for {negotiation.order.quantity} {negotiation.order.product.measurementUnit?.toLowerCase()}
                            </div>
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-3">
                                <Sprout size={24} className="text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Start the conversation</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isSeller
                                    ? 'Reply to the buyer or set your price on the right'
                                    : 'Chat with the seller to agree on a price'}
                            </p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isOwn={msg.sender.id === user?.id}
                                onReply={setReplyTo}
                            />
                        ))
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Reply preview */}
                {replyTo && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 border-t border-green-200 dark:border-green-800">
                        <CornerUpLeft size={13} className="text-green-600 shrink-0" />
                        <p className="text-xs text-foreground flex-1 truncate">{replyTo.content}</p>
                        <button
                            onClick={() => setReplyTo(null)}
                            className="text-muted-foreground hover:text-foreground">
                            <X size={13} />
                        </button>
                    </div>
                )}


                {/* Input */}
                <div className="bg-white dark:bg-gray-900 border-t border-border px-3 py-3 flex items-center gap-2 shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={
                            !isNegotiationActive
                                ? 'Negotiation is closed'
                                : 'Type a message…'
                        }
                        disabled={!isNegotiationActive || sending}
                        value={input}
                        onChange={e => { setInput(e.target.value); handleTyping(); }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        className="flex-1 h-10 px-4 text-sm bg-gray-50 dark:bg-gray-800 border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-all"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || sending || !isNegotiationActive}
                        className="w-10 h-10 bg-green-600 hover:bg-green-700 disabled:opacity-40 rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
                        {sending
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Send size={16} />
                        }
                    </button>
                </div>
            </div>

            {/* ── Seller right panel ────────────────────────────────────── */}
            {isSeller && negotiation && (
                <div className="w-72 border-l border-border">
                    <SellerPricePanel
                        negotiation={negotiation}
                        onSetOffer={handleSetOffer}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        loading={actionLoading}
                    />
                </div>
            )}
        </div>
    );
}
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
import { useI18n } from '@/contexts/I18nContext';
import { cn, imageUrl } from '@/lib/utils';
import { notify } from '@/lib/notify';
import { UserRole, Negotiation, NegotiationMessage } from '@/types';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { useNegotiationAction } from '@/hooks/useNegotiationAction';
import { useWallet } from '@/contexts/WalletContext';
import { socketService } from '@/services/socket';
import SellerPricePanel from './PricePanel';
import PageLoading from '@/components/layout/PageLoading';


interface NegotiationChatProps {
    negotiationId: string;
    currentRole: UserRole;
    onBack?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeAgo(dateStr: string, t: (key: string, vars?: Record<string, string | number>) => string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('settings.negotiations.timeAgo.justNow');
    if (mins < 60) return t('settings.negotiations.timeAgo.minutes', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('settings.negotiations.timeAgo.hours', { count: hrs });
    return new Date(dateStr).toLocaleDateString('en-RW', { month: 'short', day: 'numeric' });
}

function statusLabel(status: string, t: (key: string) => string) {
    const key = `settings.negotiations.${status.toLowerCase()}`;
    return t(key);
}


// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
    msg, isOwn, onReply, t,
}: {
    msg: NegotiationMessage;
    isOwn: boolean;
    onReply: (msg: NegotiationMessage) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
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
                    <span className="text-[10px] text-muted-foreground">{timeAgo(msg.createdAt, t)}</span>
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


// ── Main component ────────────────────────────────────────────────────────────

export default function NegotiationChat({
    negotiationId,
    currentRole,
    onBack,
}: NegotiationChatProps) {
    const { user } = useAuth();
    const { t } = useI18n();
    const { negotiationMessages: messages, detailLoading, currentNegotiation: negotiation } = useNegotiation()
    const {
        sendNegotiationMessage,
        setSellerOffer,
        setBuyerOffer,
        sellerAcceptBuyerOffer,
        buyerAcceptSellerOffer,
        rejectNegotiation,
        loading: actionLoading,
        refresh,
    } = useNegotiationAction(negotiationId)
    const { handleWalletPayment } = useWallet()
    const [input, setInput] = useState('');
    const [replyTo, setReplyTo] = useState<NegotiationMessage | null>(null);
    const [sending, setSending] = useState(false);
    const [otherTyping, setOtherTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSeller = currentRole === 'SELLER';


    // ── Scroll to bottom ──────────────────────────────────────────────────

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    useEffect(() => {
        const unsubscribe = socketService.onTyping((event) => {
            if (event.negotiationId && event.negotiationId !== negotiationId) return;
            if (event.userId === user?.id) return;
            if (event.typing) {
                setOtherTyping(true);
                if (typingClearRef.current) clearTimeout(typingClearRef.current);
                typingClearRef.current = setTimeout(() => setOtherTyping(false), 3000);
            } else {
                setOtherTyping(false);
            }
        });
        return () => {
            unsubscribe();
            if (typingClearRef.current) clearTimeout(typingClearRef.current);
        };
    }, [negotiationId, user?.id]);

    const handleInputChange = (value: string) => {
        setInput(value);
        if (negotiation?.status !== 'PENDING') return;

        socketService.sendTyping(negotiationId, true);
        if (typingStopRef.current) clearTimeout(typingStopRef.current);
        typingStopRef.current = setTimeout(() => {
            socketService.sendTyping(negotiationId, false);
        }, 1200);
    };



    // ── Send message ──────────────────────────────────────────────────────

    const sendMessage = async () => {
        if (!input.trim() || sending) return;
        setSending(true);
        const content = input.trim();
        setInput('');
        setReplyTo(null);

        try {
            await sendNegotiationMessage(negotiationId, content)
        } catch {
            notify.error(t('settings.negotiations.sendFailed'));
            setInput(content);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };


    // ── Loading ───────────────────────────────────────────────────────────

    if (detailLoading) {
        return (
            <PageLoading
                fullScreen={false}
                className="h-full min-h-[320px] bg-gray-50 dark:bg-gray-950"
                label={t('settings.negotiations.loadingLabel')}
                description={t('settings.negotiations.loadingDescription')}
            />
        );
    }

    const otherName = negotiation
        ? isSeller
            ? `${negotiation.order.buyer.firstName} ${negotiation.order.buyer.lastName}`
            : t('settings.negotiations.seller')
        : t('settings.negotiations.unknown');

    const isNegotiationActive = negotiation?.status === 'PENDING';

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className={cn(
            'flex h-full min-h-0 bg-gray-50 dark:bg-gray-950 overflow-hidden',
        )}>

            {/* ── Chat panel ───────────────────────────────────────────── */}
            <div className={cn(
                'flex flex-col w-full h-full min-h-0',
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
                                {otherTyping ? (
                                    <span className="text-green-500 animate-pulse">{t('settings.negotiations.typing')}</span>
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
                                {statusLabel(negotiation.status, t)}
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
                                {t('settings.negotiations.buyerOfferedBanner', {
                                    price: fmt(negotiation.buyerProposedPrice),
                                    quantity: negotiation.order.quantity,
                                    unit: negotiation.order.product.measurementUnit?.toLowerCase() ?? '',
                                })}
                            </div>
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-3">
                                <Sprout size={24} className="text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{t('settings.negotiations.startConversation')}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isSeller
                                    ? t('settings.negotiations.emptySellerHint')
                                    : t('settings.negotiations.emptyBuyerHint')}
                            </p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isOwn={msg.sender.id === user?.id}
                                onReply={setReplyTo}
                                t={t}
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
                                ? t('settings.negotiations.negotiationClosed')
                                : t('settings.negotiations.typeMessage')
                        }
                        disabled={!isNegotiationActive || sending}
                        value={input}
                        onChange={e => handleInputChange(e.target.value)}
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
            {negotiation && (
                <div className="w-72 border-l border-border">
                    <SellerPricePanel
                        negotiation={negotiation}
                        onSetSellerOffer={(price) => setSellerOffer(negotiationId, price)}
                        onSetBuyerOffer={(price) => setBuyerOffer(negotiationId, price)}
                        onSellerAcceptBuyer={() => sellerAcceptBuyerOffer(negotiationId)}
                        onBuyerAcceptSeller={() => buyerAcceptSellerOffer(negotiationId)}
                        onReject={() => rejectNegotiation(negotiationId)}
                        onPayOrder={async () => {
                            await handleWalletPayment(negotiation.order.id)
                            await refresh()
                        }}
                        loading={actionLoading}
                        isSeller={user?.role === 'SELLER'}
                    />
                </div>
            )}
        </div>
    );
}
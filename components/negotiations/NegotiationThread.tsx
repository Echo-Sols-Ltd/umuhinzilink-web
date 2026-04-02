'use client';

import React, { useEffect, useRef } from 'react';
import { Negotiation, NegotiationStatus, Message } from '@/types';
import { User, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { getNegotiationUtils } from '@/lib/negotiation-utils';

// ─── single message bubble ────────────────────────────────────────
interface BubbleProps {
    message: Message;
    currentUserType: 'buyer' | 'seller';
}

const MessageBubble: React.FC<BubbleProps> = ({ message, currentUserType }) => {
    const senderRole = message.sender?.role;
    const isFromBuyer = senderRole === 'BUYER';
    const isMe =
        (currentUserType === 'buyer' && isFromBuyer) ||
        (currentUserType === 'seller' && !isFromBuyer);

    // system event — centered pill
    if ((message as any).type === 'SYSTEM') {
        return (
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-muted-foreground font-medium px-3 py-1 rounded-full border border-border bg-background">
                    {message.content}
                </span>
                <div className="flex-1 h-px bg-border" />
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col mb-4 group', isMe ? 'ml-auto items-end' : 'items-start')}>
            {/* sender name — show only for other party */}
            {!isMe && (
                <div className="flex items-center gap-1.5 mb-1 px-1">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <User size={11} className="text-muted-foreground" />
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">
                        {message.sender?.firstName} {message.sender?.lastName}
                    </span>
                </div>
            )}

            {/* bubble */}
            <div className={cn(
                'px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed max-w-md break-words transition-all duration-200',
                isMe
                    ? 'bg-green-600 text-white rounded-tr-sm shadow-sm'
                    : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'
            )}>
                {message.content}
            </div>

            {/* timestamp */}
            <div className={cn('flex items-center gap-1 mt-1 px-1', isMe ? 'justify-end' : 'justify-start')}>
                <Clock size={10} className="text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground/70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && <CheckCircle2 size={10} className="text-green-500" />}
            </div>
        </div>
    );
};

// ─── thread ───────────────────────────────────────────────────────
interface NegotiationThreadProps {
    negotiation: Negotiation;
    messages: Message[];            // all messages from socket/context
    currentUserType: 'buyer' | 'seller';
}

export const NegotiationThread: React.FC<NegotiationThreadProps> = ({
    negotiation,
    messages,
    currentUserType,
}) => {
    const { t } = useI18n();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { isExpired, timeRemaining } = getNegotiationUtils(negotiation);

    // filter to only messages for THIS negotiation
    const threadMessages = messages.filter(m => {
        const mid = (m as any).negotiationId || (m as any).negotiation_id;
        return mid === negotiation.id;
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [threadMessages.length]);

    const otherParty = currentUserType === 'buyer'
        ? `${negotiation.order.product.owner.firstName} ${negotiation.order.product.owner.lastName}`
        : `${negotiation.order.buyer.firstName} ${negotiation.order.buyer.lastName}`;

    const statusStyle: Record<NegotiationStatus, string> = {
        [NegotiationStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
        [NegotiationStatus.ACCEPTED]: 'bg-green-50 text-green-700 border-green-200',
        [NegotiationStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-200',
        [NegotiationStatus.EXPIRED]: 'bg-muted text-muted-foreground border-border',
        [NegotiationStatus.COUNTERED]: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
        });
    };

    return (
        <div className="flex flex-col flex-1 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

            {/* thread header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User size={15} className="text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-[13px] font-semibold text-foreground leading-tight">{otherParty}</p>
                        <p className="text-[11px] text-muted-foreground">
                            {negotiation.order.product.name}
                        </p>
                    </div>
                </div>
                <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border',
                    statusStyle[isExpired ? NegotiationStatus.EXPIRED : negotiation.status]
                )}>
                    {isExpired ? t('negotiations.expired') : t(`common.status.${negotiation.status.toLowerCase()}`)}
                </span>
            </div>

            {/* price context bar */}
            <div className="px-5 py-2.5 bg-muted/30 border-b border-border flex items-center gap-4 text-[12px] shrink-0 overflow-x-auto no-scrollbar">
                <div className="shrink-0">
                    <span className="text-muted-foreground">{t('negotiations.listed')} </span>
                    <span className="font-medium line-through text-muted-foreground/60">
                        RWF {negotiation.order.product.unitPrice.toLocaleString()}
                    </span>
                </div>
                <div className="w-px h-3 bg-border shrink-0" />
                <div className="shrink-0">
                    <span className="text-muted-foreground">{t('negotiations.proposed')} </span>
                    <span className="font-semibold text-foreground">
                        RWF {negotiation.buyerProposedPrice.toLocaleString()}
                    </span>
                </div>
                {negotiation.agreedPrice && (
                    <>
                        <div className="w-px h-3 bg-border shrink-0" />
                        <div className="shrink-0">
                            <span className="text-muted-foreground">{t('negotiations.agreed')} </span>
                            <span className="font-semibold text-green-600">
                                RWF {negotiation.agreedPrice.toLocaleString()}
                            </span>
                        </div>
                    </>
                )}
                <div className="ml-auto flex items-center gap-1 text-muted-foreground shrink-0 whitespace-nowrap">
                    <Clock size={11} />
                    <span>{timeRemaining}</span>
                </div>
            </div>

            {/* messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
            >
                {threadMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-center py-12">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                            <User size={18} className="text-muted-foreground" />
                        </div>
                        <p className="text-[13px] text-muted-foreground max-w-[200px]">
                            {t('negotiations.noMessages')}
                        </p>
                    </div>
                ) : (
                    threadMessages.map((msg, i) => {
                        const showDate = i === 0 ||
                            new Date(msg.timestamp).toDateString() !==
                            new Date(threadMessages[i - 1]?.timestamp || '').toDateString();

                        return (
                            <React.Fragment key={msg.id ?? i}>
                                {showDate && (
                                    <div className="flex justify-center my-6">
                                        <span className="bg-muted/50 text-muted-foreground text-[10px] font-medium px-3 py-1 rounded-full border border-border/50">
                                            {formatDate(msg.timestamp)}
                                        </span>
                                    </div>
                                )}
                                <MessageBubble
                                    message={msg}
                                    currentUserType={currentUserType}
                                />
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </div>
    );
};
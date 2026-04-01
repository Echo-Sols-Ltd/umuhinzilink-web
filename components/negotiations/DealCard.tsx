'use client';

import React from 'react';
import Image from 'next/image';
import { Negotiation, NegotiationStatus } from '@/types';
import { Clock, User, CheckCircle2, Package, BadgeCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealCardProps {
    negotiation: Negotiation;
}

function fmt(n: number) {
    return `RWF ${Math.round(n).toLocaleString()}`;
}

function proximity(listed: number, proposed: number): number {
    if (listed <= 0) return 0;
    const pct = (proposed / listed) * 100;
    // 100% = proposed equals listed (perfect). below = buyer wants discount
    return Math.min(100, Math.max(0, pct));
}

import { getNegotiationUtils } from '@/lib/negotiation-utils';

export const DealCard: React.FC<DealCardProps> = ({ negotiation }) => {
    const { order, buyerProposedPrice, agreedPrice } = negotiation;
    const { product, buyer, quantity } = order;
    const { isExpired, timeRemaining } = getNegotiationUtils(negotiation);

    const prox      = proximity(product.unitPrice, buyerProposedPrice);
    const barColor  = prox >= 90 ? 'bg-green-500' : prox >= 70 ? 'bg-amber-500' : 'bg-red-500';
    const proxLabel = prox >= 90 ? 'Very close to listed price'
                    : prox >= 70 ? 'Reasonable offer'
                    :              'Offer is far from listed price';

    const isUrgent  = !isExpired && timeRemaining.includes('h') && parseInt(timeRemaining) < 3;

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-24">

            {/* product image */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {product.image
                    ? <Image src={product.image} alt={product.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-muted-foreground/40" />
                      </div>}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-foreground shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-5 space-y-5">

                {/* product name */}
                <div>
                    <h2 className="text-xl font-bold text-foreground leading-tight">{product.name}</h2>
                    {product.district && (
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[12px]">
                            <MapPin size={12} />
                            <span>{String(product.district).replace(/_/g, ' ')}</span>
                        </div>
                    )}
                </div>

                {/* price section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Listed</p>
                            <p className="text-[15px] line-through text-muted-foreground">{fmt(product.unitPrice)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-primary uppercase tracking-wide mb-1">Buyer proposed</p>
                            <p className="text-2xl font-bold text-foreground">{fmt(buyerProposedPrice)}</p>
                        </div>
                    </div>

                    {/* proximity bar */}
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full transition-all duration-500', barColor)}
                                style={{ width: `${prox}%` }} />
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground">{proxLabel}</p>
                    </div>

                    {/* agreed price if set */}
                    {agreedPrice && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="text-green-600" />
                                <span className="text-[12px] font-medium text-green-800">Agreed price</span>
                            </div>
                            <span className="text-[14px] font-bold text-green-700">{fmt(agreedPrice)}</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-border" />

                {/* seller info */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-foreground truncate">
                                {product.owner.firstName} {product.owner.lastName}
                            </span>
                            {product.owner.isVerified && (
                                <BadgeCheck size={14} className="text-primary shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            {String(product.owner.role).toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* details grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Quantity</p>
                        <p className="text-[13px] font-semibold text-foreground">
                            {quantity} {product.measurementUnit}
                        </p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Certification</p>
                        <p className="text-[13px] font-semibold text-foreground">
                            {product.certification ?? 'None'}
                        </p>
                    </div>
                </div>

                {/* expiry */}
                {!isExpired ? (
                    <div className={cn(
                        'flex items-center justify-between p-3 rounded-xl border',
                        isUrgent ? 'bg-red-50 border-red-200' : 'bg-muted/40 border-border'
                    )}>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className={isUrgent ? 'text-red-500' : 'text-muted-foreground'} />
                            <span className="text-[12px] text-muted-foreground">Expires in</span>
                        </div>
                        <span className={cn(
                            'text-[13px] font-bold',
                            isUrgent ? 'text-red-600' : 'text-foreground'
                        )}>
                            {timeRemaining}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-3 rounded-xl bg-muted/40 border border-border">
                        <span className="text-[12px] text-muted-foreground">Negotiation expired</span>
                    </div>
                )}
            </div>
        </div>
    );
};
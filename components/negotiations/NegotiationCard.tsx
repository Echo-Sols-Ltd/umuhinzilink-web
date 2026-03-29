'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Negotiation, NegotiationStatus } from '@/types';
import { Clock, CheckCircle, XCircle, ArrowRight, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NegotiationCardProps {
  negotiation: Negotiation;
  userType?: 'buyer' | 'seller';

}

function fmt(n: number) {
  return `RWF ${Math.round(n).toLocaleString()}`;
}

function timeLabel(t: string) {
  if (!t || t === 'Expired') return { label: 'Expired', urgent: true };
  return { label: t, urgent: t.includes('h') && parseInt(t) < 3 };
}

export default function NegotiationCard({ negotiation, userType = 'buyer' }: NegotiationCardProps) {
  const { order, buyerProposedPrice, agreedPrice, status, isExpired, timeRemaining } = negotiation;
  const { product } = order;

  const effectiveStatus = isExpired ? NegotiationStatus.EXPIRED : status;
  const { label: timeLabel2, urgent } = timeLabel(timeRemaining);

  const statusConfig = {
    [NegotiationStatus.PENDING]: { label: 'Pending seller', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    [NegotiationStatus.ACCEPTED]: { label: 'Agreed', cls: 'bg-green-50 text-green-700 border-green-200' },
    [NegotiationStatus.REJECTED]: { label: 'Declined', cls: 'bg-red-50 text-red-700 border-red-200' },
    [NegotiationStatus.EXPIRED]: { label: 'Expired', cls: 'bg-muted text-muted-foreground border-border' },
    [NegotiationStatus.COUNTERED]: { label: 'Countered', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  };

  const cfg = statusConfig[effectiveStatus];

  // who needs to act?
  const needsAction =
    !isExpired &&
    status === NegotiationStatus.PENDING &&
    ((userType === 'seller' && negotiation.canSellerRespond) ||
      (userType === 'buyer' && negotiation.canBuyerRespond));

  return (
    <div className={cn(
      'bg-card border rounded-2xl p-5 space-y-4 hover:shadow-sm transition-all',
      needsAction ? 'border-primary/30' : 'border-border'
    )}>

      {/* header */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 flex items-center justify-center">
          {product.image
            ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-lg font-bold text-muted-foreground">
              {product.name.substring(0, 2).toUpperCase()}
            </span>}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[14px] text-foreground truncate">{product.name}</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {order.quantity} {product.measurementUnit}
          </p>
          <span className={cn('inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.cls)}>
            {cfg.label}
          </span>
        </div>
        {!isExpired && status !== NegotiationStatus.ACCEPTED && (
          <div className={cn('text-right shrink-0', urgent ? 'text-red-500' : 'text-muted-foreground')}>
            <Clock size={12} className="inline mb-0.5" />
            <p className="text-[11px] font-medium">{timeLabel2}</p>
          </div>
        )}
      </div>

      {/* price info */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Listed</p>
          <p className="text-[13px] line-through text-muted-foreground">{fmt(product.unitPrice)}</p>
        </div>
        <ArrowRight size={14} className="text-muted-foreground/40 shrink-0" />
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Proposed</p>
          <p className="text-[13px] font-semibold text-foreground">{fmt(buyerProposedPrice)}</p>
        </div>
        {agreedPrice && (
          <>
            <ArrowRight size={14} className="text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-green-600 uppercase tracking-wide mb-0.5">Agreed</p>
              <p className="text-[13px] font-semibold text-green-600">{fmt(agreedPrice)}</p>
            </div>
          </>
        )}
      </div>

      {/* needs action badge */}
      {needsAction && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <p className="text-[12px] text-primary font-medium">
            {userType === 'seller' ? 'Waiting for your response' : 'Seller has set a price — check thread'}
          </p>
        </div>
      )}

      {/* accepted — checkout prompt for buyer */}
      {status === NegotiationStatus.ACCEPTED && userType === 'buyer' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-200">
          <CheckCircle size={14} className="text-green-600 shrink-0" />
          <p className="text-[12px] text-green-700 font-medium flex-1">Price agreed — ready to checkout</p>
          <Link href="/cart" className="text-[12px] text-green-700 font-semibold underline underline-offset-2">
            Go to cart
          </Link>
        </div>
      )}

      {/* view thread link */}
      <Link
        href={`/negotiations/${negotiation.id}`}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors text-[12px] font-medium text-muted-foreground hover:text-foreground group"
      >
        Open negotiation
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
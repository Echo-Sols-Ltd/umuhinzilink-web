'use client';

import React from 'react';
import Link from 'next/link';
import { CartItem, NegotiationStatus } from '@/types';
import { MessageCircle, ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NegotiationStatusBadge } from './NegotiationStatusBadge';

interface CartNegotiationLinkProps {
  cartItem: CartItem;
  className?: string;
  showStatus?: boolean;
  compact?: boolean;
}

export const CartNegotiationLink: React.FC<CartNegotiationLinkProps> = ({
  cartItem,
  className,
  showStatus = true,
  compact = false
}) => {
  const isNegotiationItem = cartItem.type === 'NEGOTIATION_PENDING' || cartItem.type === 'NEGOTIATION_ACCEPTED';
  
  if (!isNegotiationItem || !cartItem.negotiationId) {
    return null;
  }

  const isExpired = !!(cartItem.negotiationExpiresAt && new Date(cartItem.negotiationExpiresAt) < new Date());
  
  const getTimeRemaining = () => {
    if (!cartItem.negotiationExpiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(cartItem.negotiationExpiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
  };

  const timeRemaining = getTimeRemaining();
  const isUrgent = !!(timeRemaining && !isExpired && timeRemaining.includes('h') && parseInt(timeRemaining) < 3);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Status Badge */}
      {showStatus && (
        <div className="flex items-center justify-between">
          <NegotiationStatusBadge
            status={cartItem.type === 'NEGOTIATION_ACCEPTED' ? NegotiationStatus.ACCEPTED : NegotiationStatus.PENDING}
            isExpired={isExpired}
            size="sm"
          />
          {timeRemaining && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              isUrgent ? 'text-red-500' : 'text-muted-foreground'
            )}>
              <Clock size={10} />
              <span className="font-medium">{timeRemaining}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Link */}
      <Link
        href={`/negotiations/${cartItem.negotiationId}`}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors',
          compact && 'text-xs'
        )}
      >
        <MessageCircle size={compact ? 12 : 14} />
        <span>View Negotiation</span>
        <ExternalLink size={compact ? 10 : 12} className="shrink-0" />
      </Link>

      {/* Price Comparison */}
      {!compact && cartItem.proposedPrice && cartItem.unitPrice !== cartItem.proposedPrice && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Listed: RWF {cartItem.unitPrice.toLocaleString()}</span>
          <span>→</span>
          <span className="font-medium text-foreground">
            Proposed: RWF {cartItem.proposedPrice.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

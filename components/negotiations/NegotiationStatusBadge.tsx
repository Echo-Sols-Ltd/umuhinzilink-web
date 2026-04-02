'use client';

import React from 'react';
import { NegotiationStatus } from '@/types';
import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NegotiationStatusBadgeProps {
  status: NegotiationStatus;
  isExpired?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const NegotiationStatusBadge: React.FC<NegotiationStatusBadgeProps> = ({
  status,
  isExpired = false,
  size = 'md',
  showIcon = true,
  className
}) => {
  const effectiveStatus = isExpired ? NegotiationStatus.EXPIRED : status;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  // Handle undefined/null status
  if (!effectiveStatus) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border font-medium transition-colors',
          sizeClasses[size],
          'bg-muted text-muted-foreground border-border',
          className
        )}
        title="Status not available"
      >
        {showIcon && <AlertCircle size={iconSizes[size]} className="shrink-0" />}
        <span>No Status</span>
      </div>
    );
  }

  // Debug log to identify what status is being passed
  if (process.env.NODE_ENV === 'development') {
    console.log('NegotiationStatusBadge:', { status, isExpired, effectiveStatus });
  }

  const statusConfig = {
    [NegotiationStatus.PENDING]: {
      label: 'Pending seller',
      color: 'amber',
      icon: Clock,
      description: 'Waiting for seller response'
    },
    [NegotiationStatus.COUNTERED]: {
      label: 'Countered',
      color: 'blue',
      icon: TrendingUp,
      description: 'Seller has made a counter offer'
    },
    [NegotiationStatus.ACCEPTED]: {
      label: 'Agreed',
      color: 'green',
      icon: CheckCircle,
      description: 'Price agreed - ready for checkout'
    },
    [NegotiationStatus.REJECTED]: {
      label: 'Declined',
      color: 'red',
      icon: XCircle,
      description: 'Negotiation was declined'
    },
    [NegotiationStatus.EXPIRED]: {
      label: 'Expired',
      color: 'gray',
      icon: AlertCircle,
      description: 'Negotiation time limit expired'
    }
  };

  const config = statusConfig[effectiveStatus];
  
  // Fallback for unknown status
  if (!config) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border font-medium transition-colors',
          sizeClasses[size],
          'bg-muted text-muted-foreground border-border',
          className
        )}
        title="Unknown status"
      >
        {showIcon && <AlertCircle size={iconSizes[size]} className="shrink-0" />}
        <span>Unknown</span>
      </div>
    );
  }

  const Icon = config.icon;

  const colorClasses = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium transition-colors',
        sizeClasses[size],
        colorClasses[config.color as keyof typeof colorClasses],
        className
      )}
      title={config.description}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{config.label}</span>
    </div>
  );
};

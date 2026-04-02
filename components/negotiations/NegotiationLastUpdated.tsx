'use client';

import React from 'react';
import { Clock, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNegotiation } from '@/contexts/NegotiationContext';

interface NegotiationLastUpdatedProps {
  className?: string;
  compact?: boolean;
}

export const NegotiationLastUpdated: React.FC<NegotiationLastUpdatedProps> = ({
  className,
  compact = false
}) => {
  const { isConnected, lastUpdated, refreshNegotiations, loading } = useNegotiation();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleManualRefresh = () => {
    refreshNegotiations();
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
        <Clock size={10} />
        <span>Updated {formatTimeAgo(lastUpdated)}</span>
        {!isConnected && <WifiOff size={10} className="text-amber-500" />}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg border bg-card',
      !isConnected && 'border-amber-200 bg-amber-50',
      className
    )}>
      <div className="flex items-center gap-2">
        <Clock size={14} className={cn(
          'text-muted-foreground',
          !isConnected && 'text-amber-600'
        )} />
        <div>
          <p className="text-sm font-medium text-foreground">
            {isConnected ? 'Live updates' : 'Connection lost'}
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated {formatTimeAgo(lastUpdated)}
            {!isConnected && ' • Refreshing every 30s'}
          </p>
        </div>
      </div>

      <button
        onClick={handleManualRefresh}
        disabled={loading}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-accent text-muted-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          !isConnected && 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        )}
        title="Refresh negotiations"
      >
        <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
      </button>
    </div>
  );
};

'use client';

import React from 'react';
import { TrendingDown, TrendingUp } from '@/lib/icons';
import { cn } from '@/lib/utils';

type ChangeType = 'positive' | 'negative' | 'neutral';

type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
}>;

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: IconComponent;
  iconClassName?: string;
  change?: string;
  changeType?: ChangeType;
  format?: 'number' | 'currency' | 'raw';
  hint?: string;
  variant?: 'default' | 'minimal' | 'featured';
  className?: string;
}

function formatValue(value: string | number, format: AdminStatCardProps['format']): string {
  if (format === 'raw' || typeof value === 'string') return String(value);

  if (format === 'currency') {
    return `${new Intl.NumberFormat('rw-RW').format(value)} RWF`;
  }

  return new Intl.NumberFormat('rw-RW').format(value);
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  iconClassName = 'bg-primary/10 text-primary',
  change,
  changeType = 'neutral',
  format = 'raw',
  hint,
  variant = 'default',
  className,
}: AdminStatCardProps) {
  const displayValue = formatValue(value, format);

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'rounded-lg border border-border/60 bg-card px-4 py-3.5',
          className,
        )}
      >
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-foreground">{displayValue}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        {change && (
          <p
            className={cn(
              'mt-1 text-xs',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground',
            )}
          >
            {change}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/20',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {Icon && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                iconClassName,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{displayValue}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {change && (
            <div className="flex items-center gap-1 pt-0.5">
              {changeType === 'positive' ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              ) : null}
              <span
                className={cn(
                  'text-xs font-medium',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground',
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border/80 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="truncate text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-[1.65rem]">
            {displayValue}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {change && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 shrink-0 text-success" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-4 w-4 shrink-0 text-destructive" />
              ) : null}
              <span
                className={cn(
                  'text-sm font-medium',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground',
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

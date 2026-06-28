'use client';

import { Sprout, Loader2 } from '@/lib/icons';
import { cn } from '@/lib/utils';

type PageLoadingVariant = 'fullscreen' | 'section' | 'inline';

interface PageLoadingProps {
  label?: string;
  description?: string;
  className?: string;
  /** @deprecated Use variant="fullscreen" instead */
  fullScreen?: boolean;
  withNavbarOffset?: boolean;
  variant?: PageLoadingVariant;
}

export default function PageLoading({
  label = 'Loading',
  description,
  className,
  fullScreen = true,
  withNavbarOffset = false,
  variant,
}: PageLoadingProps) {
  const resolvedVariant: PageLoadingVariant =
    variant ?? (fullScreen ? 'fullscreen' : 'section');

  const containerClass = {
    fullscreen: 'min-h-screen',
    section: 'py-24',
    inline: 'py-12',
  }[resolvedVariant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4',
        containerClass,
        withNavbarOffset && 'pt-20',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 flex items-center justify-center shadow-sm">
          <Sprout size={28} className="text-green-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border border-border flex items-center justify-center shadow-sm">
          <Loader2 size={14} className="animate-spin text-green-600" />
        </div>
      </div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs">{description}</p>
      )}
    </div>
  );
}

interface DashboardSkeletonProps {
  cards?: number;
  className?: string;
}

export function DashboardSkeleton({ cards = 4, className }: DashboardSkeletonProps) {
  return (
    <div className={cn('space-y-8 animate-in fade-in duration-300', className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-5">
            <div className="mb-4 h-10 w-10 rounded-lg bg-muted" />
            <div className="mb-2 h-3 w-2/3 rounded bg-muted" />
            <div className="h-7 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-[360px] animate-pulse rounded-xl border border-border bg-card" />
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({ count = 6, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
          <div className="h-40 bg-muted" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-5 bg-muted rounded w-1/3 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

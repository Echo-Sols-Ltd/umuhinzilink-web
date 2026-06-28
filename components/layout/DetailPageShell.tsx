'use client';

import Link from 'next/link';
import { ArrowLeft } from '@/lib/icons';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DetailPageShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export function ContentCard({
  children,
  className,
  padding = 'p-6',
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-sm',
        padding,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function DetailPageShell({
  children,
  breadcrumbs = [],
  backHref,
  onBack,
  backLabel = 'Back',
  actions,
  maxWidth = 'max-w-6xl',
  className,
}: DetailPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border">
        <div className={cn(maxWidth, 'mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4')}>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 flex-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
                {index > 0 && <span className="text-muted-foreground/60">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors truncate max-w-[140px] sm:max-w-none"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium truncate max-w-[160px] sm:max-w-xs">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {backHref ? (
              <Link
                href={backHref}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={13} />
                {backLabel}
              </Link>
            ) : onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={13} />
                {backLabel}
              </button>
            ) : null}
            {actions}
          </div>
        </div>
      </div>
      <main className={cn(maxWidth, 'mx-auto px-4 sm:px-6 py-6 pb-16 space-y-5', className)}>
        {children}
      </main>
    </div>
  );
}

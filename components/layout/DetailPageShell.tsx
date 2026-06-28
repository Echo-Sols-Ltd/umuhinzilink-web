'use client';

import Link from 'next/link';
import { ArrowLeft } from '@/lib/icons';
import Navbar from '@/components/Navbar';
import PortalShell from '@/components/layout/PortalShell';
import ParticipantGuard from '@/contexts/guard/ParticipantGuard';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';

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
  footer?: React.ReactNode;
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

function DetailToolbar({
  breadcrumbs,
  backHref,
  onBack,
  backLabel,
  actions,
  maxWidth,
}: Pick<
  DetailPageShellProps,
  'breadcrumbs' | 'backHref' | 'onBack' | 'backLabel' | 'actions' | 'maxWidth'
>) {
  return (
    <div className="sticky top-0 z-30 shrink-0 border-b border-border bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
      <div className={cn(maxWidth, 'mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-4 w-full')}>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 flex-1">
          {breadcrumbs?.map((crumb, index) => (
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
  );
}

export default function DetailPageShell({
  children,
  breadcrumbs = [],
  backHref,
  onBack,
  backLabel,
  actions,
  footer,
  maxWidth = 'max-w-6xl',
  className,
}: DetailPageShellProps) {
  const { user, loading } = useAuth();
  const hasToolbar = breadcrumbs.length > 0 || backHref || onBack || actions;

  if (user) {
    return (
      <PortalShell>
        <ParticipantGuard>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {hasToolbar && (
              <DetailToolbar
                breadcrumbs={breadcrumbs}
                backHref={backHref}
                onBack={onBack}
                backLabel={backLabel}
                actions={actions}
                maxWidth={maxWidth}
              />
            )}
            <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <main
                className={cn(
                  'mx-auto w-full space-y-5 px-4 py-6 sm:px-6',
                  maxWidth,
                  className,
                )}
              >
                {children}
              </main>
            </div>
            {footer && (
              <div className="shrink-0 border-t border-border bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
                <div className={cn('mx-auto w-full px-4 py-3 sm:px-6', maxWidth)}>
                  {footer}
                </div>
              </div>
            )}
          </div>
        </ParticipantGuard>
      </PortalShell>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {!loading && <Navbar />}
      {hasToolbar && (
        <div className={cn('sticky z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border', !loading && 'top-16')}>
          <DetailToolbar
            breadcrumbs={breadcrumbs}
            backHref={backHref}
            onBack={onBack}
            backLabel={backLabel}
            actions={actions}
            maxWidth={maxWidth}
          />
        </div>
      )}
      <main className={cn(maxWidth, 'mx-auto px-4 sm:px-6 py-6 pb-16 space-y-5', !loading && !hasToolbar && 'pt-20', className)}>
        {children}
      </main>
    </div>
  );
}

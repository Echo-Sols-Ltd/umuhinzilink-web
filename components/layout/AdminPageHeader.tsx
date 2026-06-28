'use client';

import Link from 'next/link';
import { ChevronLeft } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

export default function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
  toolbar,
  className,
}: AdminPageHeaderProps) {
  return (
    <header className={cn('bg-card/90 backdrop-blur-md border-b border-border shrink-0', className)}>
      <div className="px-4 sm:px-6 py-4 space-y-4">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={14} />
            {backLabel}
          </Link>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>
          )}
        </div>

        {toolbar && <div>{toolbar}</div>}
      </div>
    </header>
  );
}

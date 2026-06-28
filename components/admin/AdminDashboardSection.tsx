'use client';

import { cn } from '@/lib/utils';

interface AdminDashboardSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function AdminDashboardSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: AdminDashboardSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

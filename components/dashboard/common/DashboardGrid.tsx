'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export default function DashboardGrid({ children, className, cols = 3 }: DashboardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[cols],
      className
    )}>
      {children}
    </div>
  );
}

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export function DashboardSection({ title, children, className, cols = 3 }: DashboardSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <DashboardGrid cols={cols}>
        {children}
      </DashboardGrid>
    </div>
  );
}

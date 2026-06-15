'use client';

import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  mainClassName?: string;
}

export default function AppLayout({
  children,
  maxWidth = 'max-w-5xl',
  className,
  mainClassName,
}: AppLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', className)}>
      <Navbar />
      <main className={cn(maxWidth, 'mx-auto px-4 py-6 pt-20 space-y-5', mainClassName)}>
        {children}
      </main>
    </div>
  );
}

'use client';

import Navbar from '@/components/Navbar';
import PortalShell from '@/components/layout/PortalShell';
import ParticipantGuard from '@/contexts/guard/ParticipantGuard';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, loading } = useAuth();

  if (user) {
    return (
      <PortalShell>
        <ParticipantGuard>
          <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <main
              className={cn(
                'mx-auto w-full space-y-5 p-4 sm:p-6',
                maxWidth,
                mainClassName,
              )}
            >
              {children}
            </main>
          </div>
        </ParticipantGuard>
      </PortalShell>
    );
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950', className)}>
      {!loading && <Navbar />}
      <main
        className={cn(
          maxWidth,
          'mx-auto px-4 py-6 pb-16 space-y-5',
          !loading && 'pt-20',
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}

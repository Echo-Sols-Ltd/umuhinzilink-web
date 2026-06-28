'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import PageLoading from '@/components/layout/PageLoading';
import { getAdminRedirectForRoute, isParticipantMarketplaceRoute } from '@/lib/routes';

interface ParticipantGuardProps {
  children: React.ReactNode;
}

/** Keeps admins out of buyer/seller marketplace flows — they oversee via /admin/*. */
export default function ParticipantGuard({ children }: ParticipantGuardProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdminOnParticipantRoute =
    user?.role === UserRole.ADMIN && isParticipantMarketplaceRoute(pathname);

  useEffect(() => {
    if (loading || !isAdminOnParticipantRoute) return;
    router.replace(getAdminRedirectForRoute(pathname));
  }, [loading, isAdminOnParticipantRoute, pathname, router]);

  if (loading) {
    return null;
  }

  if (isAdminOnParticipantRoute) {
    return (
      <PageLoading
        label="Redirecting to admin portal"
        description="Admins manage the platform from the admin dashboard."
      />
    );
  }

  return <>{children}</>;
}

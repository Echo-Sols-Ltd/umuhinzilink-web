'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getPostAuthRouteFromWindow } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !isAuthenticated || !user) return;
    router.replace(getPostAuthRouteFromWindow(user.role));
  }, [isAuthenticated, user, loading, router]);

  return <>{children}</>;
}

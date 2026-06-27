'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncLocaleFromProfile } from '@/lib/localeUser';

/** Keeps UI locale aligned with the logged-in user's profile language. */
export default function LocaleSync() {
  const { user, isAuthenticated } = useAuth();
  const syncedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.language) {
      syncedForUser.current = null;
      return;
    }

    if (syncedForUser.current === user.id) return;
    syncedForUser.current = user.id;
    syncLocaleFromProfile(user.language);
  }, [isAuthenticated, user?.id, user?.language]);

  return null;
}

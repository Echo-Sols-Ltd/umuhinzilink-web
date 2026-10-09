'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { syncLocaleFromProfile } from '@/lib/localeUser';

/** Keeps UI locale aligned with the logged-in user's profile language. */
export default function LocaleSync() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.language) return;
    syncLocaleFromProfile(user.language);
  }, [isAuthenticated, user?.language]);

  return null;
}

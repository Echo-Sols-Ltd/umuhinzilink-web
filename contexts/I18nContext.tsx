'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLocale, translate, type SupportedLocale } from '@/lib/i18n';
import {
  getStoredLocale,
  LOCALE_CHANGE_EVENT,
  registerLocaleChangeListener,
  setStoredLocale,
} from '@/lib/language-switch';

type I18nContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const initial = getStoredLocale();
    setLocaleState(initial);
    return registerLocaleChangeListener(setLocaleState);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    setStoredLocale(locale);
  }, [locale]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ locale?: SupportedLocale }>;
      const next = custom.detail?.locale;
      if (next) setLocaleState(next);
    };
    if (typeof window === 'undefined') return;
    window.addEventListener(LOCALE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, handler);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale: setLocaleState,
      t: (key, vars) => translate(locale, key, vars),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}


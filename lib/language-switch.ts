import { defaultLocale, isSupportedLocale, type SupportedLocale } from '@/lib/i18n';

export const LOCALE_STORAGE_KEY = 'umuhinzilink.locale';
export const LOCALE_CHANGE_EVENT = 'umuhinzilink:locale-change';

type LocaleListener = (locale: SupportedLocale) => void;

let localeChangeListener: LocaleListener | null = null;

/** Direct hook for I18nProvider — more reliable than DOM events alone. */
export function registerLocaleChangeListener(listener: LocaleListener): () => void {
  localeChangeListener = listener;
  return () => {
    if (localeChangeListener === listener) {
      localeChangeListener = null;
    }
  };
}

export function getStoredLocale(): SupportedLocale {
  if (typeof window === 'undefined') return defaultLocale;
  const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY) ?? '';
  return isSupportedLocale(raw) ? raw : defaultLocale;
}

export function setStoredLocale(locale: SupportedLocale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function switchLanguage(locale: SupportedLocale) {
  if (typeof window === 'undefined') return;
  setStoredLocale(locale);
  localeChangeListener?.(locale);
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: { locale } }));
}


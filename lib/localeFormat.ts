import type { SupportedLocale } from '@/lib/i18n';

/** BCP 47 tags for Intl formatters */
export const INTL_LOCALE: Record<SupportedLocale, string> = {
  en: 'en-RW',
  rw: 'rw-RW',
  fr: 'fr-RW',
};

/** Locale sent to the AI backend */
export function toAiLocale(locale: SupportedLocale): 'en' | 'rw' | 'fr' {
  if (locale === 'rw') return 'rw';
  if (locale === 'fr') return 'fr';
  return 'en';
}

export function formatCurrency(amount: number, locale: SupportedLocale): string {
  const formatted = new Intl.NumberFormat(INTL_LOCALE[locale]).format(amount);
  return `${formatted} RWF`;
}

export function formatDate(
  value: string | Date,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(INTL_LOCALE[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatNumber(value: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}

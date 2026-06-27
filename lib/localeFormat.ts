import type { SupportedLocale } from '@/lib/i18n';

const LOCALE_TAG: Record<SupportedLocale, string> = {
  en: 'en-RW',
  rw: 'rw-RW',
};

export function formatCurrency(amount: number, locale: SupportedLocale): string {
  const formatted = new Intl.NumberFormat(LOCALE_TAG[locale]).format(amount);
  return `${formatted} RWF`;
}

export function formatDate(
  value: string | Date,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(LOCALE_TAG[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatNumber(value: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale]).format(value);
}

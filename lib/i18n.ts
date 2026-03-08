import en from '@/locales/en.json';
import rw from '@/locales/rw.json';

export const supportedLocales = ['en', 'rw'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = 'en';

type Dict = Record<string, unknown>;

const resources: Record<SupportedLocale, Dict> = {
  en: en as Dict,
  rw: rw as Dict,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getByPath(dict: Dict, key: string): unknown {
  const parts = key.split('.').filter(Boolean);
  let cur: unknown = dict;
  for (const part of parts) {
    if (!isRecord(cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, varName: string) => {
    const value = vars[varName];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function translate(locale: SupportedLocale, key: string, vars?: Record<string, string | number>): string {
  const inLocale = getByPath(resources[locale], key);
  if (typeof inLocale === 'string') return interpolate(inLocale, vars);

  const inDefault = getByPath(resources[defaultLocale], key);
  if (typeof inDefault === 'string') return interpolate(inDefault, vars);

  return key;
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(value);
}

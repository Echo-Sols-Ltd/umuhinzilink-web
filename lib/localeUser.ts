import type { SupportedLocale } from '@/lib/i18n';
import { switchLanguage } from '@/lib/language-switch';
import { userService } from '@/services/users';
import { Language } from '@/types';

export function languageToLocale(language?: Language | string | null): SupportedLocale {
  switch (language) {
    case Language.KINYARWANDA:
    case 'KINYARWANDA':
      return 'rw';
    case Language.FRENCH:
    case 'FRENCH':
      return 'fr';
    case Language.ENGLISH:
    case 'ENGLISH':
    default:
      return 'en';
  }
}

export function localeToLanguage(locale: SupportedLocale): Language {
  switch (locale) {
    case 'rw':
      return Language.KINYARWANDA;
    case 'fr':
      return Language.FRENCH;
    default:
      return Language.ENGLISH;
  }
}

/** Apply UI locale and optionally persist to the user profile. */
export async function applyLocale(
  locale: SupportedLocale,
  options?: { userId?: string; persist?: boolean },
): Promise<void> {
  switchLanguage(locale);

  if (options?.persist && options.userId) {
    await userService.updateProfile(options.userId, {
      language: localeToLanguage(locale),
    });
  }
}

export function syncLocaleFromProfile(language?: Language | string | null): void {
  switchLanguage(languageToLocale(language));
}

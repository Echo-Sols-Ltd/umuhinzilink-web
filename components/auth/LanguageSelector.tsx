'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from '@/lib/icons';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { applyLocale } from '@/lib/localeUser';
import type { SupportedLocale } from '@/lib/i18n';

const languages: { code: SupportedLocale; nameKey: string; flag: string }[] = [
  { code: 'en', nameKey: 'settings.localization.options.language.en', flag: '🇺🇸' },
  { code: 'rw', nameKey: 'settings.localization.options.language.rw', flag: '🇷🇼' },
  { code: 'fr', nameKey: 'settings.localization.options.language.fr', flag: '🇫🇷' },
];

export default function LanguageSelector() {
  const { locale, t } = useI18n();
  const { user, loadAuthState } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = async (langCode: SupportedLocale) => {
    if (langCode === locale || saving) return;
    setSaving(true);
    try {
      await applyLocale(langCode, user ? { userId: user.id, persist: true } : undefined);
      if (user) await loadAuthState();
    } finally {
      setSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={saving}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage.flag} {t(currentLanguage.nameKey)}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${
                  lang.code === locale ? 'bg-muted text-foreground' : 'text-muted-foreground'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{t(lang.nameKey)}</span>
                {lang.code === locale && (
                  <span className="ml-auto text-success">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

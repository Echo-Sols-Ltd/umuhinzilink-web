'use client';

import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import { switchLanguage } from '@/lib/language-switch';
import {
  Save,
  Clock,
  Calendar,
  DollarSign,
  Languages
} from '@/lib/icons';

export default function LocalizationSettingsPage() {
  const { t, locale } = useI18n();
  const { user, loadAuthState } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.language) {
      const profileLocale = languageToLocale(user.language);
      if (profileLocale !== locale) {
        applyLocale(profileLocale);
      }
    }
  }, [user?.language, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = async (nextLocale: SupportedLocale) => {
    if (nextLocale === locale || saving) return;

    setSaving(true);
    try {
      await applyLocale(nextLocale, user ? { userId: user.id, persist: true } : undefined);
      if (user) {
        await loadAuthState();
      }
      notify.success(t('settings.localization.saved'), t('common.saved'));
    } catch {
      notify.error(t('settings.localization.saveFailed'), t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsSubLayout
      title={t('settings.localization.pageTitle')}
      description={t('settings.localization.pageDescription')}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t('settings.localization.sections.languagePreferences')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('settings.localization.helperText.language')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGE_OPTIONS.map(({ locale: code, labelKey, flag }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                disabled={saving}
                onClick={() => handleLanguageChange(code)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-muted/30 border-border text-foreground hover:border-green-500/50'
                } disabled:opacity-50`}
              >
                <span>{flag}</span>
                <span>{t(labelKey)}</span>
              </button>
            );
          })}
        </div>

        {user && (
          <p className="text-xs text-muted-foreground mt-4">
            {t('settings.localization.profileSync', {
              language: t(
                LANGUAGE_OPTIONS.find(o => o.locale === locale)?.labelKey
                  ?? 'settings.localization.options.language.en',
              ),
            })}
          </p>
        )}
      </div>
    </SettingsSubLayout>
  );
}

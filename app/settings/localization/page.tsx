'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import { switchLanguage } from '@/lib/language-switch';
import {
  Save,
  Clock,
  Calendar,
  DollarSign,
  Languages
} from 'lucide-react';

export default function LocalizationSettingsPage() {
  const { t } = useI18n();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [localization, setLocalization] = useState({
    language: 'English',
    currency: 'RWF',
    timezone: 'Africa/Kigali',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    number_format: 'comma_decimal'
  });

  const handleChange = (key: keyof typeof localization, value: string) => {
    setLocalization(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'language') {
      if (value === 'English') switchLanguage('en');
      if (value === 'Kinyarwanda') switchLanguage('rw');
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const localizationOptions = {
    language: [
      { value: 'English', labelKey: 'settings.localization.options.language.en', flag: '🇺🇸' },
      { value: 'Kinyarwanda', labelKey: 'settings.localization.options.language.rw', flag: '🇷🇼' },
      { value: 'French', labelKey: 'settings.localization.options.language.fr', flag: '🇫🇷' }
    ],
    currency: [
      { value: 'RWF', labelKey: 'settings.localization.options.currency.rwf', symbol: '₣' },
      { value: 'USD', labelKey: 'settings.localization.options.currency.usd', symbol: '$' },
      { value: 'EUR', labelKey: 'settings.localization.options.currency.eur', symbol: '€' }
    ],
    timezone: [
      { value: 'Africa/Kigali', labelKey: 'settings.localization.options.timezone.kigali', offset: '+02:00' },
      { value: 'Africa/Nairobi', labelKey: 'settings.localization.options.timezone.nairobi', offset: '+03:00' },
      { value: 'UTC', labelKey: 'settings.localization.options.timezone.utc', offset: '+00:00' }
    ],
    date_format: [
      { value: 'DD/MM/YYYY', labelKey: 'settings.localization.options.dateFormat.ddmmyyyy', example: '31/12/2024' },
      { value: 'MM/DD/YYYY', labelKey: 'settings.localization.options.dateFormat.mmddyyyy', example: '12/31/2024' },
      { value: 'YYYY-MM-DD', labelKey: 'settings.localization.options.dateFormat.yyyymmdd', example: '2024-12-31' }
    ],
    time_format: [
      { value: '24h', labelKey: 'settings.localization.options.timeFormat.h24', example: '14:30' },
      { value: '12h', labelKey: 'settings.localization.options.timeFormat.h12', example: '2:30 PM' }
    ],
    number_format: [
      { value: 'comma_decimal', labelKey: 'settings.localization.options.numberFormat.commaDecimal', example: '1,234.56' },
      { value: 'dot_comma', labelKey: 'settings.localization.options.numberFormat.dotComma', example: '1.234,56' },
      { value: 'space_comma', labelKey: 'settings.localization.options.numberFormat.spaceComma', example: '1 234,56' }
    ]
  };

  return (
    <SettingsSubLayout
      title={t('settings.localization.pageTitle')}
      description={t('settings.localization.pageDescription')}
    >
      <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Languages className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.localization.sections.languagePreferences')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.displayLanguage')}
                  </label>
                  <select
                    value={localization.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.language.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.flag} {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.language')}
                  </p>
                </div>
              </div>
            </div>

            {/* Currency Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.localization.sections.currencyAndNumbers')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.defaultCurrency')}
                  </label>
                  <select
                    value={localization.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.currency.map(option => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.currency')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.numberFormat')}
                  </label>
                  <select
                    value={localization.number_format}
                    onChange={(e) => handleChange('number_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.number_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.numberFormatExample', {
                      example: localizationOptions.number_format.find(opt => opt.value === localization.number_format)?.example ?? ''
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Time & Date Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.localization.sections.timeAndDate')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.timeZone')}
                  </label>
                  <select
                    value={localization.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.timezone.map(option => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.timeZoneOffset', {
                      offset: localizationOptions.timezone.find(opt => opt.value === localization.timezone)?.offset ?? ''
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.timeFormat')}
                  </label>
                  <select
                    value={localization.time_format}
                    onChange={(e) => handleChange('time_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.time_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.timeFormatExample', {
                      example: localizationOptions.time_format.find(opt => opt.value === localization.time_format)?.example ?? ''
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.localization.labels.dateFormat')}
                  </label>
                  <select
                    value={localization.date_format}
                    onChange={(e) => handleChange('date_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.date_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.localization.helperText.dateFormatExample', {
                      example: localizationOptions.date_format.find(opt => opt.value === localization.date_format)?.example ?? ''
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('common.preview')}</h2>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('settings.localization.preview.samplePrice')}</span>
                  <span className="font-mono">1,234.56 RWF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('settings.localization.preview.sampleDate')}</span>
                  <span className="font-mono">31/12/2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('settings.localization.preview.sampleTime')}</span>
                  <span className="font-mono">14:30</span>
                </div>
              </div>
            </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('common.saving')}
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  {t('common.saved')}
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✗</span>
                  {t('common.error')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.saveChanges')}
                </>
              )}
            </button>
          </div>
      </div>
    </SettingsSubLayout>
  );
}

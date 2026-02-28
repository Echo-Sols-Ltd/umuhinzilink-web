'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import {
  Globe,
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  DollarSign,
  Languages
} from 'lucide-react';

export default function LocalizationSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
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
      { value: 'English', label: 'English', flag: '🇺🇸' },
      { value: 'Kinyarwanda', label: 'Kinyarwanda', flag: '🇷🇼' },
      { value: 'French', label: 'Français', flag: '🇫🇷' }
    ],
    currency: [
      { value: 'RWF', label: 'Rwandan Franc (RWF)', symbol: '₣' },
      { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
      { value: 'EUR', label: 'Euro (EUR)', symbol: '€' }
    ],
    timezone: [
      { value: 'Africa/Kigali', label: 'Kigali (GMT+2)', offset: '+02:00' },
      { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)', offset: '+03:00' },
      { value: 'UTC', label: 'UTC (GMT+0)', offset: '+00:00' }
    ],
    date_format: [
      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)', example: '31/12/2024' },
      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)', example: '12/31/2024' },
      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)', example: '2024-12-31' }
    ],
    time_format: [
      { value: '24h', label: '24-hour (14:30)', example: '14:30' },
      { value: '12h', label: '12-hour (2:30 PM)', example: '2:30 PM' }
    ],
    number_format: [
      { value: 'comma_decimal', label: '1,234.56 (Comma decimal)', example: '1,234.56' },
      { value: 'dot_comma', label: '1.234,56 (Dot comma)', example: '1.234,56' },
      { value: 'space_comma', label: '1 234,56 (Space comma)', example: '1 234,56' }
    ]
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserType} activeItem="Settings" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Settings</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Language & Region</h1>
              <p className="text-muted-foreground mt-1">Adjust platform language and regional preferences</p>
            </div>
          </div>

          {/* Localization Settings */}
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Languages className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Language Preferences</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Language
                  </label>
                  <select
                    value={localization.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.language.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.flag} {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This will change the language used throughout the platform
                  </p>
                </div>
              </div>
            </div>

            {/* Currency Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Currency & Numbers</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Default Currency
                  </label>
                  <select
                    value={localization.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.currency.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for displaying prices and financial information
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number Format
                  </label>
                  <select
                    value={localization.number_format}
                    onChange={(e) => handleChange('number_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.number_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: {localizationOptions.number_format.find(opt => opt.value === localization.number_format)?.example}
                  </p>
                </div>
              </div>
            </div>

            {/* Time & Date Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Time & Date</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Zone
                  </label>
                  <select
                    value={localization.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.timezone.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current offset: {localizationOptions.timezone.find(opt => opt.value === localization.timezone)?.offset}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Format
                  </label>
                  <select
                    value={localization.time_format}
                    onChange={(e) => handleChange('time_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.time_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: {localizationOptions.time_format.find(opt => opt.value === localization.time_format)?.example}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date Format
                  </label>
                  <select
                    value={localization.date_format}
                    onChange={(e) => handleChange('date_format', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    {localizationOptions.date_format.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: {localizationOptions.date_format.find(opt => opt.value === localization.date_format)?.example}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Preview</h2>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sample Price:</span>
                  <span className="font-mono">1,234.56 RWF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sample Date:</span>
                  <span className="font-mono">31/12/2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sample Time:</span>
                  <span className="font-mono">14:30</span>
                </div>
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
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✗</span>
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

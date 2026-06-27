'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import {
  User,
  Save,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Shield,
} from 'lucide-react';

export default function AccountSettingsPage() {
  const { t } = useI18n();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [account, setAccount] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    email_notifications: true,
    profile_visibility: 'public'
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (key: keyof typeof account, value: string | boolean) => {
    setAccount(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleImageUpload = () => {
    // Handle image upload
  };

  return (
    <SettingsSubLayout
      title={t('settings.hub.sections.account.title')}
      description={t('settings.hub.sections.account.description')}
    >
      <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.account.sections.profileInformation')}</h2>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <button
                      onClick={handleImageUpload}
                      className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      {t('settings.account.changePhoto')}
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('settings.account.photoHint')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.firstName')}
                  </label>
                  <input
                    type="text"
                    value={account.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.account.placeholders.firstName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.lastName')}
                  </label>
                  <input
                    type="text"
                    value={account.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.account.placeholders.lastName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={account.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.account.placeholders.email')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={account.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.account.placeholders.phone')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.bio')}
                  </label>
                  <textarea
                    value={account.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder={t('settings.account.placeholders.bio')}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.account.sections.changePassword')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={account.current_password}
                      onChange={(e) => handleChange('current_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder={t('settings.account.placeholders.currentPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.newPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={account.new_password}
                      onChange={(e) => handleChange('new_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder={t('settings.account.placeholders.newPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.confirmNewPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={account.confirm_password}
                      onChange={(e) => handleChange('confirm_password', e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                      placeholder={t('settings.account.placeholders.confirmNewPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => handlePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <strong>{t('settings.account.passwordRequirements.title')}</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• {t('settings.account.passwordRequirements.length')}</li>
                    <li>• {t('settings.account.passwordRequirements.case')}</li>
                    <li>• {t('settings.account.passwordRequirements.number')}</li>
                    <li>• {t('settings.account.passwordRequirements.special')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.account.sections.privacyPreferences')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.account.fields.profileVisibility')}
                  </label>
                  <select
                    value={account.profile_visibility}
                    onChange={(e) => handleChange('profile_visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="public">{t('settings.account.visibility.public')}</option>
                    <option value="registered">{t('settings.account.visibility.registered')}</option>
                    <option value="private">{t('settings.account.visibility.private')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.account.emailNotifications.label')}</div>
                    <div className="text-sm text-muted-foreground">{t('settings.account.emailNotifications.description')}</div>
                  </div>
                  <button
                    onClick={() => handleChange('email_notifications', !account.email_notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      account.email_notifications ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        account.email_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

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

'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import {
  Shield,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Monitor,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock
} from '@/lib/icons';

export default function SecuritySettingsPage() {
  const { t } = useI18n();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [security, setSecurity] = useState({
    two_factor_auth: false,
    session_timeout: '30',
    login_alerts: true,
    data_sharing: false,
    profile_visibility: 'public'
  });

  const handleChange = (key: keyof typeof security, value: string | boolean) => {
    setSecurity(prev => ({
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

  const handleAction = async (action: string) => {
    switch (action) {
      case 'view_sessions':
        // Navigate to sessions page
        break;
      case 'download_data':
        // Handle data download
        break;
      case 'delete_account':
        // Handle account deletion
        break;
    }
  };

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.1',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Kigali, Rwanda',
      ip: '192.168.1.2',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on Android',
      location: 'Remera, Rwanda',
      ip: '192.168.1.3',
      lastActive: '3 days ago',
      current: false
    }
  ];

  return (
    <SettingsSubLayout
      title={t('settings.hub.sections.security.title')}
      description={t('settings.hub.sections.security.description')}
    >
      <div className="space-y-6">
            {/* Authentication Security */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.security.sections.authentication')}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.security.twoFactorAuth.label')}</div>
                    <div className="text-sm text-muted-foreground">{t('settings.security.twoFactorAuth.description')}</div>
                  </div>
                  <button
                    onClick={() => handleChange('two_factor_auth', !security.two_factor_auth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.two_factor_auth ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.two_factor_auth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.security.fields.sessionTimeout')}
                  </label>
                  <select
                    value={security.session_timeout}
                    onChange={(e) => handleChange('session_timeout', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="15">{t('settings.security.sessionTimeoutOptions.15')}</option>
                    <option value="30">{t('settings.security.sessionTimeoutOptions.30')}</option>
                    <option value="60">{t('settings.security.sessionTimeoutOptions.60')}</option>
                    <option value="120">{t('settings.security.sessionTimeoutOptions.120')}</option>
                    <option value="240">{t('settings.security.sessionTimeoutOptions.240')}</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('settings.security.sessionTimeoutHint')}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.security.loginAlerts.label')}</div>
                    <div className="text-sm text-muted-foreground">{t('settings.security.loginAlerts.description')}</div>
                  </div>
                  <button
                    onClick={() => handleChange('login_alerts', !security.login_alerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.login_alerts ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.login_alerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Monitor className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.security.sections.activeSessions')}</h2>
              </div>

              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        {session.device.includes('iPhone') || session.device.includes('Android') ? 
                          <Smartphone className="w-4 h-4 text-muted-foreground" /> :
                          <Monitor className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{session.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.location} • {session.ip}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && (
                        <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                          {t('settings.security.currentSession')}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 text-sm text-destructive hover:text-destructive/80 transition-colors">
                {t('settings.security.signOutOtherSessions')}
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.security.sections.privacy')}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('settings.security.fields.profileVisibility')}
                  </label>
                  <select
                    value={security.profile_visibility}
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
                    <div className="font-medium text-foreground">{t('settings.security.dataSharing.label')}</div>
                    <div className="text-sm text-muted-foreground">{t('settings.security.dataSharing.description')}</div>
                  </div>
                  <button
                    onClick={() => handleChange('data_sharing', !security.data_sharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.data_sharing ? 'bg-success' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                        security.data_sharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Download className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{t('settings.security.sections.dataManagement')}</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAction('download_data')}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{t('settings.security.downloadData.label')}</div>
                      <div className="text-sm text-muted-foreground">{t('settings.security.downloadData.description')}</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 text-muted-foreground">
                    →
                  </div>
                </button>

                <button
                  onClick={() => handleAction('delete_account')}
                  className="w-full flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <div>
                      <div className="font-medium text-destructive">{t('settings.security.deleteAccount.label')}</div>
                      <div className="text-sm text-muted-foreground">{t('settings.security.deleteAccount.description')}</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 text-destructive">
                    →
                  </div>
                </button>
              </div>

              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>{t('common.warning')}:</strong> {t('settings.security.deleteAccount.warning')}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('settings.security.sections.securityStatus')}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-foreground">{t('settings.security.status.strongPassword')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {security.two_factor_auth ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-sm text-foreground">
                    {security.two_factor_auth
                      ? t('settings.security.status.twoFactorEnabled')
                      : t('settings.security.status.twoFactorDisabled')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-foreground">{t('settings.security.status.noThreats')}</span>
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
                  <Shield className="w-4 h-4" />
                  {t('common.saveChanges')}
                </>
              )}
            </button>
          </div>
      </div>
    </SettingsSubLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import SettingsSubLayout from '@/components/layout/SettingsSubLayout';
import {
  Bell,
  Save,
  Mail,
  Smartphone,
  ShoppingCart,
  TrendingUp,
  Megaphone,
  Settings
} from '@/lib/icons';

export default function NotificationsSettingsPage() {
  const { t } = useI18n();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [notifications, setNotifications] = useState({
    sms_notifications: true,
    email_notifications: true,
    order_alerts: true,
    price_alerts: false,
    marketing_emails: false,
    weekly_reports: true,
    system_updates: true,
    payment_reminders: true
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
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

  const notificationCategories = [
    {
      title: t('settings.notificationSettings.categories.orderAlerts.title'),
      icon: ShoppingCart,
      items: [
        { key: 'order_alerts', label: t('settings.notificationSettings.categories.orderAlerts.orderUpdates.label'), description: t('settings.notificationSettings.categories.orderAlerts.orderUpdates.description') },
        { key: 'payment_reminders', label: t('settings.notificationSettings.categories.orderAlerts.paymentReminders.label'), description: t('settings.notificationSettings.categories.orderAlerts.paymentReminders.description') }
      ]
    },
    {
      title: t('settings.notificationSettings.categories.marketIntelligence.title'),
      icon: TrendingUp,
      items: [
        { key: 'price_alerts', label: t('settings.notificationSettings.categories.marketIntelligence.priceAlerts.label'), description: t('settings.notificationSettings.categories.marketIntelligence.priceAlerts.description') },
        { key: 'weekly_reports', label: t('settings.notificationSettings.categories.marketIntelligence.weeklyReports.label'), description: t('settings.notificationSettings.categories.marketIntelligence.weeklyReports.description') }
      ]
    },
    {
      title: t('settings.notificationSettings.categories.communicationChannels.title'),
      icon: Bell,
      items: [
        { key: 'sms_notifications', label: t('settings.smsNotifications.label'), description: t('settings.smsNotifications.description') },
        { key: 'email_notifications', label: t('settings.emailNotifications.label'), description: t('settings.emailNotifications.description') }
      ]
    },
    {
      title: t('settings.notificationSettings.categories.marketing.title'),
      icon: Megaphone,
      items: [
        { key: 'marketing_emails', label: t('settings.marketingEmails.label'), description: t('settings.marketingEmails.description') }
      ]
    },
    {
      title: t('settings.notificationSettings.categories.systemUpdates.title'),
      icon: Settings,
      items: [
        { key: 'system_updates', label: t('settings.notificationSettings.categories.systemUpdates.systemUpdates.label'), description: t('settings.notificationSettings.categories.systemUpdates.systemUpdates.description') }
      ]
    }
  ];

  return (
    <SettingsSubLayout
      title={t('settings.hub.sections.notifications.title')}
      description={t('settings.hub.sections.notifications.description')}
    >
      <div className="space-y-6">
            {notificationCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {item.key === 'sms_notifications' && <Smartphone className="w-4 h-4 text-muted-foreground" />}
                            {item.key === 'email_notifications' && <Mail className="w-4 h-4 text-muted-foreground" />}
                            <div>
                              <h3 className="font-medium text-foreground">{item.label}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggle(item.key as keyof typeof notifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications] ? 'bg-success' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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

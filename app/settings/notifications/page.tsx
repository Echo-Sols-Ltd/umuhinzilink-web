'use client';

import React, { useState } from 'react';
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
      title: "Order & Transaction Alerts",
      icon: ShoppingCart,
      items: [
        { key: 'order_alerts', label: 'Order Updates', description: 'Real-time order status changes' },
        { key: 'payment_reminders', label: 'Payment Reminders', description: 'Payment due dates and confirmations' }
      ]
    },
    {
      title: "Market & Business Intelligence",
      icon: TrendingUp,
      items: [
        { key: 'price_alerts', label: 'Market Price Alerts', description: 'Product price changes and trends' },
        { key: 'weekly_reports', label: 'Weekly Reports', description: 'Summary of your business activities' }
      ]
    },
    {
      title: "Communication Channels",
      icon: Bell,
      items: [
        { key: 'sms_notifications', label: 'SMS Notifications', description: 'Critical alerts via SMS' },
        { key: 'email_notifications', label: 'Email Notifications', description: 'Order updates and promotions' }
      ]
    },
    {
      title: "Marketing & Promotions",
      icon: Megaphone,
      items: [
        { key: 'marketing_emails', label: 'Marketing Emails', description: 'Promotions and company news' }
      ]
    },
    {
      title: "System Updates",
      icon: Settings,
      items: [
        { key: 'system_updates', label: 'System Updates', description: 'Platform maintenance and new features' }
      ]
    }
  ];

  return (
    <SettingsSubLayout
      title="Notification Preferences"
      description="Choose how you receive alerts and updates"
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
    </SettingsSubLayout>
  );
}

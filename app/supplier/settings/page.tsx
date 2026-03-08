'use client';

import Link from 'next/link';
import {
  Settings,
  User,
  Bell,
  Lock,
  Package,
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { useI18n } from '@/contexts/I18nContext';

function SupplierSettingsPageComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.SUPPLIER} activeItem="Settings" />

      <main className="flex-1 p-6 sm:p-8 h-full overflow-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">{t('settings.title')}</h1>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-success w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">{t('settings.profileSettings')}</h2>
              </div>

              {[
                { key: 'firstName', label: t('profile.fields.firstName'), placeholder: 'John', type: 'text' },
                { key: 'lastName', label: t('profile.fields.lastName'), placeholder: 'Doe', type: 'text' },
                { key: 'email', label: t('profile.fields.email'), placeholder: 'you@example.com', type: 'email' },
                { key: 'phone', label: t('profile.fields.phone'), placeholder: '+250 788 123 456', type: 'tel' },
                { key: 'district', label: t('profile.fields.district'), placeholder: 'Kigali', type: 'text' },
                { key: 'sector', label: t('profile.fields.sector'), placeholder: 'Gasabo', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-foreground">{field.label}</label>
                  <input
                    type={field.type}
                    className="mt-1 w-full border border-border px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-success/50 bg-card text-foreground"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <button className="mt-3 bg-success text-white px-4 py-2 rounded-xl hover:bg-success/90 font-bold active:scale-95 transition-all">
                {t('common.saveChanges')}
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="text-success w-5 h-5" />
                <h2 className="text-lg font-semibold text-foreground">{t('settings.changePassword')}</h2>
              </div>

              {[
                { label: t('settings.currentPassword'), id: 's-cur-pass' },
                { label: t('settings.newPassword'), id: 's-new-pass' },
                { label: t('settings.confirmNewPassword'), id: 's-con-pass' },
              ].map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-foreground">{field.label}</label>
                  <input
                    id={field.id}
                    type="password"
                    className="mt-1 w-full border border-border px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-success/50 bg-card text-foreground"
                  />
                </div>
              ))}

              <button className="mt-3 bg-success text-white px-4 py-2 rounded-xl hover:bg-success/90 font-bold active:scale-95 transition-all">
                {t('settings.updatePassword')}
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">{t('settings.appearance')}</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-foreground">{t('settings.darkMode')}</label>
                  <p className="text-sm text-muted-foreground">{t('settings.toggleTheme')}</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-card transition-transform translate-x-1" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground">{t('settings.language')}</label>
                  <p className="text-sm text-muted-foreground">{t('settings.chooseLanguage')}</p>
                </div>
                <div className="w-56">
                  <select
                    value={locale}
                    onChange={e => setLocale(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-success focus:border-success bg-card text-foreground"
                  >
                    <option value="en">English (US)</option>
                    <option value="rw">Kinyarwanda (RW)</option>
                    <option value="fr">Français (Coming soon)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">{t('settings.notifications')}</h2>
            </div>
            <div className="space-y-4">
              {[
                { labelKey: 'settings.emailNotifications.label', descKey: 'settings.emailNotifications.description', defaultChecked: true },
                { labelKey: 'settings.smsNotifications.label', descKey: 'settings.smsNotifications.description', defaultChecked: false },
                { labelKey: 'settings.orderUpdates.label', descKey: 'settings.orderUpdates.description', defaultChecked: true },
                { labelKey: 'settings.priceAlerts.label', descKey: 'settings.priceAlerts.description', defaultChecked: false },
                { labelKey: 'settings.marketingEmails.label', descKey: 'settings.marketingEmails.description', defaultChecked: false },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer group py-1">
                  <div>
                    <span className="text-foreground group-hover:text-success transition-colors font-medium text-sm">{t(item.labelKey as any)}</span>
                    <p className="text-xs text-muted-foreground">{t(item.descKey as any)}</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" defaultChecked={item.defaultChecked} />
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SupplierSettingsPage() {
  return (
    <SupplierGuard>
      <SupplierSettingsPageComponent />
    </SupplierGuard>
  );
}

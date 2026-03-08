'use client';
import Link from 'next/link';
import {
  Mail,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  User,
  Bell,
  Lock,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-success">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);


import { useI18n } from '@/contexts/I18nContext';

function BuyerSettingsPageComponent() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {

  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.BUYER}
        activeItem='Settings'
      />
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto h-full">
        <h1 className="text-2xl font-semibold text-foreground mb-6">{t('settings.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">{t('settings.profileSettings')}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.firstName')}</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.lastName')}</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.email')}</label>
              <input
                type="email"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.phone')}</label>
              <input
                type="tel"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="+250 788 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.district')}</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="Kigali"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.fields.sector')}</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
                placeholder="Gasabo"
              />
            </div>

            <button className="mt-3 bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors">
              {t('profile.actions.save')}
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">{t('settings.changePassword')}</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('settings.currentPassword')}</label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{t('settings.newPassword')}</label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                {t('settings.confirmNewPassword')}
              </label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success bg-card"
              />
            </div>

            <button className="mt-3 bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 transition-colors">
              {t('settings.updatePassword')}
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-success w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">{t('settings.appearance')}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">{t('settings.darkMode')}</label>
                <p className="text-sm text-muted-foreground">{t('settings.toggleTheme')}</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted">
                <span className="inline-block h-4 w-4 transform rounded-full bg-card transition-transform translate-x-1"></span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground">{t('settings.language')}</label>
                <p className="text-sm text-muted-foreground">{t('settings.chooseLanguage')}</p>
              </div>
              <div className="w-64">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as any)}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-success focus:border-success bg-card text-foreground"
                >
                  <option value="en">English (US)</option>
                  <option value="rw">Kinyarwanda (RW)</option>
                  <option value="fr">Français (Coming soon)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notifications */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-success w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">{t('settings.notifications')}</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="text-foreground group-hover:text-success transition-colors font-medium">{t('settings.emailNotifications.label')}</span>
                <p className="text-xs text-muted-foreground">{t('settings.emailNotifications.description')}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="text-foreground group-hover:text-success transition-colors font-medium">{t('settings.smsNotifications.label')}</span>
                <p className="text-xs text-muted-foreground">{t('settings.smsNotifications.description')}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="text-foreground group-hover:text-success transition-colors font-medium">{t('settings.orderUpdates.label')}</span>
                <p className="text-xs text-muted-foreground">{t('settings.orderUpdates.description')}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="text-foreground group-hover:text-success transition-colors font-medium">{t('settings.priceAlerts.label')}</span>
                <p className="text-xs text-muted-foreground">{t('settings.priceAlerts.description')}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="text-foreground group-hover:text-success transition-colors font-medium">{t('settings.marketingEmails.label')}</span>
                <p className="text-xs text-muted-foreground">{t('settings.marketingEmails.description')}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-border text-success focus:ring-success" />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BuyerSettingsPage() {
  return (
    <BuyerGuard>
      <BuyerSettingsPageComponent />
    </BuyerGuard>
  );
}

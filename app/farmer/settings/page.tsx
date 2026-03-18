'use client';
import Link from 'next/link';
import {
  Mail,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle,
  User,
  Bell,
  Lock,
  Settings,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FarmerPages, UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-success">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

import { useI18n } from '@/contexts/I18nContext';

function SettingsComponent() {
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = () => {
    setLogoutPending(true);
    logout();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Account Settings'
      />

      <main className="flex-1 p-6 sm:p-8 h-full overflow-auto max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('farmer.settings.title')}</h1>
          <p className="text-muted-foreground">{t('farmer.profile.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <User className="text-success w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">{t('farmer.settings.profile.title')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.profile.name')}</label>
                <input
                  type="text"
                  defaultValue={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                  placeholder={t('auth.placeholders.fullName')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.profile.email')}</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                  placeholder={t('auth.placeholders.email')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.profile.phone')}</label>
                <input
                  type="tel"
                  defaultValue={user?.phoneNumber}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                  placeholder="+250 788 123 456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.profile.district')}</label>
                  <input
                    type="text"
                    defaultValue={user?.district}
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                    placeholder={t('profile.fields.district')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.profile.sector')}</label>
                  <input
                    type="text"
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                    placeholder={t('profile.fields.sector')}
                  />
                </div>
              </div>
            </div>

            <button className="w-full mt-4 bg-success text-white font-bold py-3 rounded-xl hover:bg-success/90 transition-all shadow-md active:scale-[0.98]">
              {t('farmer.settings.profile.save')}
            </button>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <Lock className="text-info w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">{t('farmer.settings.password.title')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.password.current')}</label>
                <input
                  type="password"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">{t('farmer.settings.password.new')}</label>
                <input
                  type="password"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">
                  {t('farmer.settings.password.confirm')}
                </label>
                <input
                  type="password"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
                />
              </div>
            </div>

            <button className="w-full mt-4 bg-muted border border-border hover:bg-muted/70 text-foreground font-bold py-3 rounded-xl transition-all active:scale-[0.98]">
              {t('farmer.settings.password.update')}
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mt-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Settings className="text-warning w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">{t('farmer.settings.appearance.title')}</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <label className="block font-bold text-foreground">{t('farmer.settings.appearance.darkMode')}</label>
                <p className="text-sm text-muted-foreground">{t('farmer.settings.appearance.darkModeDesc')}</p>
              </div>
              <button className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors bg-muted border-2 border-transparent">
                <span className="inline-block h-5 w-5 transform rounded-full bg-card shadow-sm transition-transform translate-x-1"></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div>
                <label className="block font-bold text-foreground">{t('farmer.settings.appearance.language')}</label>
                <p className="text-sm text-muted-foreground">{t('farmer.settings.appearance.languageDesc')}</p>
              </div>
              <select 
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'rw')}
                className="w-40 px-3 py-2 bg-card border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success font-medium"
              >
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mt-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-info/10 rounded-lg">
              <Bell className="text-info w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">{t('farmer.settings.notifications.title')}</h2>
          </div>

          <div className="space-y-4">
            <NotificationItem 
              label={t('farmer.settings.notifications.email')} 
              description={t('farmer.settings.notifications.emailDesc')} 
              defaultChecked={true} 
            />
            <NotificationItem 
              label={t('farmer.settings.notifications.sms')} 
              description={t('farmer.settings.notifications.smsDesc')} 
            />
            <NotificationItem 
              label={t('farmer.settings.notifications.updates')} 
              description={t('farmer.settings.notifications.updatesDesc')} 
              defaultChecked={true} 
            />
            <NotificationItem 
              label={t('farmer.settings.notifications.alerts')} 
              description={t('farmer.settings.notifications.alertsDesc')} 
            />
            <NotificationItem 
              label={t('farmer.settings.notifications.marketing')} 
              description={t('farmer.settings.notifications.marketingDesc')} 
            />
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="mt-12 mb-20 flex justify-center">
          <button 
            onClick={handleLogout}
            disabled={logoutPending}
            className="flex items-center gap-2 px-8 py-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all font-bold rounded-xl active:scale-95 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            {t('common.logout')}
          </button>
        </div>
      </main>
    </div>
  );
}

function NotificationItem({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
      <div>
        <span className="font-bold text-foreground">{label}</span>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input 
        type="checkbox" 
        className="w-5 h-5 rounded border-border text-success focus:ring-success/20 cursor-pointer" 
        defaultChecked={defaultChecked} 
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <FarmerGuard>
      <SettingsComponent />
    </FarmerGuard>
  );
}
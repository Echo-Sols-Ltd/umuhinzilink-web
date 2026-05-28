'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole } from '@/types';
import {
  Settings,
  Building,
  CreditCard,
  Bell,
  Globe,
  Shield,
  ChevronRight,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Mail,
  AlertTriangle,
  User,
  Wallet
} from 'lucide-react';

// Settings Configuration
const settingsConfig = {
  "sections": [
    {
      "id": "business",
      "titleKey": "settings.hub.sections.business.title",
      "descriptionKey": "settings.hub.sections.business.description",
      "roles": ["farmer", "supplier"],
      "icon": Building,
      "href": "/settings/business",
      "color": "bg-blue-500",
      "fieldsKeys": [
        "settings.hub.sections.business.fields.businessName",
        "settings.hub.sections.business.fields.district",
        "settings.hub.sections.business.fields.sector",
        "settings.hub.sections.business.fields.gpsLocation",
        "settings.hub.sections.business.fields.farmSize",
        "settings.hub.sections.business.fields.cropTypes"
      ]
    },
    {
      "id": "payments",
      "titleKey": "settings.hub.sections.payments.title",
      "descriptionKey": "settings.hub.sections.payments.description",
      "roles": ["farmer", "supplier"],
      "icon": CreditCard,
      "href": "/settings/payments",
      "color": "bg-green-500",
      "fieldsKeys": [
        "settings.hub.sections.payments.fields.mobileMoneyProvider",
        "settings.hub.sections.payments.fields.mobileMoneyNumber",
        "settings.hub.sections.payments.fields.bankAccount"
      ]
    },
    {
      "id": "notifications",
      "titleKey": "settings.hub.sections.notifications.title",
      "descriptionKey": "settings.hub.sections.notifications.description",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Bell,
      "href": "/settings/notifications",
      "color": "bg-purple-500",
      "fieldsKeys": [
        "settings.hub.sections.notifications.fields.smsNotifications",
        "settings.hub.sections.notifications.fields.emailNotifications",
        "settings.hub.sections.notifications.fields.orderAlerts",
        "settings.hub.sections.notifications.fields.priceAlerts"
      ]
    },
    {
      "id": "localization",
      "titleKey": "settings.hub.sections.localization.title",
      "descriptionKey": "settings.hub.sections.localization.description",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Globe,
      "href": "/settings/localization",
      "color": "bg-orange-500",
      "fieldsKeys": [
        "settings.hub.sections.localization.fields.language",
        "settings.hub.sections.localization.fields.currency",
        "settings.hub.sections.localization.fields.timeZone",
        "settings.hub.sections.localization.fields.dateFormat"
      ]
    },
    {
      "id": "security",
      "titleKey": "settings.hub.sections.security.title",
      "descriptionKey": "settings.hub.sections.security.description",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": Shield,
      "href": "/settings/security",
      "color": "bg-red-500",
      "fieldsKeys": [
        "settings.hub.sections.security.fields.twoFactorAuthentication",
        "settings.hub.sections.security.fields.activeSessions",
        "settings.hub.sections.security.fields.dataDownload",
        "settings.hub.sections.security.fields.accountDeletion"
      ]
    },
    {
      "id": "account",
      "titleKey": "settings.hub.sections.account.title",
      "descriptionKey": "settings.hub.sections.account.description",
      "roles": ["farmer", "supplier", "buyer", "admin"],
      "icon": User,
      "href": "/settings/account",
      "color": "bg-indigo-500",
      "fieldsKeys": [
        "settings.hub.sections.account.fields.profileInformation",
        "settings.hub.sections.account.fields.passwordChange",
        "settings.hub.sections.account.fields.emailPreferences",
        "settings.hub.sections.account.fields.privacySettings"
      ]
    }
  ]
};

export default function GlobalSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  // Filter sections based on user role
  const userRole = user?.role || 'BUYER';
  const availableSections = settingsConfig.sections.filter(
    section => section.roles.includes(userRole.toLowerCase())
  );

  const handleSectionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserRole} activeItem="Settings" />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t('settings.hub.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('settings.hub.description')}</p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  onClick={() => handleSectionClick(section.href)}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all cursor-pointer hover:border-success/50 group"
                >
                  {/* Icon and Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-success transition-colors">
                      {t(section.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(section.descriptionKey)}
                    </p>
                    
                    {/* Fields Preview */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {section.fieldsKeys.slice(0, 3).map((fieldKey, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                          >
                            {t(fieldKey)}
                          </span>
                        ))}
                        {section.fieldsKeys.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                            {t('settings.hub.moreFields', { count: section.fieldsKeys.length - 3 })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('settings.hub.quickActions.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">{t('settings.hub.quickActions.viewProfile.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('settings.hub.quickActions.viewProfile.description')}</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/chat')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">{t('settings.hub.quickActions.messages.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('settings.hub.quickActions.messages.description')}</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/notifications')}
                className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">{t('settings.hub.quickActions.notifications.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('settings.hub.quickActions.notifications.description')}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

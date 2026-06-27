'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import {
  Building,
  Bell,
  Globe,
  Shield,
  ChevronRight,
  User,
  CreditCard,
} from 'lucide-react';

const ROLE_MAP: Record<string, string> = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
};

const settingsConfig = {
  sections: [
    {
      id: 'business',
      titleKey: 'settings.hub.sections.business.title',
      descriptionKey: 'settings.hub.sections.business.description',
      roles: ['seller'],
      icon: Building,
      href: '/settings/business',
      color: 'bg-blue-500',
    },
    {
      id: 'payments',
      titleKey: 'settings.hub.sections.payments.title',
      descriptionKey: 'settings.hub.sections.payments.description',
      roles: ['seller'],
      icon: CreditCard,
      href: '/settings/payments',
      color: 'bg-green-500',
    },
    {
      id: 'notifications',
      titleKey: 'settings.hub.sections.notifications.title',
      descriptionKey: 'settings.hub.sections.notifications.description',
      roles: ['seller', 'buyer', 'admin'],
      icon: Bell,
      href: '/settings/notifications',
      color: 'bg-purple-500',
    },
    {
      id: 'localization',
      titleKey: 'settings.hub.sections.localization.title',
      descriptionKey: 'settings.hub.sections.localization.description',
      roles: ['seller', 'buyer', 'admin'],
      icon: Globe,
      href: '/settings/localization',
      color: 'bg-orange-500',
    },
    {
      id: 'security',
      titleKey: 'settings.hub.sections.security.title',
      descriptionKey: 'settings.hub.sections.security.description',
      roles: ['seller', 'buyer', 'admin'],
      icon: Shield,
      href: '/settings/security',
      color: 'bg-red-500',
    },
    {
      id: 'account',
      titleKey: 'settings.hub.sections.account.title',
      descriptionKey: 'settings.hub.sections.account.description',
      roles: ['seller', 'buyer', 'admin'],
      icon: User,
      href: '/settings/account',
      color: 'bg-indigo-500',
    },
  ],
};

export default function GlobalSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const userRole = ROLE_MAP[user?.role ?? 'BUYER'] ?? 'buyer';
  const availableSections = settingsConfig.sections.filter(
    section => section.roles.includes(userRole),
  );

  return (
    <AppLayout maxWidth="max-w-4xl">
      <PageHeader
        title={t('settings.hub.title')}
        description={t('settings.hub.description')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => router.push(section.href)}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 hover:shadow-md transition-all text-left hover:border-success/50 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 ${section.color} rounded-lg flex items-center justify-center text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-foreground group-hover:text-success transition-colors">
                {t(section.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {t(section.descriptionKey)}
              </p>
            </button>
          );
        })}
      </div>
    </AppLayout>
  );
}

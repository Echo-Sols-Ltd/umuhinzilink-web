'use client';

import AppLayout from './AppLayout';
import PageHeader from './PageHeader';
import { useI18n } from '@/contexts/I18nContext';

interface SettingsSubLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function SettingsSubLayout({
  title,
  description,
  children,
  actions,
}: SettingsSubLayoutProps) {
  const { t } = useI18n();

  return (
    <AppLayout maxWidth="max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        backHref="/settings"
        backLabel={t('layout.settingsBack')}
        actions={actions}
      />
      {children}
    </AppLayout>
  );
}

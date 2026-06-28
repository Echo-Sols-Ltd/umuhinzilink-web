'use client';

import AppLayout from './AppLayout';
import PageHeader from './PageHeader';

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
  return (
    <AppLayout maxWidth="max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        backHref="/settings"
        backLabel="Settings"
        actions={actions}
      />
      {children}
    </AppLayout>
  );
}

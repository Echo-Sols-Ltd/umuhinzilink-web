'use client';

import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';

export default function AdminDashboardPage() {
  const { t } = useI18n();

  return (
    <>
      <AdminPageHeader
        title={t('admin.dashboard.title')}
        description={t('admin.dashboard.subtitle')}
      />
      <main className="flex-1 overflow-auto p-4 pb-8 sm:p-6">
        <AdminDashboard />
      </main>
    </>
  );
}

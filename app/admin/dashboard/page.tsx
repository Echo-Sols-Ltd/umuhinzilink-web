'use client';

import React from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';

export default function AdminDashboardPage() {
  const { t } = useI18n();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserRole.ADMIN}
        activeItem="Dashboard"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPageHeader
          title={t('admin.dashboard.title')}
          description={t('admin.dashboard.subtitle')}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

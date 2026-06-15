'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { useI18n } from '@/contexts/I18nContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">{t('admin.dashboard.accessDenied.title')}</h1>
          <p className="text-muted-foreground">{t('admin.dashboard.accessDenied.description')}</p>
        </div>
      </div>
    );
  }

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

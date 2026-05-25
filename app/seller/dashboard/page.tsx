'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import FarmerDashboard from '@/components/dashboard/farmer/FarmerDashboard';
import Sidebar from '@/components/shared/Sidebar';
import { useI18n } from '@/contexts/I18nContext';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user || user.role !== UserType.FARMER) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">{t('farmer.dashboard.accessDenied.title')}</h1>
          <p className="text-muted-foreground">{t('farmer.dashboard.accessDenied.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden md:block shrink-0">
          <Sidebar
            userType={UserType.FARMER}
            activeItem="Dashboard"
          />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {t('farmer.dashboard.title')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('farmer.dashboard.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-screen">
              <FarmerDashboard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

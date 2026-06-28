'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  CheckCircle,
  Clock,
  Briefcase,
  Store,
  UserCheck,
  Activity
} from '@/lib/icons';
import MetricCard from '../common/MetricCard';
import { DashboardSection } from '../common/DashboardGrid';
import { AdminDashboardData } from '@/types';
import { dashboardService } from '@/services/dashboardService';
import DashboardChart from '../common/DashboardChart';
import { useI18n } from '@/contexts/I18nContext';
import { DashboardSkeleton } from '@/components/layout/PageLoading';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getAdminDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    );
  }

  // Fallbacks if data is missing during API migration
  const fallbackChartData = {
    userGrowthTrend: dashboardData.userGrowthTrend || dashboardData.userGrowth,
    revenueTrend: dashboardData.revenueTrend || dashboardData.revenueByUserType
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Ecosystem Overview */}
      <DashboardSection title={t('admin.dashboard.sections.ecosystemOverview')} cols={4}>
        <MetricCard
          title={t('admin.dashboard.metrics.totalUsers')}
          value={dashboardData.totalUsers}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.totalFarmers')}
          value={dashboardData.totalFarmers || 0}
          icon={<Briefcase className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.totalBuyers')}
          value={dashboardData.totalBuyers || 0}
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.totalSuppliers')}
          value={dashboardData.totalSuppliers || 0}
          icon={<Store className="w-5 h-5 text-orange-500" />}
        />
      </DashboardSection>

      {/* Section 2: Platform Performance */}
      <DashboardSection title={t('admin.dashboard.sections.platformPerformance')} cols={4}>
        <MetricCard
          title={t('admin.dashboard.metrics.totalOrders')}
          value={dashboardData.totalOrders || 0}
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.transactionVolume')}
          value={dashboardData.transactionVolume}
          format="currency"
          icon={<Activity className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.platformRevenue')}
          value={dashboardData.platformRevenue}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.newRegistrations')}
          value={dashboardData.newRegistrationsLast30Days || dashboardData.newRegistrations || 0}
          icon={<TrendingUp className="w-5 h-5 text-teal-500" />}
        />
      </DashboardSection>

      {/* Section 3: Engagement and Operational Health */}
      <DashboardSection title={t('admin.dashboard.sections.engagementOperations')} cols={2}>
        <MetricCard
          title={t('admin.dashboard.metrics.activeUsers')}
          value={dashboardData.activeUsersLast7Days || dashboardData.activeSessions || 0}
          icon={<UserCheck className="w-5 h-5 text-indigo-500" />}
        />
        <MetricCard
          title={t('admin.dashboard.metrics.openSupportTickets')}
          value={dashboardData.openSupportTickets}
          icon={<AlertTriangle className={`w-5 h-5 ${dashboardData.openSupportTickets > 10 ? 'text-red-500' : 'text-green-500'}`} />}
        />
      </DashboardSection>

      {/* Section 4: Charts */}
      {fallbackChartData.userGrowthTrend && fallbackChartData.revenueTrend && (
        <DashboardSection title={t('admin.dashboard.sections.platformTrends')} cols={2}>
          <DashboardChart
            config={fallbackChartData.userGrowthTrend}
            height={300}
          />
          <DashboardChart
            config={fallbackChartData.revenueTrend}
            height={300}
          />
        </DashboardSection>
      )}
    </div>
  );
}

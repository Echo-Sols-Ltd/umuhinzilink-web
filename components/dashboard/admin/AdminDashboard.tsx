'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  ShoppingCart,
  UserCheck,
  RefreshCw,
  BarChart3,
  ArrowRight,
} from '@/lib/icons';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDashboardSection from '@/components/admin/AdminDashboardSection';
import { RevenueTrendChart, UserGrowthChart } from '@/components/admin/AdminDashboardCharts';
import { AdminDashboardData } from '@/types';
import { dashboardService } from '@/services/dashboardService';
import { useI18n } from '@/contexts/I18nContext';
import { DashboardSkeleton } from '@/components/layout/PageLoading';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useI18n();

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await dashboardService.getAdminDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        notify.error(t('common.error'), 'Dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
      notify.error(t('common.error'), 'Dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <DashboardSkeleton cards={4} />;
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-8 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{t('common.error')}</p>
          <p className="text-xs text-muted-foreground">Unable to load dashboard metrics right now.</p>
        </div>
        <Button onClick={() => fetchDashboardData()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  const userGrowthTrend =
    dashboardData.userGrowthTrend ?? dashboardData.userGrowth ?? null;
  const revenueTrend =
    dashboardData.revenueTrend ?? dashboardData.revenueByUserType ?? null;

  const activeUsers =
    dashboardData.activeUsersLast7Days ?? dashboardData.activeSessions ?? 0;
  const newRegistrations =
    dashboardData.newRegistrationsLast30Days ?? dashboardData.newRegistrations ?? 0;

  const kpiCards = [
    {
      title: t('admin.dashboard.metrics.totalUsers'),
      value: dashboardData.totalUsers ?? 0,
      format: 'number' as const,
      icon: Users,
      iconClassName: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      hint: `${newRegistrations.toLocaleString()} new in the last 30 days`,
    },
    {
      title: t('admin.dashboard.metrics.platformRevenue'),
      value: dashboardData.platformRevenue ?? 0,
      format: 'currency' as const,
      icon: DollarSign,
      iconClassName: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      hint: 'Total platform earnings',
    },
    {
      title: t('admin.dashboard.metrics.totalOrders'),
      value: dashboardData.totalOrders ?? 0,
      format: 'number' as const,
      icon: ShoppingCart,
      iconClassName: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      hint: 'All-time order count',
    },
    {
      title: t('admin.dashboard.metrics.activeUsers'),
      value: activeUsers,
      format: 'number' as const,
      icon: UserCheck,
      iconClassName: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      hint: 'Active in the last 7 days',
    },
  ];

  return (
    <div className="space-y-8 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Key platform metrics at a glance.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/admin/analytics">
              View all analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <AdminStatCard key={card.title} variant="featured" {...card} />
        ))}
      </div>

      <AdminDashboardSection
        title={t('admin.dashboard.sections.platformTrends')}
        description="User growth and revenue over recent periods"
        contentClassName="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <UserGrowthChart config={userGrowthTrend} />
        <RevenueTrendChart config={revenueTrend} />
      </AdminDashboardSection>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Download,
  RefreshCw,
} from '@/lib/icons';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDashboardSection from '@/components/admin/AdminDashboardSection';
import {
  MonthlyOverviewChart,
  OrdersTrendChart,
  RevenueTrendChart,
  TopProductsChart,
  TopSellersChart,
} from '@/components/admin/AdminAnalyticsCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AdminAnalyticsViewModel } from '@/types/adminAnalytics';
import { fetchAdminAnalytics, formatRwf } from '@/services/adminAnalytics';
import { analyticsService } from '@/services/analytics';
import { notify } from '@/lib/notify';

function RevenueAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(message);
      notify.error(message, 'Analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleExport = () => {
    if (!analytics?.monthlyData.length) {
      notify.error('No monthly data available to export yet.');
      return;
    }
    analyticsService.exportToCSV(analytics.monthlyData, 'umuhinzilink-admin-analytics');
  };

  if (loading) {
    return (
      <>
        <AdminPageHeader
          title="Analytics Dashboard"
          description="Revenue insights and platform metrics"
        />
        <main className="flex flex-1 items-center justify-center">
          <PageLoading
            variant="section"
            label="Loading analytics"
            description="Fetching platform metrics from the API…"
            className="bg-transparent dark:bg-transparent"
          />
        </main>
      </>
    );
  }

  if (error || !analytics) {
    return (
      <>
        <AdminPageHeader
          title="Analytics Dashboard"
          description="Revenue insights and platform metrics"
        />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-md space-y-4 text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {error ?? 'Analytics data is unavailable right now.'}
            </p>
            <Button onClick={() => loadAnalytics()}>Retry</Button>
          </div>
        </main>
      </>
    );
  }

  const statCards = [
    {
      title: 'Platform Revenue',
      value: analytics.revenue.current,
      format: 'currency' as const,
      change: `${analytics.revenue.growth > 0 ? '+' : ''}${analytics.revenue.growth}% vs last period`,
      changeType:
        analytics.revenue.growth >= 0
          ? ('positive' as const)
          : ('negative' as const),
      icon: DollarSign,
      iconClassName: 'bg-emerald-500',
    },
    {
      title: 'Total Orders',
      value: analytics.orders.current,
      format: 'number' as const,
      change: `${analytics.orders.growth > 0 ? '+' : ''}${analytics.orders.growth}% vs last period`,
      changeType:
        analytics.orders.growth >= 0 ? ('positive' as const) : ('negative' as const),
      icon: ShoppingCart,
      iconClassName: 'bg-blue-500',
    },
    {
      title: 'Registered Users',
      value: analytics.users.current,
      format: 'number' as const,
      change: `${analytics.users.growth > 0 ? '+' : ''}${analytics.users.growth}% vs last period`,
      changeType:
        analytics.users.growth >= 0 ? ('positive' as const) : ('negative' as const),
      icon: Users,
      iconClassName: 'bg-violet-500',
    },
    {
      title: 'Products Listed',
      value: analytics.products.current,
      format: 'number' as const,
      change: `${analytics.products.growth > 0 ? '+' : ''}${analytics.products.growth}% vs last period`,
      changeType:
        analytics.products.growth >= 0 ? ('positive' as const) : ('negative' as const),
      icon: Package,
      iconClassName: 'bg-amber-500',
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Analytics Dashboard"
        description="Live platform metrics from the admin API"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleExport}
            title="Export monthly data"
          >
            <Download className="h-4 w-4" />
          </Button>
        }
        toolbar={
          <Button
            type="button"
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh data
          </Button>
        }
      />

      <main className="flex-1 space-y-8 overflow-auto p-4 pb-8 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <AdminStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <AdminDashboardSection
          title="Trends"
          description="Revenue and order activity over recent months"
          contentClassName="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <RevenueTrendChart data={analytics.monthlyData} />
          <OrdersTrendChart data={analytics.monthlyData} />
        </AdminDashboardSection>

        <AdminDashboardSection
          title="Performance breakdown"
          description="Combined monthly view of revenue, orders, and user growth"
        >
          <MonthlyOverviewChart data={analytics.monthlyData} />
        </AdminDashboardSection>

        <AdminDashboardSection
          title="Marketplace leaders"
          description="Top products and sellers by revenue"
          contentClassName="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <TopProductsChart products={analytics.topProducts} />
          <TopSellersChart sellers={analytics.topFarmers} />
        </AdminDashboardSection>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Detailed month-by-month platform metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.monthlyData.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">No monthly breakdown available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>New users</TableHead>
                      <TableHead className="text-right">Avg order value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.monthlyData.map((month) => (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">{month.month}</TableCell>
                        <TableCell>{formatRwf(month.revenue)}</TableCell>
                        <TableCell>{month.orders.toLocaleString()}</TableCell>
                        <TableCell>{month.users.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {month.orders > 0
                            ? formatRwf(Math.round(month.revenue / month.orders))
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function AnalyticsPage() {
  return <RevenueAnalytics />;
}

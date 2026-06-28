'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Plus,
  Wallet,
  Sprout,
  ArrowRight,
} from '@/lib/icons';
import { ROUTES } from '@/lib/routes';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDashboardSection from '@/components/admin/AdminDashboardSection';
import { RevenueTrendChart } from '@/components/admin/AdminDashboardCharts';
import { SellerDashboardData } from '@/types';
import { dashboardService } from '@/services/dashboardService';
import { useI18n } from '@/contexts/I18nContext';
import { DashboardSkeleton } from '@/components/layout/PageLoading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function getStatusVariant(
  status: string,
): 'success' | 'warning' | 'destructive' | 'secondary' | 'info' {
  switch (status) {
    case 'Delivered':
    case 'Completed':
      return 'success';
    case 'Pending':
    case 'Processing':
      return 'warning';
    case 'In Transit':
    case 'Shipped':
      return 'info';
    case 'Cancelled':
    case 'Failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState<SellerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await dashboardService.getSellerDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch seller dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return t('common.status.completed');
      case 'Pending':
        return t('common.status.pending');
      case 'Processing':
        return t('common.status.processing');
      case 'In Transit':
      case 'Shipped':
        return t('common.status.active');
      case 'Cancelled':
        return t('common.status.cancelled');
      default:
        return status;
    }
  };

  if (loading) {
    return <DashboardSkeleton cards={4} />;
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-8 text-center">
        <Package className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('common.error')}</p>
        <Button variant="outline" size="sm" onClick={() => fetchDashboardData()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  const totalRevenue =
    dashboardData.totalRevenue ?? (dashboardData as { totalIncome?: number }).totalIncome ?? 0;
  const recentOrders = dashboardData.recentOrders ?? [];
  const lowStockItems = dashboardData.lowStockItems ?? [];
  const revenueTrend = dashboardData.revenueTrend ?? null;

  const quickActions = [
    {
      title: t('farmer.dashboard.actions.addProduct'),
      description: 'List new produce',
      href: ROUTES.productCreate,
      icon: Plus,
      iconClassName: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: t('farmer.dashboard.actions.manageInventory'),
      description: 'Edit your listings',
      href: ROUTES.sellerProducts,
      icon: Sprout,
      iconClassName: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      title: t('farmer.dashboard.actions.viewPayments'),
      description: 'Wallet & earnings',
      href: ROUTES.wallet,
      icon: Wallet,
      iconClassName: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: t('farmer.dashboard.actions.viewAll'),
      description: 'Track buyer orders',
      href: ROUTES.orders,
      icon: ShoppingCart,
      iconClassName: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          variant="featured"
          title={t('farmer.dashboard.metrics.totalEarnings')}
          value={totalRevenue}
          format="currency"
          icon={DollarSign}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          hint="From completed sales"
        />
        <AdminStatCard
          variant="featured"
          title={t('farmer.dashboard.metrics.pendingOrders')}
          value={dashboardData.activeOrders ?? 0}
          format="number"
          icon={ShoppingCart}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          hint="Orders awaiting action"
        />
        <AdminStatCard
          variant="featured"
          title={t('farmer.dashboard.metrics.lowStockProducts')}
          value={dashboardData.lowStockProducts ?? 0}
          format="number"
          icon={AlertTriangle}
          iconClassName={
            (dashboardData.lowStockProducts ?? 0) > 0
              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }
          hint={
            (dashboardData.lowStockProducts ?? 0) > 0
              ? 'Needs restocking'
              : 'Stock levels healthy'
          }
        />
        <AdminStatCard
          variant="featured"
          title={t('supplier.dashboard.metrics.deliveryRate')}
          value={`${dashboardData.onTimeDeliveryRate ?? 0}%`}
          format="raw"
          icon={TrendingUp}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          hint="On-time fulfillment"
        />
      </div>

      <AdminDashboardSection
        title={t('farmer.dashboard.sections.quickActions')}
        contentClassName="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group block h-full">
              <Card className="h-full transition-colors hover:bg-muted/30">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </AdminDashboardSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1 space-y-6">
          {lowStockItems.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {t('supplier.dashboard.sections.inventoryAlerts')}
                </CardTitle>
                <CardDescription>Products running low on stock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {item.currentStock}
                        </span>{' '}
                        {t('supplier.dashboard.alerts.inStock')} · {t('supplier.dashboard.alerts.min')}{' '}
                        {item.minThreshold}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={ROUTES.productEdit(item.id)}>
                        {t('supplier.dashboard.alerts.restock')}
                      </Link>
                    </Button>
                  </div>
                ))}
                <Button asChild variant="ghost" size="sm" className="mt-1 w-full gap-1">
                  <Link href={ROUTES.sellerProducts}>
                    {t('supplier.dashboard.alerts.manageProducts')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <RevenueTrendChart config={revenueTrend} />
        </div>

        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{t('farmer.dashboard.sections.recentOrders')}</CardTitle>
                  <CardDescription>Latest orders from your buyers</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={ROUTES.orders}>
                    {t('farmer.dashboard.actions.viewAll')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('farmer.dashboard.table.noOrders')}
                  </p>
                  <Button asChild size="sm">
                    <Link href={ROUTES.productCreate}>
                      {t('farmer.dashboard.actions.addProduct')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="pl-6">{t('farmer.dashboard.table.buyer')}</TableHead>
                        <TableHead>{t('supplier.dashboard.table.product')}</TableHead>
                        <TableHead>{t('supplier.dashboard.table.quantity')}</TableHead>
                        <TableHead>{t('farmer.dashboard.table.status')}</TableHead>
                        <TableHead className="pr-6">{t('farmer.dashboard.table.date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/30"
                          onClick={() => router.push(ROUTES.orderDetail(order.id))}
                        >
                          <TableCell className="pl-6 font-medium">{order.farmer}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>
                              {translateStatus(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-sm text-muted-foreground">
                            {new Date(order.deliveryDate).toLocaleDateString(
                              locale === 'rw' ? 'rw-RW' : 'en-US',
                              { month: 'short', day: 'numeric', year: 'numeric' },
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

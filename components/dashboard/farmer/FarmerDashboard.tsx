'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  Plus,
  CreditCard,
  Archive,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import MetricCard from '../common/MetricCard';
import { DashboardSection } from '../common/DashboardGrid';
import { FarmerDashboardData } from '@/types';
import { dashboardService } from '@/services/dashboardService';
import { useI18n } from '@/contexts/I18nContext';

export default function FarmerDashboard() {
  const [dashboardData, setDashboardData] = useState<FarmerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getFarmerDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch farmer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Processing': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Completed': return t('common.status.completed');
      case 'Pending': return t('common.status.pending');
      case 'Active': return t('common.status.active');
      case 'Processing': return t('common.status.processing');
      case 'Cancelled': return t('common.status.cancelled');
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Financial Overview */}
      <DashboardSection title={t('farmer.dashboard.sections.financialOverview')} cols={4}>
        <MetricCard
          title={t('farmer.dashboard.metrics.totalEarnings')}
          value={dashboardData.totalEarnings}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('farmer.dashboard.metrics.pendingOrders')}
          value={dashboardData.pendingOrders}
          icon={<Clock className={`w-5 h-5 ${dashboardData.pendingOrders > 0 ? 'text-yellow-500' : 'text-primary'}`} />}
        />
        <MetricCard
          title={t('farmer.dashboard.metrics.totalOrders')}
          value={dashboardData.totalOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('farmer.dashboard.metrics.lowStockProducts')}
          value={dashboardData.lowStockProducts}
          icon={<AlertTriangle className={`w-5 h-5 ${dashboardData.lowStockProducts > 0 ? 'text-red-500' : 'text-green-500'}`} />}
        />
      </DashboardSection>

      {/* Section 2: Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('farmer.dashboard.sections.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/farmer/add_produce" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">{t('farmer.dashboard.actions.addProduct')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link href="/farmer/wallet" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium">{t('farmer.dashboard.actions.viewPayments')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <Link href="/farmer/products" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Archive className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium">{t('farmer.dashboard.actions.manageInventory')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>

      {/* Section 3: Recent Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('farmer.dashboard.sections.recentOrders')}</h2>
          <Link href="/farmer/orders" className="text-sm text-primary hover:underline">
            {t('farmer.dashboard.actions.viewAll')}
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('farmer.dashboard.table.orderId')}</th>
                  <th className="px-6 py-4 font-medium">{t('farmer.dashboard.table.buyer')}</th>
                  <th className="px-6 py-4 font-medium">{t('farmer.dashboard.table.status')}</th>
                  <th className="px-6 py-4 font-medium">{t('farmer.dashboard.table.amount')}</th>
                  <th className="px-6 py-4 font-medium">{t('farmer.dashboard.table.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dashboardData.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                    <td className="px-6 py-4">{order.buyer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', { style: 'currency', currency: 'RWF' }).format(order.amount)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.date).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US')}
                    </td>
                  </tr>
                ))}
                {(!dashboardData.recentOrders || dashboardData.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      {t('farmer.dashboard.table.noOrders')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Package,
  AlertTriangle,
  Truck,
  TrendingUp,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import MetricCard from '../common/MetricCard';
import { DashboardSection } from '../common/DashboardGrid';
import { SellerDashboardData } from '@/types';
import { dashboardService } from '@/services/dashboardService';
import DashboardChart from '../common/DashboardChart';
import { useI18n } from '@/contexts/I18nContext';

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState<SellerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
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
      case 'Delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'In Transit': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Delivered': return t('common.status.completed'); // Using completed for delivered
      case 'Pending': return t('common.status.pending');
      case 'In Transit': return t('common.status.active'); // Using active for in transit
      case 'Cancelled': return t('common.status.cancelled');
      default: return status;
    }
  };

  // Fallbacks if data is missing during API migration
  const recentOrders = dashboardData.recentOrders || [
    { id: 'S-ORD-001', farmer: 'John Doe', product: 'Fertilizer NPK', quantity: '100 Bags', status: 'In Transit', deliveryDate: new Date().toISOString() },
    { id: 'S-ORD-002', farmer: 'Alice Smith', product: 'Tomato Seeds', quantity: '50 Pkts', status: 'Pending', deliveryDate: new Date(Date.now() + 86400000).toISOString() },
    { id: 'S-ORD-003', farmer: 'Local Coop', product: 'Pesticide', quantity: '20 Liters', status: 'Delivered', deliveryDate: new Date(Date.now() - 172800000).toISOString() }
  ];

  const lowStockItems = dashboardData.lowStockItems || [
    { id: 'ITEM-1', name: 'Fertilizer NPK 15-15-15', currentStock: 12, minThreshold: 50 },
    { id: 'ITEM-2', name: 'Maize Seeds', currentStock: 5, minThreshold: 20 },
    { id: 'ITEM-3', name: 'Watering Cans', currentStock: 2, minThreshold: 10 }
  ];

  return (
    <div className="space-y-8">
      {/* Section 1: KPI Cards */}
      <DashboardSection title={t('supplier.dashboard.sections.performanceOverview')} cols={4}>
        <MetricCard
          title={t('supplier.dashboard.metrics.totalRevenue')}
          value={dashboardData.totalRevenue || (dashboardData as any).totalIncome || 0}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('supplier.dashboard.metrics.activeOrders')}
          value={dashboardData.activeOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('supplier.dashboard.metrics.lowStockProducts')}
          value={dashboardData.lowStockProducts}
          icon={<AlertTriangle className={`w-5 h-5 ${dashboardData.lowStockProducts > 0 ? 'text-red-500' : 'text-green-500'}`} />}
        />
        <MetricCard
          title={t('supplier.dashboard.metrics.deliveryRate')}
          value={`${dashboardData.onTimeDeliveryRate}%`}
          icon={<Truck className={`w-5 h-5 ${dashboardData.onTimeDeliveryRate < 90 ? 'text-orange-500' : 'text-teal-500'}`} />}
        />
      </DashboardSection>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Section 2: Inventory Snapshot & Delivery Analytics */}
        <div className="xl:col-span-1 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {t('supplier.dashboard.sections.inventoryAlerts')}
              </h2>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col gap-1 p-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="text-red-500 font-semibold">{item.currentStock}</span>
                        {' '}{t('supplier.dashboard.alerts.inStock')} ({t('supplier.dashboard.alerts.min')}: {item.minThreshold})
                      </p>
                    </div>
                    <Link href={`/supplier/products/restock/${item.id}`} className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium transition-colors">
                      {t('supplier.dashboard.alerts.restock')}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>{t('supplier.dashboard.alerts.allHealthy')}</p>
                </div>
              )}

              <Link href="/supplier/products" className="text-sm text-primary hover:underline mt-2 text-center py-2 flex items-center justify-center gap-1">
                {t('supplier.dashboard.alerts.manageProducts')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Optional Trend Chart */}
          {dashboardData.revenueTrend && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                {t('supplier.dashboard.sections.revenueTrend')}
              </h2>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <DashboardChart config={dashboardData.revenueTrend} height={180} />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Recent Orders */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('supplier.dashboard.sections.recentOrders')}</h2>
            <Link href="/supplier/orders" className="text-sm text-primary hover:underline">
              {t('farmer.dashboard.actions.viewAll')}
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t('supplier.dashboard.table.farmer')}</th>
                    <th className="px-6 py-4 font-medium">{t('supplier.dashboard.table.product')}</th>
                    <th className="px-6 py-4 font-medium">{t('supplier.dashboard.table.quantity')}</th>
                    <th className="px-6 py-4 font-medium">{t('supplier.dashboard.table.status')}</th>
                    <th className="px-6 py-4 font-medium">{t('supplier.dashboard.table.deliveryDate')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{order.farmer}</td>
                      <td className="px-6 py-4">{order.product}</td>
                      <td className="px-6 py-4">{order.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.deliveryDate).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        {t('supplier.dashboard.table.noOrders')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

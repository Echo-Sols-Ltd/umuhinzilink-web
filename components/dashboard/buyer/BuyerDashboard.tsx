'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Package,
  Wallet,
  Clock,
  Search,
  Heart,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import MetricCard from '../common/MetricCard';
import { DashboardSection } from '../common/DashboardGrid';
import { BuyerDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/services/dashboardService';
import DashboardChart from '../common/DashboardChart';
import { useI18n } from '@/contexts/I18nContext';

export default function BuyerDashboard() {
  const [dashboardData, setDashboardData] = useState<BuyerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getBuyerDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || t('common.error'));
        }
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.noData') || 'No dashboard data available'}</p>
      </div>
    );
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Delivered': return t('common.status.completed');
      case 'Processing': return t('common.status.processing');
      case 'Shipped': return t('common.status.active'); // Using active for shipped
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Processing': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Shipped': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Fallback mock data if recentOrders isn't available from API
  const recentOrders = dashboardData.recentOrders || [
    { id: 'ORD-901', status: 'Processing', amount: 15000, date: new Date().toISOString() },
    { id: 'ORD-902', status: 'Shipped', amount: 45000, date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'ORD-903', status: 'Delivered', amount: 24000, date: new Date(Date.now() - 172800000).toISOString() }
  ];

  return (
    <div className="space-y-8">
      {/* Section 1: Overview Cards */}
      <DashboardSection title={t('buyer.dashboard.sections.overview')} cols={4}>
        <MetricCard
          title={t('buyer.dashboard.metrics.activeOrders')}
          value={dashboardData.activeOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('buyer.dashboard.metrics.pendingOrders')}
          value={dashboardData.pendingOrders}
          icon={<Clock className={`w-5 h-5 ${dashboardData.pendingOrders > 0 ? 'text-yellow-500' : 'text-primary'}`} />}
        />
        <MetricCard
          title={t('buyer.dashboard.metrics.walletBalance')}
          value={dashboardData.walletBalance}
          format="currency"
          icon={<Wallet className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title={t('buyer.dashboard.metrics.totalSpent')}
          value={dashboardData.totalSpent}
          format="currency"
          icon={<ShoppingCart className="w-5 h-5 text-green-500" />}
        />
      </DashboardSection>

      <div className="gap-8">
        {/* Section 2: Quick Access */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('buyer.dashboard.sections.quickAccess')}</h2>
          <div className="flex gap-4">
            <Link href="/buyer/purchases" className="flex flex-1 items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">{t('buyer.dashboard.actions.trackOrders')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/buyer/products" className="flex flex-1 items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">{t('buyer.dashboard.actions.browseMarketplace')}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/buyer/saved" className="flex flex-1 items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <span className="font-medium flex items-center gap-2">
                  {t('buyer.dashboard.actions.savedProducts')}
                  <span className="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 py-0.5 px-2 rounded-full text-xs font-bold">
                    {dashboardData.savedProducts}
                  </span>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>

          {/* Optional Spending Trend Mini-Chart (Rendered only if spendingTrend is available) */}
          {dashboardData.spendingTrend && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                {t('buyer.dashboard.sections.monthlySpending')}
              </h2>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <DashboardChart config={dashboardData.spendingTrend} height={180} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

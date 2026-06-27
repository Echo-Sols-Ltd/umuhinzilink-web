'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  ChevronLeft,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole as UserType } from '@/types';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  users: {
    current: number;
    previous: number;
    growth: number;
  };
  products: {
    current: number;
    previous: number;
    growth: number;
  };
  topProducts: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
  topFarmers: Array<{
    name: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
}

function RevenueAnalytics() {
  const router = useRouter();
  const { t } = useI18n();
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        revenue: {
          current: 125000,
          previous: 100000,
          growth: 25,
        },
        orders: {
          current: 1250,
          previous: 1000,
          growth: 25,
        },
        users: {
          current: 2500,
          previous: 2000,
          growth: 25,
        },
        products: {
          current: 500,
          previous: 400,
          growth: 25,
        },
        topProducts: [
          { name: 'Fresh Tomatoes', revenue: 15000, orders: 150 },
          { name: 'Organic Lettuce', revenue: 12000, orders: 120 },
          { name: 'Farm Eggs', revenue: 10000, orders: 100 },
        ],
        topFarmers: [
          { name: 'Green Valley Farm', revenue: 25000, orders: 250, products: 15 },
          { name: 'Sunshine Acres', revenue: 20000, orders: 200, products: 12 },
          { name: 'Happy Harvest', revenue: 18000, orders: 180, products: 10 },
        ],
        monthlyData: [
          { month: 'Jan', revenue: 20000, orders: 200, users: 400 },
          { month: 'Feb', revenue: 22000, orders: 220, users: 440 },
          { month: 'Mar', revenue: 25000, orders: 250, users: 500 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (!analytics) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar userType={UserType.ADMIN} activeItem="Analytics" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminPageHeader
            title={t('admin.analytics.title')}
            description={t('admin.analytics.subtitle')}
          />
          <main className="flex-1 flex items-center justify-center">
            <PageLoading
              variant="section"
              label={t('admin.analytics.loadingLabel')}
              description={t('admin.analytics.loadingDescription')}
              className="bg-transparent dark:bg-transparent"
            />
          </main>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      titleKey: 'admin.analytics.stats.totalRevenue',
      value: `$${(analytics.revenue.current || 0).toLocaleString()}`,
      change: `${analytics.revenue.growth > 0 ? '+' : ''}${analytics.revenue.growth || 0}%`,
      changeType: analytics.revenue.growth > 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      titleKey: 'admin.analytics.stats.totalOrders',
      value: (analytics.orders.current || 0).toLocaleString(),
      change: `${analytics.orders.growth > 0 ? '+' : ''}${analytics.orders.growth || 0}%`,
      changeType: analytics.orders.growth > 0 ? 'positive' : 'negative',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      titleKey: 'admin.analytics.stats.activeUsers',
      value: (analytics.users.current || 0).toLocaleString(),
      change: `${analytics.users.growth > 0 ? '+' : ''}${analytics.users.growth || 0}%`,
      changeType: analytics.users.growth > 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      titleKey: 'admin.analytics.stats.productsListed',
      value: (analytics.products.current || 0).toLocaleString(),
      change: `${analytics.products.growth > 0 ? '+' : ''}${analytics.products.growth || 0}%`,
      changeType: analytics.products.growth > 0 ? 'positive' : 'negative',
      icon: Package,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Analytics'
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPageHeader
          title={t('admin.analytics.title')}
          description={t('admin.analytics.subtitle')}
          actions={
            <>
              <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </>
          }
          toolbar={
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
              >
                <option value="week">{t('admin.analytics.timeRange.week')}</option>
                <option value="month">{t('admin.analytics.timeRange.month')}</option>
                <option value="quarter">{t('admin.analytics.timeRange.quarter')}</option>
                <option value="year">{t('admin.analytics.timeRange.year')}</option>
              </select>
              <button className="bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90 flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4" />
                <span>{t('admin.analytics.export')}</span>
              </button>
            </div>
          }
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-card rounded-lg p-4 border border-border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t(stat.titleKey)}</p>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{t('admin.analytics.vsLastPeriod')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('admin.analytics.revenueTrend')}</h2>
              <div className="h-64 flex items-center justify-center bg-card rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t('admin.analytics.chartPlaceholder')}</p>
                  <p className="text-sm text-gray-400 mt-1">{t('admin.analytics.chartIntegrate')}</p>
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.analytics.ordersTrend')}</h2>
              <div className="h-64 flex items-center justify-center bg-card rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t('admin.analytics.ordersChartPlaceholder')}</p>
                  <p className="text-sm text-gray-400 mt-1">{t('admin.analytics.chartIntegrate')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products and Farmers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('admin.analytics.topProducts')}</h2>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center text-sm font-medium text-success">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.analytics.ordersCount', { count: product.orders })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Farmers */}
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('admin.analytics.topFarmers')}</h2>
              <div className="space-y-4">
                {analytics.topFarmers.map((farmer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center text-sm font-medium text-info">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{farmer.name}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.analytics.productsCount', { count: farmer.products })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${farmer.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{t('admin.analytics.ordersCount', { count: farmer.orders })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Data Table */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('admin.analytics.monthlyPerformance')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      {t('admin.analytics.table.month')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      {t('admin.analytics.table.revenue')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      {t('admin.analytics.table.orders')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      {t('admin.analytics.table.newUsers')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                      {t('admin.analytics.table.avgOrderValue')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analytics.monthlyData.map((month, index) => (
                    <tr key={index} className="hover:bg-card">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        ${(month.revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {(month.orders || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {(month.users || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        ${(month.revenue / month.orders).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return <RevenueAnalytics />;
}

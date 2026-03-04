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

export default function BuyerDashboard() {
  const [dashboardData, setDashboardData] = useState<BuyerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getBuyerDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    );
  }

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
      <DashboardSection title="Overview" cols={4}>
        <MetricCard
          title="Active Orders"
          value={dashboardData.activeOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Pending Orders"
          value={dashboardData.pendingOrders}
          icon={<Clock className={`w-5 h-5 ${dashboardData.pendingOrders > 0 ? 'text-yellow-500' : 'text-primary'}`} />}
        />
        <MetricCard
          title="Wallet Balance"
          value={dashboardData.walletBalance}
          format="currency"
          icon={<Wallet className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title="Total Spent"
          value={dashboardData.totalSpent}
          format="currency"
          icon={<ShoppingCart className="w-5 h-5 text-green-500" />}
        />
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 2: Quick Access */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Quick Access</h2>
          <div className="flex flex-col gap-4">
            <Link href="/buyer/orders" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Track Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/buyer/products" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Browse Marketplace</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/buyer/saved" className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors hover:shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <span className="font-medium flex items-center gap-2">
                  Saved Products
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
                Monthly Spending
              </h2>
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <DashboardChart config={dashboardData.spendingTrend} height={180} />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/buyer/orders" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(order.amount)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No recent orders found
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

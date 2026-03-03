'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Wallet,
  Bell,
  MessageSquare
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import DashboardChart from '../common/DashboardChart';
import DashboardGrid, { DashboardSection } from '../common/DashboardGrid';
import { BuyerDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-mock';

export default function BuyerDashboard() {
  const [dashboardData, setDashboardData] = useState<BuyerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getBuyerDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch buyer dashboard data:', error);
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
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <DashboardSection title="Overview" cols={4}>
        <MetricCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          change={12.5}
          changeType="increase"
        />
        <MetricCard
          title="Active Orders"
          value={dashboardData.activeOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Total Spent"
          value={dashboardData.totalSpent}
          format="currency"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          change={8.3}
          changeType="increase"
        />
        <MetricCard
          title="Wallet Balance"
          value={dashboardData.walletBalance}
          format="currency"
          icon={<Wallet className="w-5 h-5 text-purple-500" />}
        />
      </DashboardSection>

      {/* Charts Row 1 */}
      <DashboardSection title="Spending Analytics" cols={2}>
        <DashboardChart 
          config={dashboardData.spendingTrend} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.categoryDistribution} 
          height={300}
        />
      </DashboardSection>

      {/* Charts Row 2 */}
      <DashboardSection title="Order Activity" cols={2}>
        <DashboardChart 
          config={dashboardData.orderStatusChart} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.monthlyActivity} 
          height={300}
        />
      </DashboardSection>

      {/* Additional Metrics */}
      <DashboardSection title="Quick Stats" cols={4}>
        <MetricCard
          title="Pending Orders"
          value={dashboardData.pendingOrders}
          icon={<Package className="w-5 h-5 text-orange-500" />}
        />
        <MetricCard
          title="Completed Orders"
          value={dashboardData.completedOrders}
          icon={<ShoppingCart className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Saved Products"
          value={dashboardData.savedProducts}
          icon={<Package className="w-5 h-5 text-pink-500" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={dashboardData.averageOrderValue}
          format="currency"
          icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
        />
      </DashboardSection>

      {/* Notifications */}
      <DashboardSection title="Notifications" cols={2}>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Unread Messages</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.unreadMessages}</p>
          <p className="text-sm text-muted-foreground mt-2">New messages waiting</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Unread Notifications</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.unreadNotifications}</p>
          <p className="text-sm text-muted-foreground mt-2">New notifications</p>
        </div>
      </DashboardSection>
    </div>
  );
}

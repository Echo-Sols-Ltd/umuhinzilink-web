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
import { dashboardService } from '@/services/dashboardService';

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

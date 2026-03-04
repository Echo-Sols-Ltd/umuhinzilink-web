'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  CheckCircle,
  Clock,
  Briefcase,
  Store,
  UserCheck,
  Activity
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import { DashboardSection } from '../common/DashboardGrid';
import { AdminDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/services/dashboardService';
import DashboardChart from '../common/DashboardChart';

// Ensure Activity is available
export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getAdminDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
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

  // Fallbacks if data is missing during API migration
  const fallbackChartData = {
    userGrowthTrend: dashboardData.userGrowthTrend || dashboardData.userGrowth,
    revenueTrend: dashboardData.revenueTrend || dashboardData.revenueByUserType
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Ecosystem Overview */}
      <DashboardSection title="Ecosystem Overview" cols={4}>
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="Total Farmers"
          value={dashboardData.totalFarmers || 0}
          icon={<Briefcase className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Total Buyers"
          value={dashboardData.totalBuyers || 0}
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Total Suppliers"
          value={dashboardData.totalSuppliers || 0}
          icon={<Store className="w-5 h-5 text-orange-500" />}
        />
      </DashboardSection>

      {/* Section 2: Platform Performance */}
      <DashboardSection title="Platform Performance" cols={4}>
        <MetricCard
          title="Total Orders"
          value={dashboardData.totalOrders || 0}
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Transaction Volume"
          value={dashboardData.transactionVolume}
          format="currency"
          icon={<Activity className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title="Platform Revenue"
          value={dashboardData.platformRevenue}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="New Registrations (30d)"
          value={dashboardData.newRegistrationsLast30Days || dashboardData.newRegistrations || 0}
          icon={<TrendingUp className="w-5 h-5 text-teal-500" />}
        />
      </DashboardSection>

      {/* Section 3: Engagement and Operational Health */}
      <DashboardSection title="Engagement & Operations" cols={2}>
        <MetricCard
          title="Active Users (Last 7 Days)"
          value={dashboardData.activeUsersLast7Days || dashboardData.activeSessions || 0}
          icon={<UserCheck className="w-5 h-5 text-indigo-500" />}
        />
        <MetricCard
          title="Open Support Tickets"
          value={dashboardData.openSupportTickets}
          icon={<AlertTriangle className={`w-5 h-5 ${dashboardData.openSupportTickets > 10 ? 'text-red-500' : 'text-green-500'}`} />}
        />
      </DashboardSection>

      {/* Section 4: Charts */}
      {fallbackChartData.userGrowthTrend && fallbackChartData.revenueTrend && (
        <DashboardSection title="Platform Trends" cols={2}>
          <DashboardChart
            config={fallbackChartData.userGrowthTrend}
            height={300}
          />
          <DashboardChart
            config={fallbackChartData.revenueTrend}
            height={300}
          />
        </DashboardSection>
      )}
    </div>
  );
}

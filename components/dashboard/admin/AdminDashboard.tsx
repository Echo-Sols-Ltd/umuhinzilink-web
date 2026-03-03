'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Monitor,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import DashboardChart from '../common/DashboardChart';
import DashboardGrid, { DashboardSection } from '../common/DashboardGrid';
import { AdminDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-mock';

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

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <DashboardSection title="Platform Overview" cols={4}>
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<Users className="w-5 h-5 text-primary" />}
          change={dashboardData.monthlyGrowth}
          changeType="increase"
        />
        <MetricCard
          title="Active Sessions"
          value={dashboardData.activeSessions}
          icon={<Activity className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Platform Revenue"
          value={dashboardData.platformRevenue}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="System Health"
          value={dashboardData.systemHealth}
          format="percentage"
          icon={<Monitor className="w-5 h-5 text-teal-500" />}
        />
      </DashboardSection>

      {/* User Analytics */}
      <DashboardSection title="User Analytics" cols={2}>
        <DashboardChart 
          config={dashboardData.userGrowth} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.revenueByUserType} 
          height={300}
        />
      </DashboardSection>

      {/* System Monitoring */}
      <DashboardSection title="System Monitoring" cols={2}>
        <DashboardChart 
          config={dashboardData.systemHealthMetrics} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.userActivity} 
          height={300}
        />
      </DashboardSection>

      {/* Platform Metrics */}
      <DashboardSection title="Platform Metrics" cols={4}>
        <MetricCard
          title="New Registrations"
          value={dashboardData.newRegistrations}
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title="Transaction Volume"
          value={dashboardData.transactionVolume}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Open Support Tickets"
          value={dashboardData.openSupportTickets}
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
        />
        <MetricCard
          title="Monthly Growth"
          value={dashboardData.monthlyGrowth}
          format="percentage"
          icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
        />
      </DashboardSection>

      {/* Order Status Distribution */}
      <DashboardSection title="Order Status Distribution" cols={1}>
        <DashboardChart 
          config={dashboardData.orderStatusDistribution} 
          height={400}
        />
      </DashboardSection>

      {/* System Alerts */}
      <DashboardSection title="System Alerts" cols={3}>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Support Tickets</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.openSupportTickets}</p>
          <p className="text-sm text-muted-foreground mt-2">Open tickets</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Active Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.activeSessions}</p>
          <p className="text-sm text-muted-foreground mt-2">Currently online</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">System Health</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.systemHealth}%</p>
          <p className="text-sm text-muted-foreground mt-2">System status</p>
        </div>
      </DashboardSection>
    </div>
  );
}

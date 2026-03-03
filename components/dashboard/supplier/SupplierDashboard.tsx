'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users,
  MessageSquare,
  Truck,
  Star,
  Target
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import DashboardChart from '../common/DashboardChart';
import DashboardGrid, { DashboardSection } from '../common/DashboardGrid';
import { SupplierDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-mock';

export default function SupplierDashboard() {
  const [dashboardData, setDashboardData] = useState<SupplierDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getSupplierDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch supplier dashboard data:', error);
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
      <DashboardSection title="Performance Overview" cols={4}>
        <MetricCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon={<ShoppingCart className="w-5 h-5 text-primary" />}
          change={dashboardData.orderIncreaseRate}
          changeType="increase"
        />
        <MetricCard
          title="Total Income"
          value={dashboardData.totalIncome}
          format="currency"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          change={dashboardData.incomeIncreaseRate}
          changeType="increase"
        />
        <MetricCard
          title="Active Orders"
          value={dashboardData.activeOrders}
          icon={<Package className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Quality Score"
          value={dashboardData.qualityScore}
          icon={<Star className="w-5 h-5 text-yellow-500" />}
        />
      </DashboardSection>

      {/* Delivery Performance */}
      <DashboardSection title="Delivery Performance" cols={2}>
        <DashboardChart 
          config={dashboardData.deliveryPerformance} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.farmerGrowth} 
          height={300}
        />
      </DashboardSection>

      {/* Regional Analytics */}
      <DashboardSection title="Regional Analytics" cols={2}>
        <DashboardChart 
          config={dashboardData.regionalDistribution} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.revenueByRegion} 
          height={300}
        />
      </DashboardSection>

      {/* Additional Metrics */}
      <DashboardSection title="Business Metrics" cols={4}>
        <MetricCard
          title="Total Products"
          value={dashboardData.totalProducts}
          icon={<Package className="w-5 h-5 text-purple-500" />}
          change={dashboardData.productIncreaseRate}
          changeType="increase"
        />
        <MetricCard
          title="Total Farmers"
          value={dashboardData.totalFarmers}
          icon={<Users className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Total Buyers"
          value={dashboardData.totalBuyers}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={dashboardData.averageOrderValue}
          format="currency"
          icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
        />
      </DashboardSection>

      {/* Performance Indicators */}
      <DashboardSection title="Performance Indicators" cols={3}>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-teal-500" />
            <h3 className="font-semibold">On-Time Delivery</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.onTimeDeliveryRate}%</p>
          <p className="text-sm text-muted-foreground mt-2">Delivery performance rate</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Quality Score</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.qualityScore}/5</p>
          <p className="text-sm text-muted-foreground mt-2">Service quality rating</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">New Messages</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.newMessages}</p>
          <p className="text-sm text-muted-foreground mt-2">Unread messages</p>
        </div>
      </DashboardSection>
    </div>
  );
}

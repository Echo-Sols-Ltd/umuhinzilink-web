'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package,
  Shield,
  Award,
  Globe,
  BarChart3
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import DashboardChart from '../common/DashboardChart';
import DashboardGrid, { DashboardSection } from '../common/DashboardGrid';
import { GovernmentDashboardData } from '@/types/dashboard';
import { dashboardService } from '@/lib/dashboard-mock';

export default function GovernmentDashboard() {
  const [dashboardData, setDashboardData] = useState<GovernmentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardService.getGovernmentDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch government dashboard data:', error);
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
      <DashboardSection title="Agricultural Overview" cols={4}>
        <MetricCard
          title="Registered Farmers"
          value={dashboardData.registeredFarmers}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="Total Production"
          value={dashboardData.totalProduction}
          icon={<Package className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Market Value"
          value={dashboardData.marketValue}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Export Volume"
          value={dashboardData.exportVolume}
          icon={<Globe className="w-5 h-5 text-purple-500" />}
        />
      </DashboardSection>

      {/* Production Analytics */}
      <DashboardSection title="Production Analytics" cols={2}>
        <DashboardChart 
          config={dashboardData.productionTrends} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.regionalProduction} 
          height={300}
        />
      </DashboardSection>

      {/* Food Security & Compliance */}
      <DashboardSection title="Food Security & Compliance" cols={2}>
        <DashboardChart 
          config={dashboardData.foodSecurity} 
          height={300}
        />
        <DashboardChart 
          config={dashboardData.complianceMetrics} 
          height={300}
        />
      </DashboardSection>

      {/* Economic Impact */}
      <DashboardSection title="Economic Impact" cols={1}>
        <DashboardChart 
          config={dashboardData.economicImpact} 
          height={400}
        />
      </DashboardSection>

      {/* Key Indicators */}
      <DashboardSection title="Key Indicators" cols={4}>
        <MetricCard
          title="Food Security Index"
          value={dashboardData.foodSecurityIndex}
          format="percentage"
          icon={<Award className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title="Sustainability Score"
          value={dashboardData.sustainabilityScore}
          icon={<Shield className="w-5 h-5 text-teal-500" />}
        />
        <MetricCard
          title="Compliance Rate"
          value={dashboardData.complianceRate}
          format="percentage"
          icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title="Subsidy Distributed"
          value={dashboardData.subsidyDistributed}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-orange-500" />}
        />
      </DashboardSection>

      {/* Regional Statistics */}
      <DashboardSection title="Regional Statistics" cols={3}>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Registered Farmers</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.registeredFarmers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Total registered</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Total Production</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.totalProduction.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Tons produced</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Export Volume</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{dashboardData.exportVolume.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Tons exported</p>
        </div>
      </DashboardSection>
    </div>
  );
}

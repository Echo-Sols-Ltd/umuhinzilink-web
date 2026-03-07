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
import { dashboardService } from '@/services/dashboardService';

import { useI18n } from '@/contexts/I18nContext';

export default function GovernmentDashboard() {
  const [dashboardData, setDashboardData] = useState<GovernmentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

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
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <DashboardSection title={t('government.dashboard.sections.agriOverview')} cols={4}>
        <MetricCard
          title={t('government.dashboard.metrics.registeredFarmers')}
          value={dashboardData.registeredFarmers}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.totalProduction')}
          value={dashboardData.totalProduction}
          icon={<Package className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.marketValue')}
          value={dashboardData.marketValue}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.exportVolume')}
          value={dashboardData.exportVolume}
          icon={<Globe className="w-5 h-5 text-purple-500" />}
        />
      </DashboardSection>

      {/* Production Analytics */}
      <DashboardSection title={t('government.dashboard.sections.productionAnalytics')} cols={2}>
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
      <DashboardSection title={t('government.dashboard.sections.foodSecurityCompliance')} cols={2}>
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
      <DashboardSection title={t('government.dashboard.sections.economicImpact')} cols={1}>
        <DashboardChart 
          config={dashboardData.economicImpact} 
          height={400}
        />
      </DashboardSection>

      {/* Key Indicators */}
      <DashboardSection title={t('government.dashboard.sections.keyIndicators')} cols={4}>
        <MetricCard
          title={t('government.dashboard.metrics.foodSecurityIndex')}
          value={dashboardData.foodSecurityIndex}
          format="percentage"
          icon={<Award className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.sustainabilityScore')}
          value={dashboardData.sustainabilityScore}
          icon={<Shield className="w-5 h-5 text-teal-500" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.complianceRate')}
          value={dashboardData.complianceRate}
          format="percentage"
          icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          title={t('government.dashboard.metrics.subsidyDistributed')}
          value={dashboardData.subsidyDistributed}
          format="currency"
          icon={<DollarSign className="w-5 h-5 text-orange-500" />}
        />
      </DashboardSection>

      {/* Regional Statistics */}
      <DashboardSection title={t('government.dashboard.sections.regionalStats')} cols={3}>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">{t('government.dashboard.metrics.registeredFarmers')}</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US').format(dashboardData.registeredFarmers)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{t('government.dashboard.stats.totalRegistered')}</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">{t('government.dashboard.metrics.totalProduction')}</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US').format(dashboardData.totalProduction)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{t('government.dashboard.stats.tonsProduced')}</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">{t('government.dashboard.metrics.exportVolume')}</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US').format(dashboardData.exportVolume)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">{t('government.dashboard.stats.tonsExported')}</p>
        </div>
      </DashboardSection>
    </div>
  );
}

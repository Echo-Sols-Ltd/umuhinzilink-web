'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InteractiveChart, ChartDataPoint } from './InteractiveChart';
import { analyticsService, DashboardMetrics, AnalyticsFilters } from '@/services/analytics';
import { toast } from '@/components/ui/use-toast-new';

export interface EnhancedDashboardProps {
  userRole: 'farmer' | 'buyer' | 'supplier' | 'admin' | 'government';
  orders?: any[];
  products?: any[];
  className?: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

export function EnhancedDashboard({
  userRole,
  orders = [],
  products = [],
  className,
}: EnhancedDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: '30d',
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      let dashboardMetrics: DashboardMetrics | null = null;

      try {
        switch (userRole) {
          case 'farmer':
            dashboardMetrics = await analyticsService.getFarmerDashboardMetrics(filters);
            break;
          case 'buyer':
            dashboardMetrics = await analyticsService.getBuyerDashboardMetrics(filters);
            break;
          case 'supplier':
            dashboardMetrics = await analyticsService.getSupplierDashboardMetrics(filters);
            break;
          case 'admin':
            dashboardMetrics = await analyticsService.getAdminDashboardMetrics(filters);
            break;
          case 'government':
            dashboardMetrics = await analyticsService.getGovernmentDashboardMetrics(filters);
            break;
          default:
            throw new Error('Invalid user role');
        }
      } catch (apiError) {
        console.warn('API call failed, using fallback metrics:', apiError);
        dashboardMetrics = null;
      }

      // Use fallback metrics if API call failed or returned null
      if (!dashboardMetrics) {
        dashboardMetrics = processFallbackMetrics();
        setError('Using local data - API unavailable');
      }

      setMetrics(dashboardMetrics);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setError('Failed to load dashboard data');
      
      // Always provide fallback metrics to prevent crashes
      const fallbackMetrics = processFallbackMetrics();
      setMetrics(fallbackMetrics);
    } finally {
      setLoading(false);
    }
  };

  // Process fallback metrics from local data
  const processFallbackMetrics = (): DashboardMetrics => {
    const safeOrders = orders || [];
    const safeProducts = products || [];
    
    const calculatedMetrics = analyticsService.calculateMetrics(safeOrders, safeProducts);
    const revenueData = analyticsService.processRevenueData(safeOrders, filters.period || '30d');
    const productPerformance = analyticsService.processProductPerformance(safeProducts, safeOrders);
    const regionStats = analyticsService.processRegionalData(safeOrders);

    return {
      totalRevenue: calculatedMetrics?.totalRevenue || 0,
      totalOrders: safeOrders.length || 0,
      totalProducts: safeProducts.length || 0,
      activeProducts: safeProducts.filter(p => p?.productStatus?.toLowerCase() === 'in_stock').length || 0,
      pendingOrders: safeOrders.filter(o => o?.status?.toLowerCase() === 'pending').length || 0,
      completedOrders: safeOrders.filter(o => 
        ['completed', 'delivered'].includes(o?.status?.toLowerCase() || '')
      ).length || 0,
      uniqueCustomers: new Set(safeOrders.map(o => o?.buyer?.id || o?.buyer?.email).filter(Boolean)).size || 0,
      averageOrderValue: calculatedMetrics?.averageOrderValue || 0,
      monthlyRevenue: (revenueData || []).map(d => ({
        month: d?.name || 'Unknown',
        revenue: d?.value || 0,
        orders: safeOrders.filter(o => 
          o?.createdAt && new Date(o.createdAt).toLocaleDateString() === d?.name
        ).length || 0,
      })),
      topProducts: (productPerformance || []).map(p => ({
        id: p?.name || 'unknown',
        name: p?.name || 'Unknown Product',
        sales: p?.sales || 0,
        revenue: p?.revenue || 0,
      })),
      regionStats: (regionStats || []).map(r => ({
        region: r?.name || 'Unknown Region',
        orders: r?.orders || 0,
        revenue: r?.revenue || 0,
      })),
      recentActivity: safeOrders.slice(-5).map(order => ({
        type: 'order',
        description: `New order for ${order?.product?.name || 'product'}`,
        timestamp: order?.createdAt || new Date().toISOString(),
      })) || [],
    };
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [filters, autoRefresh]);

  // Metric cards configuration
  const metricCards: MetricCard[] = useMemo(() => {
    if (!metrics) return [];

    // Safe number formatting with fallback
    const safeNumber = (value: number | undefined | null): string => {
      return (value || 0).toLocaleString();
    };

    const cards: MetricCard[] = [
      {
        title: 'Total Revenue',
        value: `RWF ${safeNumber(metrics.totalRevenue)}`,
        icon: <DollarSign className="w-5 h-5" />,
        description: 'All-time earnings',
      },
      {
        title: 'Total Orders',
        value: safeNumber(metrics.totalOrders),
        icon: <ShoppingCart className="w-5 h-5" />,
        description: `${safeNumber(metrics.pendingOrders)} pending`,
      },
    ];

    if (userRole === 'farmer' || userRole === 'supplier') {
      cards.push({
        title: 'Active Products',
        value: safeNumber(metrics.activeProducts),
        icon: <Package className="w-5 h-5" />,
        description: `${safeNumber(metrics.totalProducts)} total listings`,
      });
    }

    if (userRole === 'buyer') {
      cards.push({
        title: 'Purchases',
        value: safeNumber(metrics.completedOrders),
        icon: <ShoppingCart className="w-5 h-5" />,
        description: 'Completed orders',
      });
    }

    cards.push({
      title: userRole === 'buyer' ? 'Favorite Sellers' : 'Customers',
      value: safeNumber(metrics.uniqueCustomers),
      icon: <Users className="w-5 h-5" />,
      description: 'Unique connections',
    });

    return cards;
  }, [metrics, userRole]);

  // Chart data preparation
  const revenueChartData: ChartDataPoint[] = useMemo(() => {
    if (!metrics?.monthlyRevenue) return [];
    return metrics.monthlyRevenue.map(item => ({
      name: item.month,
      value: item.revenue,
      orders: item.orders,
    }));
  }, [metrics]);

  const productChartData: ChartDataPoint[] = useMemo(() => {
    if (!metrics?.topProducts) return [];
    return metrics.topProducts.slice(0, 5).map(product => ({
      name: product.name,
      value: product.revenue,
      sales: product.sales,
    }));
  }, [metrics]);

  const regionChartData: ChartDataPoint[] = useMemo(() => {
    if (!metrics?.regionStats) return [];
    return metrics.regionStats.slice(0, 6).map(region => ({
      name: region.region,
      value: region.orders,
      revenue: region.revenue,
    }));
  }, [metrics]);

  // Event handlers
  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setFilters(prev => ({
      ...prev,
      dateRange: dateRange ? {
        from: dateRange.from!,
        to: dateRange.to || dateRange.from!,
      } : undefined,
    }));
  };

  const handlePeriodChange = (period: string) => {
    setFilters(prev => ({
      ...prev,
      period: period as AnalyticsFilters['period'],
    }));
  };

  const handleExportData = (data: ChartDataPoint[], format: 'csv' | 'json') => {
    const filename = `dashboard-${userRole}-${new Date().toISOString().split('T')[0]}`;
    if (format === 'csv') {
      analyticsService.exportToCSV(data, filename);
    } else {
      analyticsService.exportToJSON(data, filename);
    }
    toast.success(`Data exported as ${format.toUpperCase()}`, {
      title: 'Export Successful',
    });
  };

  const handleRefresh = () => {
    analyticsService.clearCache();
    fetchMetrics();
    toast.success('Latest data has been loaded', {
      title: 'Dashboard Refreshed',
    });
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          {error && (
            <Badge variant="destructive" className="text-xs">
              Using cached data
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={filters.period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  {card.description && (
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
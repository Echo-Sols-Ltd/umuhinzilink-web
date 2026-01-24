import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeProducts: number;
  pendingOrders: number;
  completedOrders: number;
  uniqueCustomers: number;
  averageOrderValue: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>;
  regionStats: Array<{ region: string; orders: number; revenue: number }>;
  recentActivity: Array<{ type: string; description: string; timestamp: string }>;
}

export interface AnalyticsFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  period?: '7d' | '30d' | '90d' | '1y';
  region?: string;
  productCategory?: string;
}

class AnalyticsService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, filters?: AnalyticsFilters): string {
    return `${endpoint}_${JSON.stringify(filters || {})}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async fetchWithCache<T>(
    endpoint: string,
    filters?: AnalyticsFilters
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    const params = new URLSearchParams();
    if (filters?.dateRange) {
      params.append('from', filters.dateRange.from.toISOString());
      params.append('to', filters.dateRange.to.toISOString());
    }
    if (filters?.period) {
      params.append('period', filters.period);
    }
    if (filters?.region) {
      params.append('region', filters.region);
    }
    if (filters?.productCategory) {
      params.append('category', filters.productCategory);
    }

    const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data as T;
  }

  async getFarmerDashboardMetrics(filters?: AnalyticsFilters): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>(
      API_ENDPOINTS.DASHBOARD.FARMER_STATS,
      filters
    );
  }

  async getBuyerDashboardMetrics(filters?: AnalyticsFilters): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>(
      API_ENDPOINTS.DASHBOARD.BUYER_STATS,
      filters
    );
  }

  async getSupplierDashboardMetrics(filters?: AnalyticsFilters): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>(
      API_ENDPOINTS.DASHBOARD.SUPPLIER_STATS,
      filters
    );
  }

  async getAdminDashboardMetrics(filters?: AnalyticsFilters): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>(
      '/admin/dashboard/stats',
      filters
    );
  }

  async getGovernmentDashboardMetrics(filters?: AnalyticsFilters): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>(
      '/government/dashboard/stats',
      filters
    );
  }

  // Real-time data processing utilities
  processRevenueData(
    orders: any[],
    period: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Array<{ name: string; value: number }> {
    const safeOrders = orders || [];
    const now = new Date();
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };

    const days = periodDays[period];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Filter orders within the period
    const filteredOrders = safeOrders.filter(order => {
      try {
        if (!order?.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= now;
      } catch {
        return false;
      }
    });

    // Group by day/week/month based on period
    const groupBy = period === '7d' ? 'day' : period === '30d' ? 'day' : period === '90d' ? 'week' : 'month';
    const groups = new Map<string, number>();

    filteredOrders.forEach(order => {
      try {
        const orderDate = new Date(order.createdAt);
        let key: string;

        if (groupBy === 'day') {
          key = orderDate.toLocaleDateString();
        } else if (groupBy === 'week') {
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          key = weekStart.toLocaleDateString();
        } else {
          key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        }

        const revenue = Number(order?.totalPrice) || 0;
        groups.set(key, (groups.get(key) || 0) + revenue);
      } catch (error) {
        console.warn('Error processing order for revenue data:', error);
      }
    });

    return Array.from(groups.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        try {
          return new Date(a.name).getTime() - new Date(b.name).getTime();
        } catch {
          return 0;
        }
      });
  }

  processProductPerformance(
    products: any[],
    orders: any[]
  ): Array<{ name: string; sales: number; revenue: number }> {
    const safeOrders = orders || [];
    const productStats = new Map<string, { sales: number; revenue: number }>();

    safeOrders.forEach(order => {
      try {
        const productName = order?.product?.name || 'Unknown Product';
        const quantity = Number(order?.quantity) || 0;
        const revenue = Number(order?.totalPrice) || 0;

        const current = productStats.get(productName) || { sales: 0, revenue: 0 };
        productStats.set(productName, {
          sales: current.sales + quantity,
          revenue: current.revenue + revenue,
        });
      } catch (error) {
        console.warn('Error processing order for product performance:', error);
      }
    });

    return Array.from(productStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products
  }

  processRegionalData(
    orders: any[]
  ): Array<{ name: string; orders: number; revenue: number }> {
    const safeOrders = orders || [];
    const regionStats = new Map<string, { orders: number; revenue: number }>();

    safeOrders.forEach(order => {
      try {
        const region = order?.buyer?.address?.district || 
                      order?.product?.farmer?.user?.address?.district || 
                      'Unknown Region';
        const revenue = Number(order?.totalPrice) || 0;

        const current = regionStats.get(region) || { orders: 0, revenue: 0 };
        regionStats.set(region, {
          orders: current.orders + 1,
          revenue: current.revenue + revenue,
        });
      } catch (error) {
        console.warn('Error processing order for regional data:', error);
      }
    });

    return Array.from(regionStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  calculateMetrics(orders: any[], products: any[]): {
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
    growthRate: number;
  } {
    const safeOrders = orders || [];
    const safeProducts = products || [];
    
    const totalRevenue = safeOrders.reduce((sum, order) => {
      const price = Number(order?.totalPrice) || 0;
      return sum + price;
    }, 0);
    
    const averageOrderValue = safeOrders.length > 0 ? totalRevenue / safeOrders.length : 0;

    // Calculate conversion rate (orders vs product views - simplified)
    const conversionRate = safeProducts.length > 0 ? (safeOrders.length / safeProducts.length) * 100 : 0;

    // Calculate growth rate (comparing last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentOrders = safeOrders.filter(order => {
      try {
        return order?.createdAt && new Date(order.createdAt) >= thirtyDaysAgo;
      } catch {
        return false;
      }
    });
    
    const previousOrders = safeOrders.filter(order => {
      try {
        if (!order?.createdAt) return false;
        const date = new Date(order.createdAt);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      } catch {
        return false;
      }
    });

    const recentRevenue = recentOrders.reduce((sum, order) => {
      const price = Number(order?.totalPrice) || 0;
      return sum + price;
    }, 0);
    
    const previousRevenue = previousOrders.reduce((sum, order) => {
      const price = Number(order?.totalPrice) || 0;
      return sum + price;
    }, 0);

    const growthRate = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalRevenue,
      averageOrderValue,
      conversionRate,
      growthRate,
    };
  }

  // Export data functionality
  exportToCSV(data: any[], filename: string): void {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToJSON(data: any[], filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Clear cache (useful for real-time updates)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache status for debugging
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const analyticsService = new AnalyticsService();
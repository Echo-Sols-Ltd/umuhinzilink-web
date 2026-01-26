'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Leaf,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  EnhancedMetricCard, 
  MetricGrid, 
  farmerMetrics 
} from '@/components/ui/enhanced-metric-cards';
import {
  RevenueTrendChart,
  ProductPerformanceChart,
  RegionalDistributionChart,
  QuickStats,
} from '@/components/ui/enhanced-dashboard-visualizations';
import { cn } from '@/lib/utils';

export interface EnhancedFarmerDashboardProps {
  orders?: any[];
  products?: any[];
  loading?: boolean;
  className?: string;
}

export function EnhancedFarmerDashboard({
  orders = [],
  products = [],
  loading = false,
  className,
}: EnhancedFarmerDashboardProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const activeProducts = products.filter(p => p?.productStatus?.toLowerCase() === 'in_stock').length;
    const pendingOrders = orders.filter(o => o?.status?.toLowerCase() === 'pending').length;
    const completedOrders = orders.filter(o => 
      ['completed', 'delivered'].includes(o?.status?.toLowerCase() || '')
    ).length;
    const uniqueCustomers = new Set(orders.map(o => o?.buyer?.id).filter(Boolean)).size;

    return {
      totalRevenue,
      activeProducts,
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      uniqueCustomers,
    };
  }, [orders, products]);

  // Prepare chart data
  const revenueData = useMemo(() => {
    const monthlyData = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach(month => monthlyData.set(month, 0));
    
    // Aggregate revenue by month
    orders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const month = months[date.getMonth()];
        const current = monthlyData.get(month) || 0;
        monthlyData.set(month, current + (Number(order.totalPrice) || 0));
      }
    });

    return months.map(month => ({
      name: month,
      value: monthlyData.get(month) || 0,
    }));
  }, [orders]);

  const productData = useMemo(() => {
    return products
      .slice(0, 5)
      .map(product => ({
        name: product.name || 'Unknown',
        value: Number(product.unitPrice) || 0,
        sales: orders.filter(o => o.product?.id === product.id).length,
      }));
  }, [products, orders]);

  const regionData = useMemo(() => {
    const regionCounts = new Map();
    orders.forEach(order => {
      const region = order.buyer?.address?.district || 'Unknown';
      regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
    });

    return Array.from(regionCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  const quickStats = [
    {
      label: 'Today\'s Orders',
      value: orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt || '').toDateString() === today;
      }).length,
      trend: 'up' as const,
      change: 12,
    },
    {
      label: 'This Week',
      value: `RWF ${(metrics.totalRevenue * 0.1).toLocaleString()}`,
      trend: 'up' as const,
      change: 8,
    },
    {
      label: 'Low Stock',
      value: products.filter(p => p?.productStatus?.toLowerCase() === 'low_stock').length,
      trend: 'neutral' as const,
    },
    {
      label: 'Avg. Order',
      value: `RWF ${Math.round(metrics.totalRevenue / (metrics.totalOrders || 1)).toLocaleString()}`,
      trend: 'up' as const,
      change: 5,
    },
  ];

  const metricCards = [
    farmerMetrics.totalRevenue(metrics.totalRevenue, 15),
    farmerMetrics.activeProducts(metrics.activeProducts, metrics.totalProducts),
    farmerMetrics.totalOrders(metrics.totalOrders, metrics.pendingOrders),
    farmerMetrics.customers(metrics.uniqueCustomers),
  ];

  const recentProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Stats */}
      <QuickStats stats={quickStats} />

      {/* Main Metrics */}
      <MetricGrid 
        metrics={metricCards} 
        columns={4} 
        loading={loading}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart
          title="Revenue Trend"
          data={revenueData}
          loading={loading}
          height={300}
        />
        <ProductPerformanceChart
          title="Top Products"
          data={productData}
          loading={loading}
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegionalDistributionChart
            title="Sales by Region"
            data={regionData}
            loading={loading}
            height={300}
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        New order for {order.product?.name || 'product'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.buyer?.names || 'Customer'} • {' '}
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <Badge variant={
                      order.status?.toLowerCase() === 'completed' ? 'default' :
                      order.status?.toLowerCase() === 'pending' ? 'secondary' : 'outline'
                    }>
                      {order.status || 'Pending'}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Recent Products</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Products
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 font-medium text-gray-600">Updated</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : recentProducts.length > 0 ? (
                  recentProducts.map((product, index) => (
                    <motion.tr
                      key={product.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{product.description?.slice(0, 30) || 'No description'}</p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{product.category || 'Uncategorized'}</td>
                      <td className="py-4 font-medium text-gray-900">
                        RWF {(Number(product.unitPrice) || 0).toLocaleString()}
                      </td>
                      <td className="py-4 text-gray-600">
                        {product.quantity || 0} {product.measurementUnit || 'units'}
                      </td>
                      <td className="py-4">
                        <Badge variant={
                          product.productStatus?.toLowerCase() === 'in_stock' ? 'default' :
                          product.productStatus?.toLowerCase() === 'low_stock' ? 'secondary' : 'outline'
                        }>
                          {product.productStatus?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="py-4 text-gray-600">
                        {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
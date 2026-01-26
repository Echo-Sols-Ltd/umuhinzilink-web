'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Store,
  TrendingUp,
  Package,
  MapPin,
  Star,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  EnhancedMetricCard, 
  MetricGrid, 
  buyerMetrics 
} from '@/components/ui/enhanced-metric-cards';
import {
  RevenueTrendChart,
  ProductPerformanceChart,
  RegionalDistributionChart,
  QuickStats,
} from '@/components/ui/enhanced-dashboard-visualizations';
import { cn } from '@/lib/utils';

export interface EnhancedBuyerDashboardProps {
  orders?: any[];
  products?: any[];
  savedProducts?: any[];
  loading?: boolean;
  className?: string;
}

export function EnhancedBuyerDashboard({
  orders = [],
  products = [],
  savedProducts = [],
  loading = false,
  className,
}: EnhancedBuyerDashboardProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const completedOrders = orders.filter(o => 
      ['completed', 'delivered'].includes(o?.status?.toLowerCase() || '')
    ).length;
    const pendingOrders = orders.filter(o => o?.status?.toLowerCase() === 'pending').length;
    const uniqueSuppliers = new Set(orders.map(o => o?.product?.farmer?.id).filter(Boolean)).size;

    return {
      totalSpent,
      totalOrders: orders.length,
      completedOrders,
      pendingOrders,
      savedProducts: savedProducts.length,
      uniqueSuppliers,
    };
  }, [orders, savedProducts]);

  // Prepare chart data
  const spendingData = useMemo(() => {
    const monthlyData = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    months.forEach(month => monthlyData.set(month, 0));
    
    // Aggregate spending by month
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

  const categoryData = useMemo(() => {
    const categorySpending = new Map();
    orders.forEach(order => {
      const category = order.product?.category || 'Other';
      const current = categorySpending.get(category) || 0;
      categorySpending.set(category, current + (Number(order.totalPrice) || 0));
    });

    return Array.from(categorySpending.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  const supplierData = useMemo(() => {
    const supplierOrders = new Map();
    orders.forEach(order => {
      const supplier = order.product?.farmer?.user?.names || 'Unknown Supplier';
      supplierOrders.set(supplier, (supplierOrders.get(supplier) || 0) + 1);
    });

    return Array.from(supplierOrders.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  const quickStats = [
    {
      label: 'This Month',
      value: `RWF ${(metrics.totalSpent * 0.3).toLocaleString()}`,
      trend: 'up' as const,
      change: 15,
    },
    {
      label: 'Pending Orders',
      value: metrics.pendingOrders,
      trend: 'neutral' as const,
    },
    {
      label: 'Avg. Order Value',
      value: `RWF ${Math.round(metrics.totalSpent / (metrics.totalOrders || 1)).toLocaleString()}`,
      trend: 'up' as const,
      change: 8,
    },
    {
      label: 'Delivery Rate',
      value: `${Math.round((metrics.completedOrders / (metrics.totalOrders || 1)) * 100)}%`,
      trend: 'up' as const,
      change: 5,
    },
  ];

  const metricCards = [
    buyerMetrics.totalSpent(metrics.totalSpent, 12),
    buyerMetrics.totalOrders(metrics.totalOrders, metrics.completedOrders),
    buyerMetrics.savedProducts(metrics.savedProducts),
    buyerMetrics.suppliers(metrics.uniqueSuppliers),
  ];

  const recommendedProducts = products.slice(0, 8);
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
          title="Spending Trend"
          data={spendingData}
          loading={loading}
          height={300}
        />
        <ProductPerformanceChart
          title="Spending by Category"
          data={categoryData}
          loading={loading}
          height={300}
        />
      </div>

      {/* Product Discovery Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Discover Products</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : recommendedProducts.length > 0 ? (
              recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="relative h-32 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
                      {product.name || 'Unknown Product'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      by {product.farmer?.user?.names || 'Unknown Farmer'}
                    </p>
                    <div className="flex items-center space-x-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-green-600 text-sm">
                          RWF {(Number(product.unitPrice) || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          per {product.measurementUnit || 'unit'}
                        </p>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Contact
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No products available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegionalDistributionChart
            title="Orders by Supplier"
            data={supplierData}
            loading={loading}
            height={300}
          />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Recent Orders</span>
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
                        {order.product?.name || 'Product'}
                      </p>
                      <p className="text-xs text-gray-500">
                        from {order.product?.farmer?.user?.names || 'Farmer'} • {' '}
                        RWF {(Number(order.totalPrice) || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
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
                  <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span>Saved Products</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              View All Saved
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-32 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : savedProducts.length > 0 ? (
              savedProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-24 bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {product.name || 'Unknown Product'}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      RWF {(Number(product.unitPrice) || 0).toLocaleString()}
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Contact Seller
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No saved products yet</p>
                <p className="text-gray-400 text-sm">Save products you're interested in</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Users,
  Clock,
  Plus,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { ResponsiveGrid, MobileOptimizedCard, TouchOptimizedButton } from './responsive-layout';
import { ProgressiveImage } from './progressive-loading';

interface MobileDashboardProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  recentProducts?: any[];
  recentOrders?: any[];
  onAddProduct?: () => void;
  onViewProducts?: () => void;
  onViewOrders?: () => void;
}

export function MobileDashboard({
  stats,
  recentProducts = [],
  recentOrders = [],
  onAddProduct,
  onViewProducts,
  onViewOrders,
}: MobileDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <ResponsiveGrid cols={{ sm: 2, md: 4 }} gap="gap-4">
        <MobileStatCard
          title="Products"
          value={stats.totalProducts}
          icon={<Package className="w-5 h-5" />}
          color="bg-green-100 text-green-600"
        />
        <MobileStatCard
          title="Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="bg-blue-100 text-blue-600"
        />
        <MobileStatCard
          title="Revenue"
          value={`${stats.totalRevenue.toLocaleString()} RWF`}
          icon={<DollarSign className="w-5 h-5" />}
          color="bg-yellow-100 text-yellow-600"
        />
        <MobileStatCard
          title="Pending"
          value={stats.pendingOrders}
          icon={<Clock className="w-5 h-5" />}
          color="bg-red-100 text-red-600"
        />
      </ResponsiveGrid>

      {/* Quick Actions */}
      <MobileOptimizedCard title="Quick Actions">
        <div className="grid grid-cols-2 gap-3">
          <TouchOptimizedButton
            onClick={onAddProduct}
            variant="primary"
            className="flex flex-col items-center space-y-2 py-4"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Add Product</span>
          </TouchOptimizedButton>
          <TouchOptimizedButton
            onClick={onViewProducts}
            variant="outline"
            className="flex flex-col items-center space-y-2 py-4"
          >
            <Eye className="w-6 h-6" />
            <span className="text-sm">View Products</span>
          </TouchOptimizedButton>
        </div>
      </MobileOptimizedCard>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <MobileOptimizedCard 
          title="Recent Products"
          actions={
            <TouchOptimizedButton
              onClick={onViewProducts}
              variant="outline"
              size="sm"
            >
              View All
            </TouchOptimizedButton>
          }
        >
          <div className="space-y-3">
            {recentProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name || 'Product Name'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.quantity || 0} {product.measurementUnit || 'units'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {product.unitPrice || 0} RWF
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.productStatus || 'Available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MobileOptimizedCard>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <MobileOptimizedCard 
          title="Recent Orders"
          actions={
            <TouchOptimizedButton
              onClick={onViewOrders}
              variant="outline"
              size="sm"
            >
              View All
            </TouchOptimizedButton>
          }
        >
          <div className="space-y-3">
            {recentOrders.slice(0, 3).map((order, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Order #{order.id || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.quantity || 0} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {order.totalPrice || 0} RWF
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.status || 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MobileOptimizedCard>
      )}
    </div>
  );
}

interface MobileStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function MobileStatCard({ title, value, icon, color }: MobileStatCardProps) {
  return (
    <MobileOptimizedCard title="" className="p-0">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </MobileOptimizedCard>
  );
}
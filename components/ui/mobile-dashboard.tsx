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
            <TouchOptimizedB
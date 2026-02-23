'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/contexts/guard/AdminGuard';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  ChevronLeft,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  users: {
    current: number;
    previous: number;
    growth: number;
  };
  products: {
    current: number;
    previous: number;
    growth: number;
  };
  topProducts: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
  topFarmers: Array<{
    name: string;
    revenue: number;
    orders: number;
    products: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
}

function RevenueAnalytics() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        revenue: {
          current: 125000,
          previous: 100000,
          growth: 25,
        },
        orders: {
          current: 1250,
          previous: 1000,
          growth: 25,
        },
        users: {
          current: 2500,
          previous: 2000,
          growth: 25,
        },
        products: {
          current: 500,
          previous: 400,
          growth: 25,
        },
        topProducts: [
          { name: 'Fresh Tomatoes', revenue: 15000, orders: 150 },
          { name: 'Organic Lettuce', revenue: 12000, orders: 120 },
          { name: 'Farm Eggs', revenue: 10000, orders: 100 },
        ],
        topFarmers: [
          { name: 'Green Valley Farm', revenue: 25000, orders: 250, products: 15 },
          { name: 'Sunshine Acres', revenue: 20000, orders: 200, products: 12 },
          { name: 'Happy Harvest', revenue: 18000, orders: 180, products: 10 },
        ],
        monthlyData: [
          { month: 'Jan', revenue: 20000, orders: 200, users: 400 },
          { month: 'Feb', revenue: 22000, orders: 220, users: 440 },
          { month: 'Mar', revenue: 25000, orders: 250, users: 500 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${(analytics.revenue.current || 0).toLocaleString()}`,
      change: `${analytics.revenue.growth > 0 ? '+' : ''}${analytics.revenue.growth || 0}%`,
      changeType: analytics.revenue.growth > 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: (analytics.orders.current || 0).toLocaleString(),
      change: `${analytics.orders.growth > 0 ? '+' : ''}${analytics.orders.growth || 0}%`,
      changeType: analytics.orders.growth > 0 ? 'positive' : 'negative',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: (analytics.users.current || 0).toLocaleString(),
      change: `${analytics.users.growth > 0 ? '+' : ''}${analytics.users.growth || 0}%`,
      changeType: analytics.users.growth > 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Products Listed',
      value: (analytics.products.current || 0).toLocaleString(),
      change: `${analytics.products.growth > 0 ? '+' : ''}${analytics.products.growth || 0}%`,
      changeType: analytics.products.growth > 0 ? 'positive' : 'negative',
      icon: Package,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Analytics'
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            <p className="text-xs text-gray-500">Revenue insights and platform metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-white p-6 space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last period</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
              <div className="h-64 flex items-center justify-center bg-white rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue chart visualization</p>
                  <p className="text-sm text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h2>
              <div className="h-64 flex items-center justify-center bg-white rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Orders chart visualization</p>
                  <p className="text-sm text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products and Farmers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-800">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Farmers */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Farmers</h2>
              <div className="space-y-4">
                {analytics.topFarmers.map((farmer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{farmer.name}</p>
                        <p className="text-sm text-gray-500">{farmer.products} products</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${farmer.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{farmer.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Data Table */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      MONTH
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      REVENUE
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      ORDERS
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      NEW USERS
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      AVG ORDER VALUE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.monthlyData.map((month, index) => (
                    <tr key={index} className="hover:bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(month.revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(month.orders || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(month.users || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(month.revenue / month.orders).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminGuard>
      <RevenueAnalytics />
    </AdminGuard>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  monthlyData: {
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }[];
  topProducts: {
    name: string;
    orders: number;
    revenue: number;
    farmer: string;
  }[];
  topFarmers: {
    name: string;
    orders: number;
    revenue: number;
    products: number;
  }[];
}

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Temporarily bypass authentication for admin dashboard access
        // const user = await getCurrentUser();
        // if (user?.role !== 'ADMIN') {
        //   window.location.href = '/unauthorized';
        //   return;
        // }
        // setCurrentUser(user);
      } catch (error) {
        // window.location.href = '/auth/signin';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function RevenueAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    // Mock analytics data - replace with actual API calls
    setAnalytics({
      revenue: {
        current: 284750,
        previous: 245000,
        growth: 16.2,
      },
      orders: {
        current: 3421,
        previous: 2987,
        growth: 14.5,
      },
      users: {
        current: 1247,
        previous: 1089,
        growth: 14.5,
      },
      products: {
        current: 892,
        previous: 756,
        growth: 18.0,
      },
      monthlyData: [
        { month: 'Jan', revenue: 45000, orders: 520, users: 980 },
        { month: 'Feb', revenue: 52000, orders: 610, users: 1050 },
        { month: 'Mar', revenue: 61000, orders: 720, users: 1120 },
        { month: 'Apr', revenue: 58000, orders: 680, users: 1180 },
        { month: 'May', revenue: 68750, orders: 891, users: 1247 },
      ],
      topProducts: [
        { name: 'Fresh Tomatoes', orders: 145, revenue: 8750, farmer: 'John Farmer' },
        { name: 'Organic Lettuce', orders: 98, revenue: 5400, farmer: 'Jane Farmer' },
        { name: 'Fresh Carrots', orders: 87, revenue: 4200, farmer: 'John Farmer' },
        { name: 'Green Peppers', orders: 76, revenue: 3800, farmer: 'Mike Farmer' },
        { name: 'Fresh Onions', orders: 65, revenue: 3200, farmer: 'Sarah Farmer' },
      ],
      topFarmers: [
        { name: 'John Farmer', orders: 232, revenue: 12950, products: 3 },
        { name: 'Jane Farmer', orders: 98, revenue: 5400, products: 2 },
        { name: 'Mike Farmer', orders: 76, revenue: 3800, products: 4 },
        { name: 'Sarah Farmer', orders: 65, revenue: 3200, products: 2 },
        { name: 'David Farmer', orders: 54, revenue: 2800, products: 3 },
      ],
    });
  }, []);

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
      value: `$${analytics.revenue.current.toLocaleString()}`,
      change: `${analytics.revenue.growth > 0 ? '+' : ''}${analytics.revenue.growth}%`,
      changeType: analytics.revenue.growth > 0 ? 'positive' : 'negative',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: analytics.orders.current.toLocaleString(),
      change: `${analytics.orders.growth > 0 ? '+' : ''}${analytics.orders.growth}%`,
      changeType: analytics.orders.growth > 0 ? 'positive' : 'negative',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: analytics.users.current.toLocaleString(),
      change: `${analytics.users.growth > 0 ? '+' : ''}${analytics.users.growth}%`,
      changeType: analytics.users.growth > 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Products Listed',
      value: analytics.products.current.toLocaleString(),
      change: `${analytics.products.growth > 0 ? '+' : ''}${analytics.products.growth}%`,
      changeType: analytics.products.growth > 0 ? 'positive' : 'negative',
      icon: Package,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Revenue Analytics</h1>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
        </div>
      </header>

      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart visualization</p>
                <p className="text-sm text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
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
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-800">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.farmer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Farmers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Farmers</h2>
            <div className="space-y-4">
              {analytics.topFarmers.map((farmer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
        <div className="bg-white rounded-xl shadow-sm p-6 border mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.monthlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${month.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.users.toLocaleString()}
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
  );
}

export default function AnalyticsPage() {
  return (
    <AdminGuard>
      <RevenueAnalytics />
    </AdminGuard>
  );
}

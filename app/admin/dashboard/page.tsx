'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Users,
  User as UserIcon,
  Settings,
  Search,
  Wallet,
  LogOut,
  Menu,
  X,
  Eye,
  Trash2,
  Loader2,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast-new';
import AdminNavbar from '@/components/admin/Navbar';
import { AdminPages } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';

interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeListings: number;
}

interface TableUser {
  type: string;
  name: string;
  address: string;
  date: string;
  lastActivity: string;
  status: 'Active' | 'Processing' | 'Inactive';
}

function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { users, products, orders, loading, userStats, productStats, orderStats, deleteUser } =
    useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout', {
        title: 'Error',
      });
    }
  };

  // Chart data for doughnut chart
  const chartData = [
    { name: 'Farmers', value: userStats.farmerCount, color: '#16a34a' },
    { name: 'Suppliers', value: userStats.supplierCount, color: '#22c55e' },
    { name: 'Buyers', value: userStats.buyerCount, color: '#86efac' },
  ];

  // Total value for the chart center
  const totalValue = userStats.totalUsers;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Green */}
      <AdminNavbar
        activePage={AdminPages.DASHBOARD}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - White with Search */}
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </header>

        {/* Enhanced Dashboard Content */}
        <main className="flex-1 bg-white p-6">
          {/* Beautiful Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Users Card - Featured */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold">{(userStats?.totalUsers || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-green-100 text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>Farmers: {userStats?.farmerCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Buyers: {userStats?.buyerCount || 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{productStats.totalProducts}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  In Stock: {productStats.inStockCount}
                </span>
                <div className="flex items-center space-x-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  orderStats.pendingCount > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  Pending: {orderStats.pendingCount}
                </span>
                <div className="flex items-center space-x-1 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-medium">Processing</span>
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Platform Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">RWF {(Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total transactions</span>
                <div className="flex items-center space-x-1 text-orange-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Distribution Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">User growth and engagement metrics</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    This Month
                  </button>
                </div>
              </div>
              
              {/* Growth Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">+{Math.floor(Math.random() * 50) + 10}%</p>
                  <p className="text-sm text-gray-600">User Growth</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">+{Math.floor(Math.random() * 30) + 15}%</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">+{Math.floor(Math.random() * 40) + 20}%</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
              </div>

              {/* User Type Distribution */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">User Distribution</h4>
                {[
                  { name: 'Farmers', count: userStats.farmerCount, color: 'bg-green-500', percentage: Math.round((userStats.farmerCount / userStats.totalUsers) * 100) },
                  { name: 'Buyers', count: userStats.buyerCount, color: 'bg-blue-500', percentage: Math.round((userStats.buyerCount / userStats.totalUsers) * 100) },
                  { name: 'Suppliers', count: userStats.supplierCount, color: 'bg-purple-500', percentage: Math.round((userStats.supplierCount / userStats.totalUsers) * 100) },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-gray-700">{item.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm font-medium text-gray-900">{item.count}</div>
                    <div className="w-12 text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Types</h3>
              <div className="flex items-center">
                <div className="relative flex-1 max-w-[200px]">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {(totalValue || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-1 rounded`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{(item.value || 0).toLocaleString()}+</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Users</h2>
              {loading && <Loader2 className="w-5 h-5 animate-spin text-green-600" />}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users && users.length > 0 ? (
                    users.slice(0, 10).map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.names}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            <button className="text-green-600 hover:text-green-800 flex items-center gap-1">
                              <Eye className="w-4 h-4" /> View
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}

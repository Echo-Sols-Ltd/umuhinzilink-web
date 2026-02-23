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
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { AdminPages, UserType } from '@/types';
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
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Dashboard'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">System overview and analytics</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users or analytics..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 bg-white p-6 space-y-6">
          {/* Top Section - Data Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{(userStats?.totalUsers || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>Farmers: {userStats?.farmerCount || 0}</span>
                    <span className="text-gray-300">|</span>
                    <span>Buyers: {userStats?.buyerCount || 0}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{productStats.totalProducts}</p>
                  <p className="text-xs text-green-600 mt-1">In Stock: {productStats.inStockCount}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{orderStats.totalOrders}</p>
                  <p className="text-xs text-amber-600 mt-1">Pending: {orderStats.pendingCount}</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suppliers</p>
                  <p className="text-2xl font-semibold text-gray-900">{userStats?.supplierCount || 0}</p>
                  <p className="text-xs text-purple-600 mt-1">Active partners</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          {/* User Distribution Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
            <div className="flex items-center w-full">
              <div className="relative flex-1 max-w-full">
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
                  <p className="text-2xl font-semibold text-gray-900">
                    {(totalValue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
              <div className="ml-6 space-y-3 flex-1">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{(item.value || 0).toLocaleString()} users</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Users Registry
                {loading && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-gray-600 uppercase ">Role</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-gray-600 uppercase ">Name</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-gray-600 uppercase ">Contact</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-gray-600 uppercase ">Status</th>
                    <th className="text-right py-3 px-6 font-semibold text-xs text-gray-600 uppercase ">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
                          <span>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users?.data && users.data?.length > 0 ? (
                    users.data.slice(0, 10).map(user => (
                      <tr key={user.id} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{user.names}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">{user.email}</span>
                            <span className="text-xs text-gray-400">{user.phoneNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${user.verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <UserIcon className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-900">No users found</p>
                          <p className="text-sm text-gray-500">There are no users to display at this time.</p>
                        </div>
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

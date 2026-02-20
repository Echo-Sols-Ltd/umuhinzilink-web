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
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Dashboard'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto pb-20">
        {/* Header - White with Search */}
        <header className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users or analytics..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 bg-white p-6 space-y-10">
          {/* Top Section - Data Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Active Users</p>
                  <p className="text-3xl font-bold">{(userStats?.totalUsers || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-medium opacity-90 italic">
                    <span>Farmers: {userStats?.farmerCount || 0}</span>
                    <span className="opacity-40">|</span>
                    <span>Buyers: {userStats?.buyerCount || 0}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Products</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900">{productStats.totalProducts}</p>
                    <span className="text-green-600 font-bold text-[10px] uppercase">
                      In Stock: {productStats.inStockCount}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                    <span className="text-amber-600 font-bold text-[10px] uppercase">
                      Pending: {orderStats.pendingCount}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          {/* Doughnut Chart */}
          <div className="bg-white rounded-lg p-6 border shadow-sm w-full">
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
                  <p className="text-2xl font-bold text-gray-900">
                    {(totalValue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">All Now</p>
                </div>
              </div>
              <div className="ml-6 space-y-3 flex-1">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-1 rounded`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{(item.value || 0).toLocaleString()}+</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Users Registry
                {loading && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-gray-400 uppercase tracking-wider">ROLE</th>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-gray-400 uppercase tracking-wider">NAME</th>
                    <th className="py-4 px-6 font-semibold text-[11px] text-gray-400 uppercase tracking-wider text-center">EMAIL / PHONE</th>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-gray-400 uppercase tracking-wider">VERIFIED</th>
                    <th className="text-right py-4 px-6 font-semibold text-[11px] text-gray-400 uppercase tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users?.data && users.data?.length > 0 ? (
                    users.data.slice(0, 10).map(user => (
                      <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{user.names}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-gray-600 font-medium">{user.email}</span>
                            <span className="text-[10px] text-gray-400">{user.phoneNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${user.verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
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

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
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Dashboard'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">System overview and analytics</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search users or analytics..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 bg-card p-6 space-y-6">
          {/* Top Section - Data Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-semibold text-foreground">{(userStats?.totalUsers || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>Farmers: {userStats?.farmerCount || 0}</span>
                    <span className="text-muted-foreground">|</span>
                    <span>Buyers: {userStats?.buyerCount || 0}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-semibold text-foreground">{productStats.totalProducts}</p>
                  <p className="text-xs text-success mt-1">In Stock: {productStats.inStockCount}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-info" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-semibold text-foreground">{orderStats.totalOrders}</p>
                  <p className="text-xs text-warning mt-1">Pending: {orderStats.pendingCount}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suppliers</p>
                  <p className="text-2xl font-semibold text-foreground">{userStats?.supplierCount || 0}</p>
                  <p className="text-xs text-purple-600 mt-1">Active partners</p>
                </div>
                <div className="w-10 h-10 bg-purple/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          {/* User Distribution Chart */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">User Distribution</h2>
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
                  <p className="text-2xl font-semibold text-foreground">
                    {(totalValue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
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
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{(item.value || 0).toLocaleString()} users</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Users Registry
                {loading && <Loader2 className="w-4 h-4 animate-spin text-success" />}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-muted-foreground uppercase ">Role</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-muted-foreground uppercase ">Name</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-muted-foreground uppercase ">Contact</th>
                    <th className="text-left py-3 px-6 font-semibold text-xs text-muted-foreground uppercase ">Status</th>
                    <th className="text-right py-3 px-6 font-semibold text-xs text-muted-foreground uppercase ">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                          <span>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users?.data && users.data?.length > 0 ? (
                    users.data.slice(0, 10).map(user => (
                      <tr key={user.id} className="hover:bg-card/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-info/10 text-info rounded-md text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{user.names}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                            <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${user.verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                          <UserIcon className="w-12 h-12 text-muted-foreground mb-4" />
                          <p className="text-lg font-medium text-foreground">No users found</p>
                          <p className="text-sm text-muted-foreground">There are no users to display at this time.</p>
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

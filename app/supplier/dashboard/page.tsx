'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Mail,
  Users,
  TrendingUp,
  Search,
  ChevronDown,
  Package,
  BarChart2,
  MessageSquare,
  MoreHorizontal,
  AlertTriangle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useSupplier } from '@/contexts/SupplierContext';
import SupplierSidebar from '@/components/supplier/Navbar';
import { SupplierPages } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

function DashboardComponent() {
  const router = useRouter();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { logout, user } = useAuth();
  const { supplier, dashboardStats, loading, error } = useSupplier();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLogout = () => {
    setLogoutLoading(true);
    logout();
    setLogoutLoading(false);
  };

  // Default values when data is loading or unavailable
  const stats = dashboardStats || {
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    topProducts: []
  };

  const supplierName = supplier?.user?.names || user?.names || 'Supplier';
  const supplierInitials = supplierName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SupplierSidebar
          activePage={SupplierPages.DASHBOARD}
          handleLogout={handleLogout}
          logoutPending={logoutLoading}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64 relative">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className="w-1/2 relative">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-4 pr-10 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-3xl"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                >
                  <span className="text-lg">
                    {languages.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                  <span className="font-medium text-gray-700">
                    {languages.find(lang => lang.code === selectedLanguage)?.name}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{supplierInitials}</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{supplierName}</p>
                  <p className="text-gray-500 text-xs">Supplier</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mt-16">
            {/* Welcome banner */}
            <div className="bg-green-600 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {supplierName}!</h1>
              <p className="text-green-100">
                Manage your agricultural inputs and connect with farmers across Rwanda
              </p>
            </div>

            {/* Beautiful Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Revenue Card - Featured */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold">RWF {(stats.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                  <p className="text-purple-100 text-sm">All-time earnings</p>
                </div>
              </div>

              {/* Inventory Items Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm font-medium">Inventory Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{stats.activeProducts || 0} in stock</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stats.totalProducts > 0 ? ((stats.activeProducts || 0) / stats.totalProducts) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {stats.totalProducts > 0 ? Math.round(((stats.activeProducts || 0) / stats.totalProducts) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (stats.pendingOrders || 0) > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {(stats.pendingOrders || 0) > 0 ? `${stats.pendingOrders} pending` : 'All fulfilled'}
                  </span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* Customers Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 50) + 10}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Unique buyers</span>
                  <div className="flex items-center space-x-1 text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Growing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Inventory Status Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
                    <p className="text-sm text-gray-600 mt-1">Current stock levels and distribution</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      This Month
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Inventory Categories */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.activeProducts || 0}</p>
                    <p className="text-sm text-gray-600">In Stock</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{Math.floor((stats.totalProducts || 0) * 0.2)}</p>
                    <p className="text-sm text-gray-600">Low Stock</p>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{Math.floor((stats.totalProducts || 0) * 0.1)}</p>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                  </div>
                </div>

                {/* Stock Level Bars */}
                <div className="space-y-4">
                  {[
                    { name: 'Seeds & Seedlings', stock: 85, color: 'bg-green-500' },
                    { name: 'Fertilizers', stock: 65, color: 'bg-blue-500' },
                    { name: 'Pesticides', stock: 45, color: 'bg-yellow-500' },
                    { name: 'Tools & Equipment', stock: 30, color: 'bg-red-500' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-32 text-sm font-medium text-gray-700">{item.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.stock}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{item.stock}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center">
                        <FilePlus className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Add New Product</p>
                        <p className="text-sm text-gray-600">Expand your inventory</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                        <BarChart2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">View Analytics</p>
                        <p className="text-sm text-gray-600">Track performance</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Messages</p>
                        <p className="text-sm text-gray-600">Connect with buyers</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Analytics Dashboard */}
            <EnhancedDashboard
              userRole="supplier"
              orders={[]} // Will be populated from supplier context
              products={stats.topProducts || []}
              className="mb-6"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SupplierDashboardPage() {
  return (
    <SupplierGuard>
      <DashboardComponent />
    </SupplierGuard>
  );
}

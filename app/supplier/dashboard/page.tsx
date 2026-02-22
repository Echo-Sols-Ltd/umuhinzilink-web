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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useSupplier } from '@/contexts/SupplierContext';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import { useOrder } from '@/contexts/OrderContext';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

function DashboardComponent() {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { user } = useAuth();
  const { supplier, dashboardStats } = useSupplier();
  const { supplierOrders, loading: ordersLoading, fetchSupplierOrders } = useOrder();

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];


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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='Dashboard'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Supplier Dashboard</h1>
            <p className="text-xs text-gray-500">Manage your agricultural inputs and connect with farmers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-colors">
              <FilePlus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Welcome back, {supplierName}!</h2>
                <p className="text-sm text-gray-600 mt-1">Here's an overview of your business performance</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Enhanced Analytics Dashboard */}
          <EnhancedDashboard
            userRole="supplier"
            orders={[]} // Will be populated from supplier context
            products={stats.topProducts || []}
            className="mb-8"
          />

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-l-4 border-green-500 pl-3">Incoming Orders</h2>
                <p className="text-[10px] text-gray-400 font-medium mt-1 ml-4 uppercase tracking-wider">Latest requests from farmers</p>
              </div>
              <Link
                href="/supplier/orders"
                className="text-[10px] font-bold text-green-600 hover:text-green-700 uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View Registry
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider">Order Reference</th>
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider">Product details</th>
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider text-center">Total Value</th>
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 font-bold text-[11px] text-gray-400 uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ordersLoading ? (
                    [1, 2, 3].map((i) => (
                      <tr key={i}>
                        <td colSpan={6} className="py-4 px-6"><div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div></td>
                      </tr>
                    ))
                  ) : supplierOrders?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                          <ShoppingCart className="w-8 h-8 text-gray-300" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No orders found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    supplierOrders?.slice(0, 5).map((order) => (
                      <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="py-4 px-6 text-xs font-bold text-gray-900 font-mono tracking-tighter">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">
                              {order.buyer.names.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900 leading-none">{order.buyer.names}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{order.buyer.phoneNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-none">{order.product.name}</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{order.quantity} {order.product.measurementUnit}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-xs font-extrabold text-green-700">
                            {Number(order.totalPrice).toLocaleString()} RWF
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border-0 ring-1 ring-inset ${order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                            order.status === 'COMPLETED' ? 'bg-green-50 text-green-600 ring-green-100' :
                              'bg-gray-50 text-gray-600 ring-gray-100'
                            }`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right text-[10px] font-bold text-gray-400 uppercase">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))
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

export default function SupplierDashboardPage() {
  return (
    <SupplierGuard>
      <DashboardComponent />
    </SupplierGuard>
  );
}

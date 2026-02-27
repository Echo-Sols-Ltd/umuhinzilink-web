'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Tractor,
  Truck,
  ShoppingCart,
  Menu,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { useState } from 'react';

function OrderManagement() {
  const { farmerOrders, supplierOrders } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Order Management'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Order Management</h1>
            <p className="text-xs text-gray-500">Monitor and manage all platform orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-white p-6 space-y-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Farmer Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tractor className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-3xl font-semibold text-gray-900">{farmerOrders.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Farmer Orders</h2>
              <p className="text-gray-500 mb-6">
                View and manage orders placed for farm produce.
              </p>
              <Link
                href="/admin/orders/farmer"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
              >
                View Orders <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Supplier Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-3xl font-semibold text-gray-900">{supplierOrders.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Supplier Orders</h2>
              <p className="text-gray-500 mb-6">
                View and manage orders placed for agricultural inputs and supplies.
              </p>
              <Link
                href="/admin/orders/supplier"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                View Orders <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AdminGuard>
      <OrderManagement />
    </AdminGuard>
  );
}

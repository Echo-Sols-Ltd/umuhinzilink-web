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
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Orders'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
        </header>

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Farmer Orders Card */}
            <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Tractor className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{farmerOrders.length}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Farmer Orders</h2>
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
            <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{supplierOrders.length}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Supplier Orders</h2>
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

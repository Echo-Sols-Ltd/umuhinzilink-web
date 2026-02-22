'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Package,
  Sprout,
  Menu,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';

function ProductManagement() {
  const { farmerProducts, supplierProducts } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Products'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Product Management</h1>
            <p className="text-xs text-gray-500">Monitor and manage all platform products</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 space-y-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Farmer Products Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{farmerProducts.length}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Farmer Products</h2>
              <p className="text-gray-500 mb-6">
                Manage crops and products listed by farmers.
              </p>
              <Link
                href="/admin/products/farmer"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
              >
                View Products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Supplier Products Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{supplierProducts.length}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Supplier Products</h2>
              <p className="text-gray-500 mb-6">
                Manage inputs and tools listed by suppliers.
              </p>
              <Link
                href="/admin/products/supplier"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                View Products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AdminGuard>
      <ProductManagement />
    </AdminGuard>
  );
}
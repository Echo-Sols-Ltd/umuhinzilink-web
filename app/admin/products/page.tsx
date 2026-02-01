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
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Products'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Product Management</h1>
        </header>

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Farmer Products Card */}
            <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
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
            <div className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
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
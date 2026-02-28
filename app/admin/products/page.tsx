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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Product Management'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Product Management</h1>
            <p className="text-xs text-muted-foreground">Monitor and manage all platform products</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-background p-6 space-y-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Farmer Products Card */}
            <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-success" />
                </div>
                <span className="text-3xl font-semibold text-foreground">{farmerProducts.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Farmer Products</h2>
              <p className="text-muted-foreground mb-6">
                Manage crops and products listed by farmers.
              </p>
              <Link
                href="/admin/products/farmer"
                className="inline-flex items-center text-success font-semibold hover:text-success/90"
              >
                View Products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Supplier Products Card */}
            <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-info" />
                </div>
                <span className="text-3xl font-semibold text-foreground">{supplierProducts.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Supplier Products</h2>
              <p className="text-muted-foreground mb-6">
                Manage inputs and tools listed by suppliers.
              </p>
              <Link
                href="/admin/products/supplier"
                className="inline-flex items-center text-info font-semibold hover:text-info/90"
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
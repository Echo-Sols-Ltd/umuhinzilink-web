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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Order Management'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Order Management</h1>
            <p className="text-xs text-muted-foreground">Monitor and manage all platform orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-background p-6 space-y-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Farmer Orders Card */}
            <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center">
                  <Tractor className="w-8 h-8 text-success" />
                </div>
                <span className="text-3xl font-semibold text-foreground">{farmerOrders.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Farmer Orders</h2>
              <p className="text-muted-foreground mb-6">
                View and manage orders placed for farm produce.
              </p>
              <Link
                href="/admin/orders/farmer"
                className="inline-flex items-center text-success font-semibold hover:text-success/90"
              >
                View Orders <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Supplier Orders Card */}
            <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-8 h-8 text-info" />
                </div>
                <span className="text-3xl font-semibold text-foreground">{supplierOrders.length}</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Supplier Orders</h2>
              <p className="text-muted-foreground mb-6">
                View and manage orders placed for agricultural inputs and supplies.
              </p>
              <Link
                href="/admin/orders/supplier"
                className="inline-flex items-center text-info font-semibold hover:text-info/90"
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

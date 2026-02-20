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
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { user } = useAuth();
  const { supplier, dashboardStats } = useSupplier();

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
      <main className="flex-1 p-6 overflow-auto h-full">

        {/* Content */}
        <div className="mt-4">
          {/* Welcome banner */}
          <div className="bg-green-600 rounded-2xl text-white px-8 py-8 shadow-lg shadow-green-100 mb-6 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-1 tracking-tight">Welcome back, {supplierName}!</h1>
              <p className="text-sm text-green-50 font-medium">
                Manage your agricultural inputs and connect with farmers across Rwanda
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
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
  );
}

export default function SupplierDashboardPage() {
  return (
    <SupplierGuard>
      <DashboardComponent />
    </SupplierGuard>
  );
}

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

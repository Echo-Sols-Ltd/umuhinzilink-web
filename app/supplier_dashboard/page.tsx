'use client';

import React, { useState } from 'react';
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
import { SupplierGuard } from '@/components/auth/AuthGuard';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const Logo = () => (
  <div className="flex items-center gap-2 py-2">
    <span className="font-extrabold text-xl tracking-tight">
      <span className="text-white">Umuhinzi</span>
      <span className="text-white">Link</span>
    </span>
  </div>
);

const menuItems = [
  { label: 'Dashboard', href: '/supplier_dashboard', icon: CheckCircle },
  { label: 'My Inputs', href: '/supplier_dashboard/products', icon: LayoutGrid },
  { label: 'Farmer Request', href: '/supplier_dashboard/requests', icon: FilePlus },
  { label: 'Orders', href: '/supplier_dashboard/orders', icon: ShoppingCart },
  { label: 'Message', href: '/supplier_dashboard/message', icon: Mail },
  { label: 'Profile', href: '/supplier_dashboard/profile', icon: User },
  { label: 'Contact', href: '/supplier_dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/supplier_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

function Dashboard() {
  const router = useRouter();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { logout } = useAuth()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Logo />
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Dashboard';
              const Icon = item.icon;
              const showDivider = index === 3 || index === 7;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <div
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium text-white hover:bg-green-700`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm font-medium
                          ${isActive
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-white hover:bg-green-700'
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-green-500 my-2 mx-3"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

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
                  <span className="text-white font-semibold text-sm">AS</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Agri Supply Co.</p>
                  <p className="text-gray-500 text-xs">Supplier</p>
                </div>
              </div>
            </div>
          </header>
          {/* Welcome banner */}
          <div className="mt-16">
            <div className="bg-green-600 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome back, Agri Supply Co.!</h1>
              <p className="text-green-100">
                Manage your agricultural inputs and connect with farmers across Rwanda
              </p>
            </div>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-green-600 text-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">42</h2>
                  <p className="text-green-100 text-sm">Listed Inputs</p>
                  <p className="text-green-100 text-xs">+5% from last week</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">334</h2>
                  <p className="text-gray-600 text-sm">Farmer Requests</p>
                  <p className="text-orange-600 text-xs">8 pending</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">3845</h2>
                  <p className="text-gray-600 text-sm">Active Orders</p>
                  <p className="text-blue-600 text-xs">4 shipping</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">20</h2>
                  <p className="text-gray-600 text-sm">New Customers</p>
                  <p className="text-blue-600 text-xs">+15% from yesterday</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">23,000$</h2>
                  <p className="text-gray-600 text-sm">Total Earnings</p>
                  <p className="text-green-600 text-xs">+12% this month</p>
                </div>
              </div>
            </div>
            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Market Trends Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Market Trends Prices</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>in 2024</span>
                    <button className="text-green-600 text-sm font-medium hover:text-green-700 cursor-pointer">
                      View All
                    </button>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  {/* Simulated Chart Area */}
                  <div className="w-full h-full relative">
                    <div className="absolute bottom-4 left-4 text-lg font-bold text-gray-900">
                      220,342,123
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <path
                        d="M20 180 Q60 160 100 140 T180 120 T260 100 T340 80 T380 60"
                        stroke="#10b981"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M20 180 Q60 160 100 140 T180 120 T260 100 T340 80 T380 60 L380 180 L20 180 Z"
                        fill="url(#gradient)"
                        opacity="0.3"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Side Charts */}
              <div className="space-y-6">
                {/* Listed Inputs vs Sales Level */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Listed Inputs vs Sales Level
                  </h3>
                  <div className="h-32 bg-gray-50 rounded flex items-end justify-center gap-1 p-2">
                    {[40, 60, 80, 45, 70, 55, 90, 35].map((height, i) => (
                      <div
                        key={i}
                        className={`w-4 bg-blue-500 rounded-t`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                {/* Customer Satisfaction */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Satisfaction</h3>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center relative">
                    <svg className="w-full h-full" viewBox="0 0 120 80">
                      <path
                        d="M10 60 Q30 40 50 45 T90 35 T110 30"
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M10 65 Q30 50 50 55 T90 45 T110 40"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute bottom-2 left-2 flex gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Last Month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>This Month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Top Products Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">#</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Popularity
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-900 font-medium">01</td>
                      <td className="py-4 px-4 text-gray-900">Home Decor Range</td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          45%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-900 font-medium">02</td>
                      <td className="py-4 px-4 text-gray-900">Disney Princess Pink Bag 18&quot;</td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '70%' }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          29%
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-900 font-medium">03</td>
                      <td className="py-4 px-4 text-gray-900">Bathroom Essentials</td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          18%
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-gray-900 font-medium">04</td>
                      <td className="py-4 px-4 text-gray-900">Apple Smartwatch</td>
                      <td className="py-4 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '45%' }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          25%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Orders Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Orders Overview</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-600">#ORD001 - Amara Uwera (5kg)</span>
                  <span className="text-gray-900 font-medium">4 hours ago</span>
                </div>
              </div>
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
      <Dashboard />
    </SupplierGuard>
  );
}

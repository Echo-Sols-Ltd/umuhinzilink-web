'use client';
import React, { useState } from 'react';
import {
  CheckCircle,
  MessageSquare,
  Mail,
  Phone,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  Eye,
  Calendar,
  Search,
  ChevronDown,
  DollarSign,
  Apple,
  Wheat,
  Bean,
  Carrot,
  MessageCircle,
  RefreshCw,
  UserIcon,
  GridIcon,
  FilePlus,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

const menuItems = [
  { label: 'Dashboard', href: '/dashboard/buyer', icon: CheckCircle },
  { label: 'My Purchase', href: '/dashboard/buyer/purchases', icon: GridIcon },
  { label: 'Browse product', href: '/dashboard/buyer/product', icon: FilePlus },
  { label: 'Saved items', href: '/dashboard/buyer/saved', icon: MessageSquare },
  { label: 'Message', href: '/dashboard/buyer/message', icon: Mail },
  { label: 'Profile', href: '/dashboard/buyer/profile', icon: UserIcon },
  { label: 'Contact', href: '/dashboard/buyer/contact', icon: Phone },
  { label: 'Settings', href: '/dashboard/buyer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

export default function MyPurchases() {
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {

  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = item.label === 'My Purchase';
              const Icon = item.icon;
              const showDivider = index === 3 || index === 8;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutPending}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${logoutPending
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      {logoutPending ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-500" />
                      )}
                      <span>{logoutPending ? 'Logging out...' : item.label}</span>
                    </button>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                        ${isActive
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Purchases</h1>
            <p className="text-gray-600">Track your orders and manage your purchases</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Purchases</p>
                  <h2 className="text-2xl font-bold text-gray-900">24</h2>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed Orders</p>
                  <h2 className="text-2xl font-bold text-gray-900">18</h2>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <h2 className="text-2xl font-bold text-gray-900">6</h2>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <h2 className="text-2xl font-bold text-gray-900">$2,840</h2>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                All
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                In Progress
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Completed
              </button>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                />
              </div>
              <button className="bg-white border border-gray-300 text-gray-700 rounded-lg py-2.5 px-4 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                All Crops
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-40"
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Farmer
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">#ORD-001</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <Apple className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-gray-900">Fresh Tomatoes</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">John Mukama</td>
                    <td className="py-4 px-4 text-gray-900">50 kg</td>
                    <td className="py-4 px-4 text-gray-900">$125</td>
                    <td className="py-4 px-4 text-gray-900">Dec 15, 2024</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">#ORD-002</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Wheat className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="text-gray-900">Maize</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">Mary Uwimana</td>
                    <td className="py-4 px-4 text-gray-900">100 kg</td>
                    <td className="py-4 px-4 text-gray-900">$180</td>
                    <td className="py-4 px-4 text-gray-900">Dec 18, 2024</td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        In Progress
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">#ORD-003</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Bean className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-900">Green Beans</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">Peter Niyonzima</td>
                    <td className="py-4 px-4 text-gray-900">25 kg</td>
                    <td className="py-4 px-4 text-gray-900">$75</td>
                    <td className="py-4 px-4 text-gray-900">Dec 20, 2024</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">#ORD-004</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Carrot className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-gray-900">Carrots</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">Grace Nyirahabimana</td>
                    <td className="py-4 px-4 text-gray-900">30 kg</td>
                    <td className="py-4 px-4 text-gray-900">$90</td>
                    <td className="py-4 px-4 text-gray-900">Dec 22, 2024</td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        In Progress
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">Showing 1 to 4 of 24 results</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                &lt;
              </button>
              <button className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                1
              </button>
              <button className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
                2
              </button>
              <button className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
                3
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

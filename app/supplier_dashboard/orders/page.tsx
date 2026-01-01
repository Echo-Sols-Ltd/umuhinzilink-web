'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

function OrdersPage() {
  const router = useRouter();
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Orders data
  const ordersData = [
    {
      id: '#001',
      customer: 'John Doe',
      address: '123 Main St, Kigali',
      date: 'Jan 15, 2024',
      product: 'NPK Fertilizer (50kg)',
      amount: '$125.00',
      status: 'Delivered',
      statusColor: 'green',
    },
    {
      id: '#002',
      customer: 'Jane Smith',
      address: '456 Oak Ave, Kigali',
      date: 'Jan 14, 2024',
      product: 'Corn Seeds (25kg)',
      amount: '$87.50',
      status: 'Pending',
      statusColor: 'yellow',
    },
    {
      id: '#003',
      customer: 'Michael Brown',
      address: '789 Pine Rd, Kigali',
      date: 'Jan 13, 2024',
      product: 'Organic Pesticide (10L)',
      amount: '$65.00',
      status: 'Processing',
      statusColor: 'blue',
    },
    {
      id: '#004',
      customer: 'Sarah Wilson',
      address: '321 Elm St, Kigali',
      date: 'Jan 12, 2024',
      product: 'Wheat Seeds (75kg)',
      amount: '$195.00',
      status: 'Delivered',
      statusColor: 'green',
    },
    {
      id: '#005',
      customer: 'David Johnson',
      address: '654 Maple Dr, Kigali',
      date: 'Jan 11, 2024',
      product: 'Tomato Seeds (5kg)',
      amount: '$42.50',
      status: 'Pending',
      statusColor: 'yellow',
    },
    {
      id: '#006',
      customer: 'Emily Davis',
      address: '987 Cedar Ln, Kigali',
      date: 'Jan 10, 2024',
      product: 'Organic Fertilizer (100kg)',
      amount: '$280.00',
      status: 'Delivered',
      statusColor: 'green',
    },
    {
      id: '#007',
      customer: 'Robert Taylor',
      address: '147 Birch St, Kigali',
      date: 'Jan 09, 2024',
      product: 'Rice Seeds (30kg)',
      amount: '$96.00',
      status: 'Processing',
      statusColor: 'blue',
    },
    {
      id: '#008',
      customer: 'Lisa Anderson',
      address: '258 Spruce Ave, Kigali',
      date: 'Jan 08, 2024',
      product: 'Fungicide (15L)',
      amount: '$78.00',
      status: 'Pending',
      statusColor: 'yellow',
    },
    {
      id: '#009',
      customer: 'Mark Thompson',
      address: '369 Willow Rd, Kigali',
      date: 'Jan 07, 2024',
      product: 'Herbicide (20L)',
      amount: '$156.00',
      status: 'Delivered',
      statusColor: 'green',
    },
    {
      id: '#010',
      customer: 'Anna Martinez',
      address: '741 Poplar St, Kigali',
      date: 'Jan 06, 2024',
      product: 'Bean Seeds (40kg)',
      amount: '$112.00',
      status: 'Processing',
      statusColor: 'blue',
    },
  ];

  // Helper function to get status styling
  const getStatusStyle = (statusColor: string) => {
    switch (statusColor) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Action handlers
  const handleViewOrder = (orderId: string) => {
    console.log('Viewing order:', orderId);
    setOpenActionDropdown(null);
    // Add your view logic here
  };

  const handleEditOrder = (orderId: string) => {
    console.log('Editing order:', orderId);
    setOpenActionDropdown(null);
    // Add your edit logic here
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log('Deleting order:', orderId);
    setOpenActionDropdown(null);
    // Add your delete logic here
    if (confirm('Are you sure you want to delete this order?')) {
      // Perform delete action
    }
  };

  const toggleActionDropdown = (orderId: string) => {
    setOpenActionDropdown(openActionDropdown === orderId ? null : orderId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenActionDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col fixed left-0 h-screen overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Logo />
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Orders';
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
              {/* Export Button */}
              <button className="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer">
                Export
              </button>
            </div>
          </header>

          {/* Content with top margin for fixed header */}
          <div className="mt-16">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Order</h1>
            </div>

            {/* Search and Filters */}
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white border border-gray-300 text-gray-600 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  Status
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  All products
                </button>
                <button className="bg-green-600 text-white rounded-md py-2 px-3 text-sm hover:bg-green-700 transition-colors cursor-pointer">
                  Filter
                </button>
              </div>
            </div>

            {/* Order */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        CUSTOMER
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        ADDRESS
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        DATE
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Products
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersData.map((order, index) => (
                      <tr
                        key={order.id}
                        className={index < ordersData.length - 1 ? 'border-b border-gray-100' : ''}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 text-sm">{order.id}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{order.customer}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{order.address}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{order.date}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{order.product}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm font-medium">
                          {order.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`${getStatusStyle(order.statusColor)} px-2 py-1 rounded-full text-xs font-medium`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 relative">
                          <div className="flex justify-center" ref={dropdownRef}>
                            <button
                              onClick={() => toggleActionDropdown(order.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Action Dropdown */}
                            {openActionDropdown === order.id && (
                              <div className="absolute right-0 top-8 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                  onClick={() => handleViewOrder(order.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEditOrder(order.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <Edit size={14} />
                                  Edit Order
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                  <Trash2 size={14} />
                                  Delete Order
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between cursor-pointer items-center mt-6">
              <p className="text-sm text-gray-600">Showing 1 to 10 of 249 results</p>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  &lt;
                </button>
                <button className="bg-green-600 text-white px-3 py-2 cursor-pointer rounded-md text-sm font-medium">
                  1
                </button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors text-sm">
                  2
                </button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors  cursor-pointer text-sm">
                  3
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OrdersPageWrapper() {
  return (
    <SupplierGuard>
      <OrdersPage />
    </SupplierGuard>
  );
}

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
import { useSupplier } from '@/contexts/SupplierContext';
import { useSupplierAction } from '@/hooks/useSupplierAction';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';

function OrdersPageComponent() {
  const router = useRouter();
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { orders, loading, error, refreshOrders } = useSupplier();
  const supplierActions = useSupplierAction();

  const handleLogout = () => {
    logout();
  };

  // Helper function to get status styling
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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

  const handleAcceptOrder = async (orderId: string) => {
    setOpenActionDropdown(null);
    const result = await supplierActions.acceptOrder(orderId);
    if (result) {
      refreshOrders();
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    setOpenActionDropdown(null);
    if (confirm('Are you sure you want to reject this order?')) {
      const result = await supplierActions.rejectOrder(orderId);
      if (result) {
        refreshOrders();
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setOpenActionDropdown(null);
    const result = await supplierActions.updateOrderStatus(orderId, status);
    if (result) {
      refreshOrders();
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
        <Sidebar
          userType={UserType.SUPPLIER}
          activeItem='Orders'
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64 relative">
          {/* Header */}
          <header className="fixed top-0 left-64 z-30 right-0 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            {/* Search Section */}
            <div className="w-1/2 relative">
              <Input
                type="text"
                placeholder="Search orders..."
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
              <button
                onClick={refreshOrders}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </header>

          {/* Content with top margin for fixed header */}
          <div className="mt-16">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
              <div className="text-sm text-gray-600">
                Total Orders: {orders.length}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p>Error loading orders: {error}</p>
              </div>
            )}

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

            {/* Orders Table */}
            {!loading && (
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
                          PRODUCT
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          DATE
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          QUANTITY
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          AMOUNT
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
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 px-4 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium">No orders found</p>
                              <p className="text-sm">Orders from customers will appear here</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order, index) => (
                          <tr
                            key={order.id}
                            className={index < orders.length - 1 ? 'border-b border-gray-100' : ''}
                          >
                            <td className="py-3 px-4 font-medium text-gray-900 text-sm">
                              #{order.id.slice(-6)}
                            </td>
                            <td className="py-3 px-4 text-gray-900 text-sm">
                              {order.buyer?.names || 'Unknown Customer'}
                            </td>
                            <td className="py-3 px-4 text-gray-900 text-sm">
                              {order.product?.name || 'Unknown Product'}
                            </td>
                            <td className="py-3 px-4 text-gray-900 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-900 text-sm">
                              {order.quantity}
                            </td>
                            <td className="py-3 px-4 text-gray-900 text-sm font-medium">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`${getStatusStyle(order.status)} px-2 py-1 rounded-full text-xs font-medium`}
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
                                    {order.status === 'PENDING' && (
                                      <>
                                        <button
                                          onClick={() => handleAcceptOrder(order.id)}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors text-left"
                                        >
                                          <CheckCircle size={14} />
                                          Accept Order
                                        </button>
                                        <button
                                          onClick={() => handleRejectOrder(order.id)}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                          <Trash2 size={14} />
                                          Reject Order
                                        </button>
                                      </>
                                    )}
                                    {(order.status === 'ACTIVE' || order.status === 'COMPLETED') && (
                                      <button
                                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left"
                                      >
                                        <CheckCircle size={14} />
                                        Mark Complete
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
              <div className="flex justify-between cursor-pointer items-center mt-6">
                <p className="text-sm text-gray-600">
                  Showing {orders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                    &lt;
                  </button>
                  <button className="bg-green-600 text-white px-3 py-2 cursor-pointer rounded-md text-sm font-medium">
                    1
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OrdersPageWrapper() {
  return (
    <SupplierGuard>
      <OrdersPageComponent />
    </SupplierGuard>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  Package,
  ShoppingCart,
  User,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Loader2,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, SupplierOrder, DeliveryStatus } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import useOrderAction from '@/hooks/useOrderAction';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';

function OrdersPageComponent() {
  const { user } = useAuth();
  const { supplierOrders, fetchSupplierOrders, loading } = useOrder();
  const { acceptSupplierOrder, cancelSupplierOrder, updateSupplierOrderStatus, loading: actionLoading } = useOrderAction();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  const orders = useMemo(() => supplierOrders || [], [supplierOrders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => (o.status || '').toUpperCase() === 'PENDING').length;
    const active = orders.filter(o => (o.status || '').toUpperCase() === 'ACTIVE').length;
    const completed = orders.filter(o => (o.status || '').toUpperCase() === 'COMPLETED').length;
    return { total, pending, active, completed };
  }, [orders]);

  const handleViewDetails = (order: SupplierOrder) => {
    console.log("this is the order causing problems",order)
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleAcceptOrder = async (id: string) => {
    await acceptSupplierOrder(id);
    // Modal will stay open if it was triggered from there, 
    // but the state inside modal should refresh because it's linked to context
  };

  const handleCancelOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      await cancelSupplierOrder(id);
      setIsDetailsModalOpen(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: DeliveryStatus) => {
    await updateSupplierOrderStatus(id, status);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'ACTIVE': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PENDING_PAYMENT': return 'bg-orange-100 text-orange-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='Orders'
      />

      <main className="flex-1 h-full overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Incoming Orders</h1>
            <p className="text-xs text-gray-500">Manage orders from farmers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => fetchSupplierOrders()}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Orders" value={stats.total} icon={<ShoppingCart className="w-5 h-5" />} color="bg-gray-900" />
            <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="bg-yellow-500" />
            <StatCard title="Active" value={stats.active} icon={<Package className="w-5 h-5" />} color="bg-blue-500" />
            <StatCard title="Completed" value={stats.completed} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-600" />
          </div>

          {/* Orders Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                Recent Orders
                {loading && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
              </h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                          <p className="font-medium">Fetching orders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 px-4 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                          <ShoppingCart className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-bold">No orders found</p>
                          <p className="text-sm">New orders from farmers will appear here</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">#{order.id.slice(0, 8)}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{order.buyer?.names || 'Farmer'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{order.product?.name || 'Input'}</span>
                            <span className="text-[10px] text-gray-500">{order.quantity} {order.product?.measurementUnit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-green-600">RWF {order.totalPrice.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`${getStatusBadge(order.status)} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={actionLoading}
                                className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="text-gray-400 hover:text-green-600 p-1.5 rounded-lg hover:bg-green-50 transition-all"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onAccept={handleAcceptOrder}
        onCancel={handleCancelOrder}
        onUpdateStatus={handleUpdateStatus}
        loading={actionLoading}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value.toLocaleString()}</p>
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

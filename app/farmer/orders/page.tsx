'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';

import {
  LayoutGrid,
  FilePlus,
  MessageSquare,
  BarChart2,
  ShoppingCart,
  User,
  Settings,
  Mail,
  Bell,
  Package,
  Leaf,
  Download,
  Loader2,
  LogOut,
  Truck,
  Eye,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { FarmerPages, UserType, OrderStatus, FarmerOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import useOrderAction from '@/hooks/useOrderAction';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};


const ORDER_STATUS_META: Record<string, { label: string; variant: string }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  PENDING_PAYMENT: { label: 'Pending Payment', variant: 'secondary' },
  ACTIVE: { label: 'In Progress', variant: 'info' },
  PROCESSING: { label: 'Processing', variant: 'secondary' },
  SHIPPED: { label: 'Shipped', variant: 'info' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
};

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0, ...options });
}

function FarmerOrders() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { farmerOrders, loading } = useOrder();
  const { acceptFarmerOrder, cancelFarmerOrder, updateFarmerOrderStatus, loading: actionLoading } = useOrderAction();
  const [logoutPending, setLogoutPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<FarmerOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Use context data instead of manual state
  const currentUser = user;
  const orders = useMemo(() => farmerOrders || [], [farmerOrders]);
  const error = null;

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const metrics = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const paid = orders.filter(order => order.isPaid).length;
    const pending = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
    return { total, totalRevenue, paid, pending };
  }, [orders]);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);

    try {
      await logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLogoutPending(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    await acceptFarmerOrder(orderId);
    if (selectedOrder?.id === orderId) {
      setIsDetailsModalOpen(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelFarmerOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setIsDetailsModalOpen(false);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: DeliveryStatus) => {
    await updateFarmerOrderStatus(orderId, status);
  };

  const handleViewDetails = (order: FarmerOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const displayName = currentUser?.names || 'Farmer';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Orders' />


      <main className="flex-1 h-full bg-gray-50 overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
            <p className="text-xs text-gray-500">Order overview for {displayName.split(' ')[0]}</p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              title="Total orders"
              value={formatNumber(metrics.total)}
              caption="All time"
            />
            <SummaryCard
              title="Revenue"
              value={`RWF ${formatNumber(metrics.totalRevenue)}`}
              caption="Gross value"
            />
            <SummaryCard
              title="Paid"
              value={formatNumber(metrics.paid)}
              caption="Orders fully paid"
              accent="text-green-600"
            />
            <SummaryCard
              title="Pending"
              value={formatNumber(metrics.pending)}
              caption="Awaiting fulfilment"
              accent="text-yellow-600"
            />
          </section>

          <section className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="ACTIVE">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span>Clear filter</span>
                </button>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ORDER ID</TableHead>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>PRODUCT</TableHead>
                  <TableHead>QUANTITY</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => {
                    const statusKey = (order.status || 'PENDING').toUpperCase();
                    const statusMeta = ORDER_STATUS_META[statusKey] || ORDER_STATUS_META.PENDING;
                    const buyerAddress = order.buyer?.address
                      ? `${order.buyer.address.district || ''}${order.buyer.address.province ? `, ${order.buyer.address.province}` : ''}`.trim()
                      : '—';
                    const quantity =
                      Number(order.quantity) || Number(order.product?.quantity) || 0;
                    const amount =
                      Number(order.totalPrice) ||
                      (Number(order.product?.unitPrice) || 0) * quantity;

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-semibold text-gray-900">
                          <span className="text-gray-400 font-normal mr-0.5">#</span>
                          {order.id.slice(0, 4).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 truncate max-w-[150px]">
                              {order.buyer?.names || order.buyer?.email || 'Unknown buyer'}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                              {buyerAddress || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center border border-green-100 shrink-0">
                              <Leaf className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">{order.product?.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {quantity
                            ? `${formatNumber(quantity)} ${order.product?.measurementUnit || ''}`
                            : '—'}
                        </TableCell>
                        <TableCell className="font-bold text-gray-900">
                          {formatNumber(amount)} RWF
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusMeta.variant as any} className="font-semibold text-[10px] uppercase tracking-wide">
                            {statusMeta.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {statusKey === 'PENDING' && (
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-[11px] font-bold transition shadow-sm disabled:opacity-50"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/farmer/orders/${order.id}`)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.delivery && statusKey !== 'PENDING' && statusKey !== 'CANCELLED' && (
                              <button
                                onClick={() => router.push('/farmer/delivery')}
                                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                title="Tracking Details"
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </section>
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

type SummaryCardProps = {
  title: string;
  value: string;
  caption: string;
  accent?: string;
};

function SummaryCard({ title, value, caption, accent }: SummaryCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col gap-1">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className={`text-xs ${accent ?? 'text-gray-400'}`}>{caption}</p>
    </div>
  );
}

export default function FarmerOrderPage() {
  return (<FarmerGuard>
    <FarmerOrders />
  </FarmerGuard>)
}
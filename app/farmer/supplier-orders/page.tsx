'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';

import {
  Package,
  ShoppingCart,
  Download,
  Truck,
  Eye,
  Plus,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, SupplierOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import { Pagination } from '@/components/ui/pagination';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import OrderCreationModal from '@/components/orders/OrderCreationModal';
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

const ITEMS_PER_PAGE = 10;

function FarmerSupplierOrders() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const {
    farmerBuyerOrders,
    loading,
    fetchFarmerBuyerOrders,
    farmerBuyerOrdersTotalPages: totalPages,
    farmerBuyerOrdersTotalElements: totalElements,
  } = useOrder();
  const {
    acceptSupplierOrder,
    cancelSupplierOrder,
    updateSupplierOrderStatus,
    loading: actionLoading,
  } = useOrderAction();
  const [logoutPending, setLogoutPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const orders = useMemo(() => farmerBuyerOrders || [], [farmerBuyerOrders]);
  const currentUser = user;

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  useEffect(() => {
    fetchFarmerBuyerOrders(currentPage - 1, ITEMS_PER_PAGE);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const metrics = useMemo(() => {
    const total = totalElements;
    const totalCost = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const paid = orders.filter(order => order.isPaid).length;
    const pending = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
    return { total, totalCost, paid, pending };
  }, [orders, totalElements]);

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
    await acceptSupplierOrder(orderId);
    if (selectedOrder?.id === orderId) {
      setIsDetailsModalOpen(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelSupplierOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setIsDetailsModalOpen(false);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: DeliveryStatus) => {
    await updateSupplierOrderStatus(orderId, status);
  };

  const handleViewDetails = (order: SupplierOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const displayName = currentUser?.names || 'Farmer';

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Supply Orders' />

      <main className="flex-1 h-full bg-white overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Supplier Orders</h1>
            <p className="text-xs text-gray-500">Orders placed with suppliers for {displayName.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreationModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" /> Request Input
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              title="Total orders"
              value={formatNumber(metrics.total)}
              caption="All time"
            />
            <SummaryCard
              title="Total Cost"
              value={`RWF ${formatNumber(metrics.totalCost)}`}
              caption="Order value"
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
                  <TableHead>SUPPLIER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>INPUT ITEM</TableHead>
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
                        <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No supplier orders found</p>
                        <p className="text-sm">Create your first request to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => {
                    const statusKey = (order.status || 'PENDING').toUpperCase();
                    const statusMeta = ORDER_STATUS_META[statusKey] || ORDER_STATUS_META.PENDING;
                    const supplierAddress = order.buyer?.address
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
                              {'Supplier'}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                              {'Supplier Address'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center border border-blue-100 shrink-0">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{order.product?.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {quantity
                            ? `${formatNumber(quantity)} ${order.product?.measurementUnit || ''}`
                            : '—'}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatNumber(amount)} RWF
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusMeta.variant as any} className="font-semibold text-[10px] uppercase ">
                            {statusMeta.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2  transition-opacity">
                            <button
                              onClick={() => router.push(`/farmer/supplier-orders/${order.id}`)}
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
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  disabled={loading}
                  showSummary
                  totalItems={totalElements}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            )}
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

      <OrderCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        orderType="supplier"
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

export default function FarmerSupplierOrderPage() {
  return (<FarmerGuard>
    <FarmerSupplierOrders />
  </FarmerGuard>)
}

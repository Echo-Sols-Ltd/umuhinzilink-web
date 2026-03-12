'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle,
  Package,
  ShoppingCart,
  User,
  Eye,
  Loader2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, Order, DeliveryStatus } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import { Pagination } from '@/components/ui/pagination';
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

const ITEMS_PER_PAGE = 10;

function OrdersPageComponent() {
  const router = useRouter();
  const {
    supplierOrders,
    fetchSupplierOrders,
    loading,
    supplierOrdersTotalPages: totalPages,
    supplierOrdersTotalElements: totalElements,
  } = useOrder();
  const {
    acceptSupplierOrder,
    cancelSupplierOrder,
    updateSupplierOrderStatus,
    loading: actionLoading,
  } = useOrderAction();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const orders = useMemo(() => supplierOrders || [], [supplierOrders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter, totalElements]);

  useEffect(() => {
    fetchSupplierOrders(currentPage - 1, ITEMS_PER_PAGE);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = totalElements;
    const pending = orders.filter(o => (o.status || '').toUpperCase() === 'PENDING').length;
    const active = orders.filter(o => (o.status || '').toUpperCase() === 'ACTIVE').length;
    const completed = orders.filter(o => (o.status || '').toUpperCase() === 'COMPLETED').length;
    return { total, pending, active, completed };
  }, [orders]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleAcceptOrder = async (id: string) => {
    await acceptSupplierOrder(id);
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

  const getStatusVariant = (status: string) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'COMPLETED': return 'success';
      case 'ACTIVE': return 'info';
      case 'PENDING': return 'warning';
      case 'PENDING_PAYMENT': return 'warning';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.SUPPLIER} activeItem="Farmer Orders" />

      <main className="flex-1 h-full overflow-auto bg-background/30">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground ">Order Management</h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium ">Process and manage orders from farmers for your agricultural inputs</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchSupplierOrders()}
                className="flex items-center gap-2 px-4 py-2 bg-card text-muted-foreground rounded-lg font-semibold text-xs uppercase  hover:bg-card border border-border shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh List
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Orders" value={stats.total} icon={<ShoppingCart />} color="bg-muted" />
            <StatCard title="Pending" value={stats.pending} icon={<Clock />} color="bg-warning" />
            <StatCard title="In Progress" value={stats.active} icon={<Package />} color="bg-info" />
            <StatCard title="Completed" value={stats.completed} icon={<CheckCircle />} color="bg-success" />
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Package className="w-5 h-5 text-success" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
              </div>
              <div className="flex gap-2">
                {['All', 'Pending', 'Active', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab.toLowerCase())}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === tab.toLowerCase()
                      ? 'bg-success text-white shadow-md shadow-success/20'
                      : 'text-muted-foreground hover:bg-card'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Table>
              <TableHeader className="bg-card/50">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">Order ID</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">Farmer</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">Product</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase  text-center">Value</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">Status</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase  text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && orders.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <ShoppingCart className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-semibold">No orders found</h3>
                        <p className="text-sm">Incoming orders will appear here</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group transition-colors hover:bg-card/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground leading-tight">#{(order.id || '').slice(0, 8).toUpperCase()}</span>
                          <span className="text-[10px] uppercase  font-semibold text-muted-foreground mt-0.5">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success border border-success/20 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{order.buyer?.names || 'Farmer'}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                              {order.buyer?.email || 'No email'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{order.product?.name || 'Product'}</span>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {Number(order.quantity || 0).toLocaleString()} {order.product?.measurementUnit || 'units'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-foreground">
                          RWF {Number(order.totalPrice || 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)} className="font-semibold text-[10px] px-2.5 py-0.5 uppercase ">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2  transition-all">
                          {order.status.toUpperCase() === 'PENDING' && (
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-green-600 text-white text-[11px] font-semibold rounded-lg hover:bg-green-700  disabled:opacity-50 transition-all"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/supplier/orders/${order.id}`)}
                            className="p-2 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg transition-all"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-success/20 group">
      <div className={`p-3.5 rounded-lg ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase  leading-none mb-1.5">{title}</p>
        <p className="text-2xl font-semibold text-foreground leading-none">{value.toLocaleString()}</p>
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

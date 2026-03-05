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
  Loader2,
  DollarSign,
  ThumbsUp,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, SupplierOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import SatisfactionConfirmationModal from '@/components/orders/SatisfactionConfirmationModal';
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
import { useWallet } from '@/contexts/WalletContext';
import { notify } from '@/lib/notify';

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
    markSupplierOrderSatisfaction,
    setMutationLoading,
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
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [satisfactionModalOpen, setSatisfactionModalOpen] = useState(false);
  const [selectedOrderForSatisfaction, setSelectedOrderForSatisfaction] = useState<SupplierOrder | null>(null);
  const [satisfactionLoading, setSatisfactionLoading] = useState<string | null>(null);
  const { handleWalletPayment } = useWallet();

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

  const handlePayOrder = async (orderId: string) => {
    try {
      setPaymentLoading(orderId);
      const result = await handleWalletPayment(orderId, `Payment for order #${orderId.slice(-6)}`);

      if (result) {
        notify.success('Your order has been paid successfully.', 'Payment Successful');
        // Refresh orders to show updated status
        await fetchFarmerBuyerOrders(currentPage - 1, ITEMS_PER_PAGE);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleSatisfactionClick = (order: SupplierOrder) => {
    setSelectedOrderForSatisfaction(order);
    setSatisfactionModalOpen(true);
  };

  const handleSatisfactionConfirm = async () => {
    if (!selectedOrderForSatisfaction) return;
    
    try {
      setSatisfactionLoading(selectedOrderForSatisfaction.id);
      setMutationLoading(true);

      await markSupplierOrderSatisfaction(selectedOrderForSatisfaction.id);

      notify.success('Thank you for confirming safe delivery!', 'Satisfaction Confirmed');
      
      setSatisfactionModalOpen(false);
      setSelectedOrderForSatisfaction(null);
      
      // Refresh orders to show updated satisfaction status
      await fetchFarmerBuyerOrders(currentPage - 1, ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Satisfaction confirmation error:', error);
      notify.error('Failed to confirm satisfaction. Please try again.', 'Error');
    } finally {
      setSatisfactionLoading(null);
      setMutationLoading(false);
    }
  };

  const displayName = currentUser?.names || 'Farmer';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Supply Orders' />

      <main className="flex-1 h-full bg-background overflow-auto">
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Supplier Orders</h1>
            <p className="text-xs text-muted-foreground">Orders placed with suppliers for {displayName.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreationModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" /> Request Input
            </button>
            <button className="bg-info text-info-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-info/90 transition">
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
              accent="text-success"
            />
            <SummaryCard
              title="Pending"
              value={formatNumber(metrics.pending)}
              caption="Awaiting fulfilment"
              accent="text-warning"
            />
          </section>

          <section className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  className="pl-3 pr-8 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <span>Clear filter</span>
                </button>
              )}
            </div>
          </section>

          <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
                  <TableHead>DELIVERY</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
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
                    <TableCell colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
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
                        <TableCell className="font-semibold text-foreground">
                          <span className="text-muted-foreground font-normal mr-0.5">#</span>
                          {order.id.slice(0, 4).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground truncate max-w-[150px]">
                              {'Supplier'}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                              {'Supplier Address'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-info/10 rounded flex items-center justify-center border border-info/20 shrink-0">
                              <Package className="w-4 h-4 text-info" />
                            </div>
                            <span className="font-medium text-foreground">{order.product?.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {quantity
                            ? `${formatNumber(quantity)} ${order.product?.measurementUnit || ''}`
                            : '—'}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {formatNumber(amount)} RWF
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusMeta.variant as any} className="font-semibold text-[10px] uppercase ">
                            {statusMeta.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.delivery ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.delivery?.trackingSteps?.some(step => step.status === 'DELIVERED' && step.completed)
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.delivery?.trackingSteps?.some(step => step.status === 'DELIVERED' && step.completed) 
                                  ? 'Delivered' 
                                  : 'Not Delivered'
                                }
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No Delivery
                              </span>
                            )}
                            {order.isBuyerSatisfied && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ✓ Satisfied
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2  transition-opacity">
                            {!order.isPaid && order.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handlePayOrder(order.id)}
                                disabled={paymentLoading === order.id}
                                className="px-4 py-1.5 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full hover:bg-primary/90 transition shadow-sm flex items-center gap-1.5"
                              >
                                {paymentLoading === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                                Pay
                              </button>
                            )}
                            {order.delivery?.trackingSteps?.some(step => step.status === 'DELIVERED' && step.completed) && !order.isBuyerSatisfied && (
                              <button
                                onClick={() => handleSatisfactionClick(order)}
                                disabled={satisfactionLoading === order.id}
                                className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-full hover:bg-blue-700 transition shadow-sm flex items-center gap-1.5"
                                title="Confirm Safe Delivery"
                              >
                                {satisfactionLoading === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/farmer/supplier-orders/${order.id}`)}
                              className="p-2 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg transition-all"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.delivery && statusKey !== 'PENDING' && statusKey !== 'CANCELLED' && (
                              <button
                                onClick={() => router.push('/farmer/delivery')}
                                className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition-all"
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
              <div className="p-4 border-t border-border">
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

      {/* Satisfaction Confirmation Modal */}
      <SatisfactionConfirmationModal
        order={selectedOrderForSatisfaction}
        isOpen={satisfactionModalOpen}
        onClose={() => {
          setSatisfactionModalOpen(false);
          setSelectedOrderForSatisfaction(null);
        }}
        onConfirm={handleSatisfactionConfirm}
        loading={satisfactionLoading !== null}
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
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground" style={accent ? { color: accent } : {}}>{value}</p>
      <p className={`text-xs ${accent ?? 'text-muted-foreground'}`}>{caption}</p>
    </div>
  );
}

export default function FarmerSupplierOrderPage() {
  return (<FarmerGuard>
    <FarmerSupplierOrders />
  </FarmerGuard>)
}

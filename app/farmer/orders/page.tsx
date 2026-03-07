'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import { useI18n } from '@/contexts/I18nContext';

import {
  Package,
  Leaf,
  Download,
  Truck,
  Eye,
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, FarmerOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import SatisfactionConfirmationModal from '@/components/orders/SatisfactionConfirmationModal';
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

// SummaryCard component definition (moved outside FarmerOrders for clarity and reusability)
type SummaryCardProps = {
  title: string;
  value: string;
  caption: string;
  accent?: string;
  color: string; // Added color prop based on usage
};

function SummaryCard({ title, value, caption, accent, color }: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-5 flex flex-col gap-2 transition-all hover:shadow-md group">
      <div className="flex items-center justify-between">
         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
         <div className={`w-2 h-2 rounded-full ${color}`}></div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className={`text-[10px] font-medium ${accent ?? 'text-muted-foreground'} uppercase tracking-tight`}>{caption}</p>
    </div>
  );
}

function FarmerOrders() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const {
    farmerOrders,
    loading,
    fetchFarmerOrders,
    farmerOrdersTotalPages: totalPages,
    farmerOrdersTotalElements: totalElements,
    markFarmerOrderSatisfaction,
    setMutationLoading,
  } = useOrder();
  const {
    acceptFarmerOrder,
    cancelFarmerOrder,
    updateFarmerOrderStatus,
    loading: actionLoading,
  } = useOrderAction();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<FarmerOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [satisfactionModalOpen, setSatisfactionModalOpen] = useState(false);
  const [selectedOrderForSatisfaction, setSelectedOrderForSatisfaction] = useState<FarmerOrder | null>(null);
  const [satisfactionLoading, setSatisfactionLoading] = useState<string | null>(null);

  const orders = useMemo(() => farmerOrders || [], [farmerOrders]);

  const ORDER_STATUS_TRANSLATIONS: Record<string, string> = {
    PENDING: t('farmer.orders.status.pending'),
    PENDING_PAYMENT: t('farmer.orders.status.pendingPayment'),
    ACTIVE: t('farmer.orders.status.active'),
    PROCESSING: t('farmer.orders.status.processing'),
    SHIPPED: t('farmer.orders.status.shipped'),
    DELIVERED: t('farmer.orders.status.delivered'),
    COMPLETED: t('farmer.orders.status.completed'),
    CANCELLED: t('farmer.orders.status.cancelled'),
  };

  const ORDER_STATUS_VARIANTS: Record<string, string> = {
    PENDING: 'warning',
    PENDING_PAYMENT: 'secondary',
    ACTIVE: 'info',
    PROCESSING: 'secondary',
    SHIPPED: 'info',
    DELIVERED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'destructive',
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  useEffect(() => {
    fetchFarmerOrders(currentPage - 1, ITEMS_PER_PAGE);
  }, [currentPage, fetchFarmerOrders]); // Added fetchFarmerOrders to dependencies

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const metrics = useMemo(() => {
    const total = totalElements;
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const paid = orders.filter(order => order.isPaid).length;
    const pending = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
    return { total, totalRevenue, paid, pending };
  }, [orders, totalElements]);

  const handleAcceptOrder = async (orderId: string) => {
    await acceptFarmerOrder(orderId);
    if (selectedOrder?.id === orderId) {
      setIsDetailsModalOpen(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm(t('farmer.orders.toasts.confirmCancel'))) {
      await cancelFarmerOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setIsDetailsModalOpen(false);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: DeliveryStatus) => {
    await updateFarmerOrderStatus(orderId, status);
  };

  const handleSatisfactionConfirm = async () => {
    if (!selectedOrderForSatisfaction) return;

    try {
      setSatisfactionLoading(selectedOrderForSatisfaction.id);
      setMutationLoading(true);

      await markFarmerOrderSatisfaction(selectedOrderForSatisfaction.id);

      alert(t('farmer.orders.toasts.confirmSuccess'));

      setSatisfactionModalOpen(false);
      setSelectedOrderForSatisfaction(null);

      await fetchFarmerOrders(currentPage - 1, ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Satisfaction confirmation error:', error);
      alert(t('farmer.orders.toasts.confirmFailed'));
    } finally {
      setSatisfactionLoading(null);
      setMutationLoading(false);
    }
  };

  const displayName = user?.names || t('common.farmer'); // Use i18n for default 'Farmer'

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar
        userType={UserType.FARMER}
        activeItem={t('sidebar.customerOrders')} /> {/* Use i18n */}

      <main className="flex-1 h-full bg-background overflow-auto">
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold">{t('farmer.orders.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('farmer.orders.subtitle')} {displayName.split(' ')[0]}</p>
          </div>
          <button className="bg-warning text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-warning/90 transition-all shadow-md active:scale-95">
            <Download className="w-4 h-4" /> {t('farmer.orders.export')}
          </button>
        </header>

        <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              title={t('farmer.orders.metrics.total')}
              value={metrics.total.toLocaleString()}
              caption={t('farmer.orders.metrics.allTime')}
              color="bg-info"
            />
            <SummaryCard
              title={t('farmer.orders.metrics.revenue')}
              value={formatCurrency(metrics.totalRevenue)}
              caption={t('farmer.orders.metrics.grossValue')}
              color="bg-success"
            />
            <SummaryCard
              title={t('farmer.orders.metrics.paid')}
              value={metrics.paid.toLocaleString()}
              caption={t('farmer.orders.metrics.paidDesc')}
              color="bg-success"
              accent="text-success"
            />
            <SummaryCard
              title={t('farmer.orders.metrics.pending')}
              value={metrics.pending.toLocaleString()}
              caption={t('farmer.orders.metrics.pendingDesc')}
              color="bg-warning"
              accent="text-warning"
            />
          </section>

          {/* Filtering Section */}
          <section className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{t('farmer.orders.filters.status')}</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  className="pl-3 pr-8 py-2 bg-muted/30 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-success/20 transition-all"
                >
                  <option value="all">{t('farmer.orders.filters.all')}</option>
                  <option value="PENDING">{t('farmer.orders.status.pending')}</option>
                  <option value="PENDING_PAYMENT">{t('farmer.orders.status.pendingPayment')}</option>
                  <option value="ACTIVE">{t('farmer.orders.status.active')}</option>
                  <option value="COMPLETED">{t('farmer.orders.status.completed')}</option>
                  <option value="CANCELLED">{t('farmer.orders.status.cancelled')}</option>
                </select>
              </div>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-xs font-bold text-destructive hover:underline flex items-center gap-1 uppercase tracking-tighter"
                >
                  {t('farmer.orders.filters.clear')}
                </button>
              )}
            </div>
          </section>

          <section className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.orderId')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.buyer')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.date')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.product')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.quantity')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.amount')}</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.status')}</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-widest">{t('farmer.orders.table.action')}</TableHead>
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
                    <TableCell colSpan={8} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                           <Package className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{t('farmer.orders.table.noOrders')}</p>
                        <p className="text-sm">{t('farmer.orders.table.noOrdersDesc')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => {
                    const statusKey = (order.status || 'PENDING').toUpperCase();
                    const statusLabel = ORDER_STATUS_TRANSLATIONS[statusKey] || ORDER_STATUS_TRANSLATIONS.PENDING;
                    const statusVariant = ORDER_STATUS_VARIANTS[statusKey] || 'secondary';

                    const buyerAddress = order.buyer?.address
                      ? `${order.buyer.address.district || ''}${order.buyer.address.province ? `, ${order.buyer.address.province}` : ''}`.trim()
                      : '—';
                    const quantity =
                      Number(order.quantity) || Number(order.product?.quantity) || 0;
                    const amount =
                      Number(order.totalPrice) ||
                      (Number(order.product?.unitPrice) || 0) * quantity;

                    return (
                      <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-bold text-foreground">
                          <span className="text-muted-foreground font-normal mr-0.5 text-xs">#</span>
                          {order.id.slice(0, 4).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground truncate max-w-[150px]">
                              {order.buyer?.names || order.buyer?.email || t('farmer.orders.table.unknownBuyer')}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">
                              {buyerAddress || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center border border-success/20 shrink-0">
                               <Leaf className="w-4 h-4 text-success" />
                            </div>
                            <span className="font-bold text-foreground truncate max-w-[120px]">{order.product?.name || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-semibold">
                          {quantity
                            ? `${quantity.toLocaleString()} ${order.product?.measurementUnit || ''}`
                            : '—'}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">
                          {formatCurrency(amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant as any} className="font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {statusKey === 'PENDING' && (
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={actionLoading}
                                className="bg-success text-white px-4 py-1.5 rounded-full text-[11px] font-bold transition shadow-sm hover:bg-success/90 active:scale-95 disabled:opacity-50"
                              >
                                {t('farmer.orders.table.approve')}
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/farmer/orders/${order.id}`)}
                              className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-xl transition-all"
                              title={t('farmer.orders.table.viewDetails')}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {order.delivery && statusKey !== 'PENDING' && statusKey !== 'CANCELLED' && (
                              <button
                                onClick={() => router.push('/farmer/delivery')}
                                className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-xl transition-all"
                                title={t('farmer.orders.table.tracking')}
                              >
                                <Truck className="w-5 h-5" />
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
              <div className="p-6 border-t border-border flex justify-between items-center bg-muted/50">
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
    </div>
  );
}

export default function FarmerOrderPage() {
  return (
    <FarmerGuard>
      <FarmerOrders />
    </FarmerGuard>
  );
}
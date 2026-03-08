'use client';
import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  ShoppingBag,
  Clock,
  Eye,
  Search,
  ChevronDown,
  DollarSign,
  MessageCircle,
  RefreshCw,
  Loader2,
  X,
  Truck,
  MoreHorizontal,
  ThumbsUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { notify } from '@/lib/notify';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, OrderStatus } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { useOrder } from '@/contexts/OrderContext';
import { useWallet } from '@/contexts/WalletContext';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
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
import SatisfactionConfirmationModal from '@/components/orders/SatisfactionConfirmationModal';
import { useI18n } from '@/contexts/I18nContext';

function MyPurchasesComponent() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [satisfactionModalOpen, setSatisfactionModalOpen] = useState(false);
  const [selectedOrderForSatisfaction, setSelectedOrderForSatisfaction] = useState<any>(null);
  const [satisfactionLoading, setSatisfactionLoading] = useState<string | null>(null);
  const {
    buyerOrders,
    loading: ordersLoading,
    fetchBuyerOrders,
    buyerOrdersTotalPages: totalPages,
    buyerOrdersTotalElements: totalElements,
    markFarmerOrderSatisfaction,
    markSupplierOrderSatisfaction,
    setMutationLoading,
  } = useOrder();
  const { handleWalletPayment } = useWallet();

  const categories = useMemo(() => {
    if (!buyerOrders) return [];
    const cats = new Set(buyerOrders.map(o => o.product?.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [buyerOrders]);

  const filteredOrders = useMemo(() => {
    if (!buyerOrders) return [];
    return buyerOrders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' ||
        order.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesCategory = selectedCategory === 'all' ||
        order.product?.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [buyerOrders, searchTerm, filterStatus, selectedCategory]);

  React.useEffect(() => {
    fetchBuyerOrders(currentPage - 1, itemsPerPage);
  }, [currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, selectedCategory]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!buyerOrders) return { total: 0, completed: 0, inProgress: 0, totalSpent: 0 };
    const total = totalElements;
    const completed = buyerOrders.filter(o => o.status === 'COMPLETED').length;
    const inProgress = buyerOrders.filter(o => o.status === 'ACTIVE' || o.status === 'PENDING').length;
    const totalSpent = buyerOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return { total, completed, inProgress, totalSpent };
  }, [buyerOrders, totalElements]);

  const handlePayOrder = async (orderId: string) => {
    try {
      setPaymentLoading(orderId);
      const result = await handleWalletPayment(orderId, `Payment for order #${orderId.slice(-6)}`);

      if (result) {
        notify.success(t('buyer.purchases.paymentSuccessMsg'), t('buyer.purchases.paymentSuccess'));
        // Refresh orders to show updated status
        await fetchBuyerOrders(currentPage - 1, itemsPerPage);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleSatisfactionClick = (order: any) => {
    setSelectedOrderForSatisfaction(order);
    setSatisfactionModalOpen(true);
  };

  const handleSatisfactionConfirm = async () => {
    if (!selectedOrderForSatisfaction) return;
    
    try {
      setSatisfactionLoading(selectedOrderForSatisfaction.id);
      setMutationLoading(true);

      // Determine order type and call appropriate method
      if ('product' in selectedOrderForSatisfaction && 'owner' in selectedOrderForSatisfaction.product) {
        // This is a FarmerOrder (product has owner)
        await markFarmerOrderSatisfaction(selectedOrderForSatisfaction.id);
      } else {
        // This is a SupplierOrder
        await markSupplierOrderSatisfaction(selectedOrderForSatisfaction.id);
      }

      notify.success(t('buyer.purchases.confirmSatisfactionMsg'), t('buyer.purchases.confirmSatisfaction'));
      setSatisfactionModalOpen(false);
      setSelectedOrderForSatisfaction(null);
      
      // Refresh orders to show updated satisfaction status
      await fetchBuyerOrders(currentPage - 1, itemsPerPage);
    } catch (error) {
      console.error('Satisfaction confirmation error:', error);
      notify.error(t('common.error'), t('common.error'));
    } finally {
      setSatisfactionLoading(null);
      setMutationLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'ACTIVE':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'PENDING_PAYMENT':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return t('common.status.completed');
      case 'ACTIVE': return t('common.status.active');
      case 'PENDING': return t('common.status.pending');
      case 'PENDING_PAYMENT': return t('common.status.pendingPayment') || 'Pending Payment';
      case 'CANCELLED': return t('common.status.cancelled');
      default: return status;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.BUYER}
        activeItem='My Orders'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t('buyer.purchases.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('buyer.purchases.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('buyer.purchases.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
                />
            </div>
            <button
              onClick={() => fetchBuyerOrders(currentPage - 1, itemsPerPage)}
              className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors"
              disabled={ordersLoading}
            >
              <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-background p-6 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('buyer.purchases.stats.totalPurchases')}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{stats.total}</h2>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-info" />
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('buyer.purchases.stats.completed')}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{stats.completed}</h2>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('buyer.purchases.stats.inProgress')}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{stats.inProgress}</h2>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{t('buyer.purchases.stats.totalSpent')}</p>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US').format(stats.totalSpent)} RWF
                  </h2>
                </div>
                <div className="w-12 h-12 bg-purple/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="flex gap-2">
              {[
                { id: 'all', label: t('buyer.purchases.filters.all') },
                { id: 'pending', label: t('buyer.purchases.filters.pending') },
                { id: 'pending_payment', label: t('buyer.purchases.filters.pendingPayment') },
                { id: 'active', label: t('buyer.purchases.filters.inProgress') },
                { id: 'completed', label: t('buyer.purchases.filters.completed') },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilterStatus(option.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === option.id
                    ? 'bg-success text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('buyer.purchases.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent w-64"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-card border border-border text-foreground rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-success hover:bg-card transition-colors w-40 cursor-pointer"
                >
                  <option value="all">{t('buyer.purchases.filters.allCrops')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('buyer.purchases.table.orderId')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.product')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.farmer')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.quantity')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.price')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.date')}</TableHead>
                  <TableHead>{t('buyer.purchases.table.status')}</TableHead>
                  <TableHead className="text-right">{t('buyer.purchases.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">{t('buyer.purchases.noOrders')}</p>
                        <p className="text-sm">
                          {searchTerm || filterStatus !== 'all'
                            ? t('buyer.purchases.tryAdjusting')
                            : t('buyer.purchases.noOrdersYet')}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const farmerName = order.product?.owner?.names || 'Unknown Farmer';
                    const productName = order.product?.name || 'Unknown Product';
                    const quantity = `${order.quantity || 0} ${order.product?.measurementUnit || 'units'}`;
                    const price = `${(order.totalPrice || 0).toLocaleString(locale === 'rw' ? 'rw-RW' : 'en-US')} RWF`;
                    const date = new Date(order.createdAt).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-semibold text-foreground leading-none">
                          <span className="text-muted-foreground font-normal mr-1">#</span>
                          {order.id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-success/10 rounded-lg flex items-center justify-center border border-success/20">
                              <span className="text-success text-xs font-semibold shrink-0">
                                {productName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{productName}</div>
                              <div className="text-[10px] text-muted-foreground uppercase ">{t('buyer.purchases.table.product')}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">{farmerName}</span>
                            <span className="text-[10px] text-muted-foreground">{t('buyer.purchases.table.farmer')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{quantity}</TableCell>
                        <TableCell className="font-semibold text-foreground">{price}</TableCell>
                        <TableCell className="text-muted-foreground">{date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status) as any} className="font-medium text-[10px] uppercase  px-2.5 py-0.5">
                            {translateStatus(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1  transition-opacity">
                            {!order.isPaid && order.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handlePayOrder(order.id)}
                                disabled={paymentLoading === order.id}
                                className="px-4 py-1.5 bg-green-600 text-white text-[11px] font-semibold rounded-full hover:bg-green-700 transition shadow-sm flex items-center gap-1.5"
                              >
                                {paymentLoading === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                                {t('buyer.purchases.pay')}
                              </button>
                            )}
                            {order.delivery?.trackingSteps?.some(step => step.status === 'DELIVERED' && step.completed) && !order.isBuyerSatisfied && (
                              <button
                                onClick={() => handleSatisfactionClick(order)}
                                disabled={satisfactionLoading === order.id}
                                className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-full hover:bg-blue-700 transition shadow-sm flex items-center gap-1.5"
                                title={t('buyer.purchases.confirmSafeDelivery')}
                              >
                                {satisfactionLoading === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                                {t('buyer.purchases.confirm')}
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/buyer/orders/${order.id}`)}
                              className="p-2 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg transition-all"
                              title={t('buyer.purchases.viewDetails')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {order.delivery && (
                              <button
                                onClick={() => router.push('/buyer/delivery')}
                                className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-all"
                                title={t('buyer.purchases.trackDelivery')}
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {totalElements} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-muted-foreground hover:text-muted-foreground transition-colors disabled:opacity-50"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${currentPage === i + 1 ? 'bg-success text-primary-foreground' : 'text-muted-foreground hover:bg-muted'} px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-muted-foreground hover:text-muted-foreground transition-colors disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

          {/* Order Status Tracker Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Order #{selectedOrder.id.slice(-6)} - Status Tracking
                    </h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="mb-6 p-4 bg-card rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('buyer.purchases.table.product')}:</span>
                        <span className="ml-2 font-medium">{selectedOrder.product?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('buyer.purchases.table.farmer')}:</span>
                        <span className="ml-2 font-medium">{selectedOrder.product?.farmer?.user?.names}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('buyer.purchases.table.quantity')}:</span>
                        <span className="ml-2 font-medium">{selectedOrder.quantity} {selectedOrder.product?.measurementUnit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('buyer.purchases.table.price')}:</span>
                        <span className="ml-2 font-medium">
                          {(selectedOrder.totalPrice || 0).toLocaleString(locale === 'rw' ? 'rw-RW' : 'en-US')} RWF
                        </span>
                      </div>
                    </div>
                  </div>

                  <OrderStatusTracker
                    orderStatus={selectedOrder.status}
                    deliveryStatus={selectedOrder.delivery?.status}
                    createdAt={selectedOrder.createdAt}
                    updatedAt={selectedOrder.updatedAt}
                    deliveryDate={selectedOrder.delivery?.estimatedDelivery}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
    </div>
  );
}

export default function MyPurchases() {
  return (
    <BuyerGuard>
      <MyPurchasesComponent />
    </BuyerGuard>
  );
}

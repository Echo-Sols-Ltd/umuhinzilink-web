'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import {
  Loader2,
  ShoppingCart,
  Package,
  Info,
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, SupplierProduct, SupplierOrder, OrderStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import OrderCreationModal from '@/components/orders/OrderCreationModal';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import { imageUrl } from '@/lib/utils';
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
import { Pagination } from '@/components/ui/pagination';

const ORDERS_PER_PAGE = 10;

function FarmerRequestsComponent() {
  const { farmerBuyerProducts, fetchFarmerBuyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const {
    farmerBuyerOrders,
    fetchFarmerBuyerOrders,
    loading: ordersLoading,
    farmerBuyerOrdersTotalPages: ordersTotalPages,
    farmerBuyerOrdersTotalElements: ordersTotalElements,
  } = useOrder();
  const {
    cancelSupplierOrder,
    processOrderPayment,
    loading: actionLoading,
  } = useOrderAction();

  const router = useRouter()
  const [payingId, setPayingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<SupplierOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);

  useEffect(() => {
    fetchFarmerBuyerProducts(0, 100);
  }, []);

  useEffect(() => {
    fetchFarmerBuyerOrders(ordersPage - 1, ORDERS_PER_PAGE);
  }, [ordersPage]);

  const orders = useMemo(() => farmerBuyerOrders || [], [farmerBuyerOrders]);
  const products = useMemo(() => farmerBuyerProducts || [], [farmerBuyerProducts]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  useEffect(() => {
    setOrdersPage(1);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = ordersTotalElements;
    const pending = orders.filter(req => (req.status || '').toUpperCase() === 'PENDING').length;
    const completed = orders.filter(req => (req.status || '').toUpperCase() === 'COMPLETED').length;
    const active = orders.filter(req => (req.status || '').toUpperCase() === 'ACTIVE').length;
    return { total, pending, completed, active };
  }, [orders, ordersTotalElements]);

  const handleBuyClick = (product: SupplierProduct) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleViewOrder = (order: SupplierOrder) => {
    setViewingOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCancelOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelSupplierOrder(id);
      setIsDetailsModalOpen(false);
    }
  };

  const handlePayOrder = async (order: SupplierOrder) => {
    setPayingId(order.id);
    try {
      await processOrderPayment(order.id, order.paymentMethod);
      await fetchFarmerBuyerOrders();
    } finally {
      setPayingId(null);
    }
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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem="Input Request" />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Farm Input Center</h1>
            <p className="text-xs text-gray-500">Purchase seeds, fertilizers and tools from verified suppliers</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchFarmerBuyerProducts(0, 100); fetchFarmerBuyerOrders(0, ORDERS_PER_PAGE); setOrdersPage(1); }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${productsLoading || ordersLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-white p-6 space-y-6">

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Delivery</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Premium Inputs</h2>
              <span className="text-xs text-gray-500 uppercase ">Available Now</span>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No verified inputs currently listed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-6">
                      {product.image ? (
                        <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Package className="w-12 h-12 text-gray-200" />
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-semibold text-green-700 shadow-sm border border-green-50">
                          {product.category || 'AGRI-INPUT'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors">{product.name}</h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-1 line-clamp-1 capitalize">{product.description || 'Verified agricultural supply'}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-semibold text-gray-400 ">Unit Price</p>
                          <p className="text-lg font-semibold text-gray-900 leading-none">
                            RWF {product.unitPrice?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-400">
                          {product.quantity} {product.measurementUnit}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBuyClick(product)}
                        className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 shadow-md shadow-green-100 transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Purchase Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Orders History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Purchase History</h2>
              <div className="flex gap-2">
                {['All', 'Pending', 'Active', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab.toLowerCase())}
                    className={`px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${statusFilter === tab.toLowerCase()
                      ? 'bg-amber-100 text-amber-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/50">
                    <TableHead className="font-semibold py-5">ORDER DETAILS</TableHead>
                    <TableHead className="font-semibold">TOTAL PRICE</TableHead>
                    <TableHead className="font-semibold">STATUS</TableHead>
                    <TableHead className="text-right font-semibold pr-8">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right pr-8"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-30">
                          <Package className="w-16 h-16 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-800">No Purchase History</h3>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map(order => (
                      <TableRow key={order.id} className="group hover:bg-white/50 transition-colors">
                        <TableCell className="py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 leading-tight">
                                {order.product?.name || 'Agri-Input'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-semibold uppercase  mt-0.5">
                                Ordered from {order.product?.owner?.names || 'Supplier'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 ">RWF {order.totalPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-500 font-semibold ">
                              {order.quantity} {order.product?.measurementUnit} × RWF {order.product?.unitPrice?.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1.5">
                            <Badge variant={getStatusVariant(order.status)} className="font-semibold text-[9px] uppercase  px-2.5 py-0.5 rounded-full">
                              {order.status}
                            </Badge>
                            {order.isPaid ? (
                              <span className="text-[9px] font-semibold text-blue-600 flex items-center gap-1 leading-none">
                                <CheckCircle className="w-2.5 h-2.5" /> PAID
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold text-orange-500 flex items-center gap-1 leading-none uppercase">
                                <Clock className="w-2.5 h-2.5" /> Unpaid
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-2  transition-all">
                            {order.status === OrderStatus.PENDING && !order.isPaid && (
                              <button
                                onClick={() => handlePayOrder(order)}
                                disabled={payingId === order.id}
                                className="px-3 py-1.5 bg-orange-600 text-white text-[11px] font-semibold rounded-xl hover:bg-orange-700 shadow-md shadow-orange-100 disabled:opacity-50 transition-all flex items-center gap-1.5"
                              >
                                {payingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
                                Pay Order
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/farmer/orders/${order.id}`)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {ordersTotalPages > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <Pagination
                    currentPage={ordersPage}
                    totalPages={ordersTotalPages}
                    onPageChange={setOrdersPage}
                    disabled={ordersLoading}
                    showSummary
                    totalItems={ordersTotalElements}
                    itemsPerPage={ORDERS_PER_PAGE}
                  />
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <OrderCreationModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        productType="supplier"
      />

      <OrderDetailsModal
        order={viewingOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingOrder(null);
        }}
      />
    </div>
  );
}

function HighlightCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
      <div className={`p-3 rounded-xl bg-linear-to-br ${color} text-white shadow-lg`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase  leading-none mb-1.5">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 leading-none">{value}</p>
      </div>
    </div>
  );
}

export default function FarmerRequestsPage() {
  return (
    <FarmerGuard>
      <FarmerRequestsComponent />
    </FarmerGuard>
  );
}

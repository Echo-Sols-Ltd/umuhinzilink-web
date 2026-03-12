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
import { UserType, Product, Order, OrderStatus } from '@/types';
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
import ProductCard from '@/components/products/ProductCard';

const ORDERS_PER_PAGE = 10;

function FarmerRequestsComponent() {
  const { marketplaceProducts: farmerBuyerProducts, fetchMarketplaceProducts: fetchFarmerBuyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const {
    buyingOrders: farmerBuyerOrders,
    fetchBuyingOrders: fetchFarmerBuyerOrders,
    loading: ordersLoading,
    buyingOrdersTotalPages: ordersTotalPages,
    buyingOrdersTotalElements: ordersTotalElements,
  } = useOrder();
  const {
    cancelSupplierOrder,
    processOrderPayment,
    loading: actionLoading,
  } = useOrderAction();

  const router = useRouter()
  const [payingId, setPayingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
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

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCancelOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelSupplierOrder(id);
      setIsDetailsModalOpen(false);
    }
  };

  const handlePayOrder = async (order: Order) => {
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem="Supply Market" />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Farm Input Center</h1>
            <p className="text-xs text-muted-foreground">Purchase seeds, fertilizers and tools from verified suppliers</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchFarmerBuyerProducts(0, 100); fetchFarmerBuyerOrders(0, ORDERS_PER_PAGE); setOrdersPage(1); }}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${productsLoading || ordersLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-card p-6 space-y-6">

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Orders</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Delivery</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-info" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Successful</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.completed}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Premium Inputs</h2>
              <span className="text-xs text-muted-foreground uppercase ">Available Now</span>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-4">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No verified inputs currently listed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
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
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-md cursor-default">
      <div className={`p-3 rounded-xl bg-linear-to-br ${color} text-white shadow-lg`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase  leading-none mb-1.5">{title}</p>
        <p className="text-2xl font-semibold text-foreground leading-none">{value}</p>
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

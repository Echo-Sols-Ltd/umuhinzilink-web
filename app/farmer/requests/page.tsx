'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';
import { ChevronDown, X, Loader2, ShoppingCart, Package, Info, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, SupplierProduct, SupplierOrder, DeliveryStatus, OrderStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import useOrderAction from '@/hooks/useOrderAction';
import OrderCreationModal from '@/components/orders/OrderCreationModal';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  PENDING: { label: 'Pending', badge: 'bg-yellow-100 text-yellow-700' },
  PENDING_PAYMENT: { label: 'Pending Payment', badge: 'bg-orange-100 text-orange-700' },
  ACTIVE: { label: 'Active', badge: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', badge: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-red-100 text-red-700' },
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

function FarmerRequestsComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const { farmerBuyerProducts, fetchFarmerBuyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const { farmerBuyerOrders, fetchFarmerBuyerOrders, loading: ordersLoading } = useOrder();
  const { cancelSupplierOrder, processOrderPayment, loading: actionLoading } = useOrderAction();

  const [payingId, setPayingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<SupplierOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchFarmerBuyerProducts();
    fetchFarmerBuyerOrders();
  }, []);

  const orders = useMemo(() => farmerBuyerOrders || [], [farmerBuyerOrders]);
  const products = useMemo(() => farmerBuyerProducts || [], [farmerBuyerProducts]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const ordersSummary = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(req => (req.status || '').toUpperCase() === 'PENDING').length;
    const completed = orders.filter(req => (req.status || '').toUpperCase() === 'COMPLETED').length;
    const active = orders.filter(req => (req.status || '').toUpperCase() === 'ACTIVE').length;
    return { total, pending, completed, active };
  }, [orders]);

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
    await processOrderPayment(order.id, order.paymentMethod);

    await fetchFarmerBuyerOrders();
  };

  const displayName = user?.names || 'Farmer';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Input Request' />

      <main className="flex-1 bg-gray-50 overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Input Orders</h1>
            <p className="text-xs text-gray-500">
              Purchase farm inputs from verified suppliers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              {orders.length} Orders
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Orders"
              value={formatNumber(ordersSummary.total)}
              caption="All time purchases"
            />
            <SummaryCard
              title="Pending"
              value={formatNumber(ordersSummary.pending)}
              caption="Awaiting confirmation"
              accent="text-yellow-600"
            />
            <SummaryCard
              title="Active"
              value={formatNumber(ordersSummary.active)}
              caption="Currently in delivery"
              accent="text-blue-600"
            />
            <SummaryCard
              title="Completed"
              value={formatNumber(ordersSummary.completed)}
              caption="Delivered inputs"
              accent="text-green-600"
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Available Supplier Inputs
              </h2>
              <span className="text-xs text-gray-500">Showing {products.length} products</span>
            </div>

            {productsLoading ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-10 flex items-center justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading inputs...
              </div>
            ) : productsError ? (
              <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6 text-red-600">
                {productsError}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center text-gray-500">
                No products available from suppliers at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-600 border border-gray-100">
                          {product.category || 'INPUT'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {product.name || 'Unnamed input'}
                        </h3>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{product.description || 'Verified agricultural input'}</p>
                      </div>

                      <div className="flex items-center justify-between py-2 border-y border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Unit Price</span>
                          <span className="text-sm font-bold text-green-600">
                            {product.unitPrice != null
                              ? `RWF ${formatNumber(product.unitPrice)}`
                              : 'Price N/A'}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Available</span>
                          <span className="text-xs font-medium text-gray-700">
                            {product.quantity != null
                              ? `${formatNumber(product.quantity)} ${product.measurementUnit || ''}`
                              : 'Qty N/A'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyClick(product)}
                        className="w-full bg-green-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Purchase History</h2>
                <p className="text-sm text-gray-500">Manage your orders from suppliers</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT & SUPPLIER</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">AMOUNT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                          <span className="text-sm font-medium">Loading your orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2 opacity-60">
                          <Package className="w-10 h-10" />
                          <span className="text-sm font-medium">No purchase records found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const statusKey = (order.status || 'PENDING').toUpperCase();
                      const statusMeta = STATUS_LABELS[statusKey] || STATUS_LABELS.PENDING;

                      return (
                        <tr key={order.id} className="hover:bg-gray-50 group transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{order.product?.name || 'Input Item'}</span>
                              <span className="text-[10px] text-gray-500 font-medium">by {order.product?.supplier?.businessName || 'Verified Supplier'}</span>
                              <span className="text-[10px] text-gray-400 italic">{formatDate(order.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-green-600">RWF {formatNumber(order.totalPrice)}</span>
                              <span className="text-[10px] text-gray-500">{order.quantity} {order.product?.measurementUnit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex w-fit px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tighter ${statusMeta.badge}`}
                              >
                                {statusMeta.label}
                              </span>
                              {order.isPaid ? (
                                <span className="text-[9px] font-bold text-blue-600 flex items-center gap-0.5">
                                  <CheckCircle className="w-2.5 h-2.5" /> PAID
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-orange-600">UNPAID</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === OrderStatus.PENDING && (
                                <button
                                  onClick={() => handlePayOrder(order)}
                                  disabled={payingId === order.id}
                                  className={`bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${payingId === order.id ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                  {payingId === order.id ? 'Processing...' : 'Pay Now'}
                                </button>
                              )}
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                              >
                                <Info className="w-3 h-3" />
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium italic">
                All transactions are secured by UmuhinziLink Wallet
              </p>
              <Link href="/farmer/orders" className="text-xs font-bold text-green-600 hover:underline">
                Manage all orders →
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Order Creation Modal */}
      <OrderCreationModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        productType="supplier"
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onCancel={handleCancelOrder}
        onPay={handlePayOrder}
        onUpdateStatus={undefined} // Farmers don't update supplier order status
        loading={actionLoading}
      />
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

type SummaryCardProps = {
  title: string;
  value: string;
  caption: string;
  accent?: string;
};

function SummaryCard({ title, value, caption, accent }: SummaryCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-1 hover:border-green-100 transition-colors">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className={`text-3xl font-black text-gray-900 ${accent ?? ''}`}>{value}</p>
      <p className="text-[10px] text-gray-500 font-medium">{caption}</p>
    </div>
  );
}

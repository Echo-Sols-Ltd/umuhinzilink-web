'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  Heart,
  Mail,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  FilePlus,
  TrendingUp,
  Users,
  Star,
  LayoutGrid,
  Loader2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import { useProduct } from '@/contexts/ProductContext';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import OrderManagementDashboard from '@/components/orders/OrderManagementDashboard';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';
import OrderCreationModal from '@/components/orders/OrderCreationModal';
import { FarmerProduct } from '@/types';
import ProductCard from '@/components/products/Product';
import { useRouter } from 'next/navigation';


const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function BuyerDashboardComponent() {
  const { user, logout } = useAuth();
  const {
    buyerOrders,
    loading: ordersLoading,
    error: ordersError,
  } = useOrder();
  const {
    acceptFarmerOrder,
    cancelFarmerOrder,
    updateFarmerOrderStatus,
  } = useOrderAction();
  const router = useRouter();
  const { buyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const [logoutPending, setLogoutPending] = useState(false);
  const [showOrderManagement, setShowOrderManagement] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FarmerProduct | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Use context data
  const buyerName = user?.names?.split(' ')[0] || user?.names || 'Buyer';
  const orders = useMemo(() => buyerOrders || [], [buyerOrders]);
  const recommendedProducts = useMemo(() => buyerProducts || [], [buyerProducts]);

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.BUYER}
        activeItem='Dashboard'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-card border-b flex items-center justify-between p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Buyer Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your agricultural purchases and connect with farmers</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/buyer/products" className="bg-success text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-success/90 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-background p-6 space-y-6">
          {/* Enhanced Analytics Dashboard */}
          <EnhancedDashboard
            userRole="buyer"
            orders={orders}
            products={recommendedProducts}
            className="mb-6"
          />

          {/* Recommended Produce */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-foreground">Recommended Produce</h2>
              <a href="#" className="text-success text-sm">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productsLoading && (
                <div className="col-span-full text-center text-muted-foreground py-6">
                  Loading produce...
                </div>
              )}
              {!productsLoading && productsError && (
                <div className="col-span-full text-center text-muted-foreground bg-muted border border-border rounded-lg py-6">
                  {productsError}
                </div>
              )}
              {!productsLoading && !productsError && recommendedProducts.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-6">
                  No produce available at the moment.
                </div>
              )}
              {!productsLoading &&
                !productsError &&
                recommendedProducts.map(product => <ProductCard
                  key={product.id}
                  product={product}
                />)}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border bg-card">
              <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
              <button
                onClick={() => setShowOrderManagement(true)}
                className="text-success text-xs font-semibold uppercase hover:text-success/80 transition-colors"
              >
                Manage All Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card/50 border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">FARMER / LOCATION</th>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">PRODUCT / QTY</th>
                    <th className="text-left py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">TOTAL</th>
                    <th className="text-center py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">STATUS</th>
                    <th className="text-right py-4 px-6 font-semibold text-[11px] text-muted-foreground uppercase ">DELIVERY</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-muted-foreground">
                        Loading orders...
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && ordersError && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-destructive">
                        {ordersError}
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-muted-foreground">
                        You have no orders yet.
                      </td>
                    </tr>
                  )}
                  {!ordersLoading &&
                    !ordersError &&
                    orders.map(order => {
                      const farmerName =
                        order.product?.owner?.names || order.buyer?.names || '—';
                      const farmerAddress = order.product?.owner?.address ||
                        order.buyer?.address || {
                        district: '—',
                        province: '',
                      };
                      const productName = order.product?.name || '—';
                      const quantity = Number(order.quantity) || 0;
                      const unitPrice = Number(order.product?.unitPrice) || 0;
                      const totalPrice =
                        Number.isFinite(Number(order.totalPrice)) && Number(order.totalPrice) > 0
                          ? Number(order.totalPrice)
                          : quantity * unitPrice;

                      return (
                        <tr key={order.id} className="border-b border-border hover:bg-card px-4 items-center">
                          <td className="p-4 text-foreground">{order.id.slice(0, 6).toUpperCase()}</td>
                          <td className="p-4 text-foreground">{productName}</td>
                          <td className="p-4 text-muted-foreground">
                            {quantity} {order.product?.measurementUnit || ''}
                          </td>
                          <td className="p-4 text-foreground">{(totalPrice || 0).toLocaleString()} RWF</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${order.status?.toLowerCase() === 'pending'
                                ? 'bg-warning/10 text-warning'
                                : order.status?.toLowerCase() === 'completed' ||
                                  order.status?.toLowerCase() === 'delivered'
                                  ? 'bg-success/10 text-success'
                                  : order.status?.toLowerCase() === 'cancelled'
                                    ? 'bg-destructive/10 text-destructive'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {order.delivery?.trackingSteps && order.delivery.trackingSteps.length > 0
                              ? (() => {
                                const latestCompletedStep = order.delivery.trackingSteps
                                  .filter(step => step.completed)
                                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
                                return latestCompletedStep
                                  ? `${latestCompletedStep.status} · ${formatDate(latestCompletedStep.completedAt)}`
                                  : 'Processing';
                              })()
                              : 'Not Yet Delivered'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-xs text-muted-foreground mt-6">
            Contact Support: SMS Habla - +250 123 456 789
            <span className="float-right"> 2024 UmuhinziLink, All rights reserved.</span>
          </footer>
        </main>
      </div>

      {/* Order Management Modal */}
      {showOrderManagement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Order Management</h2>
                <button
                  onClick={() => setShowOrderManagement(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <OrderManagementDashboard
                orders={orders}
                userRole="buyer"
                onAcceptOrder={acceptFarmerOrder}
                onRejectOrder={cancelFarmerOrder}
                onUpdateStatus={updateFarmerOrderStatus}
                loading={ordersLoading}
              />
            </div>
          </div>
        </div>
      )}
      {/* Order Creation Modal */}
      {selectedProduct && isPurchasing && (
        <OrderCreationModal
          isOpen={isPurchasing}
          onClose={() => {
            setIsPurchasing(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          productType="farmer"
        />
      )}
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <BuyerGuard>
      <BuyerDashboardComponent />
    </BuyerGuard>
  );
}

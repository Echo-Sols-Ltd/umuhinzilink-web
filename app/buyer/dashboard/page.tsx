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
import { useProduct } from '@/contexts/ProductContext';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import OrderManagementDashboard from '@/components/orders/OrderManagementDashboard';
import useOrderAction from '@/hooks/useOrderAction';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';
import OrderCreationModal from '@/components/orders/OrderCreationModal';
import { FarmerProduct } from '@/types';
import ProductCard from '@/components/products/Product';


const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function BuyerDashboardComponent() {
  const { user, logout } = useAuth();
  const { buyerOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const { buyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const { acceptFarmerOrder, cancelFarmerOrder, updateFarmerOrderStatus } = useOrderAction();
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
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          userType={UserType.BUYER}
          activeItem='Dashboard'
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Green Welcome Bar */}
          <div className="bg-green-600 rounded-lg mt-0 text-white px-6 py-8 shadow-sm mb-4">
            <h1 className="text-lg font-semibold mb-2">Welcome back, {buyerName}!</h1>
            <p className="text-sm opacity-90">
              Manage your agricultural purchases and connect with farmers across Rwanda
            </p>
          </div>
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
              <h2 className="font-semibold text-gray-600">Recommended Produce</h2>
              <a href="#" className="text-green-600 text-sm">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productsLoading && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  Loading produce...
                </div>
              )}
              {!productsLoading && productsError && (
                <div className="col-span-full text-center text-gray-600 bg-gray-100 border border-gray-200 rounded-lg py-6">
                  {productsError}
                </div>
              )}
              {!productsLoading && !productsError && recommendedProducts.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  No produce available at the moment.
                </div>
              )}
              {!productsLoading &&
                !productsError &&
                recommendedProducts.map(product => <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => {}}
                  onPurchase={() => {}}
                  onContact={() => {}}
                />)}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-600">Recent Orders</h2>
              <button
                onClick={() => setShowOrderManagement(true)}
                className="text-green-600 text-sm hover:underline"
              >
                Manage All Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">FARMER</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">LOCATION</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDERED</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">QTY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TOTAL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">DELIVERY</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && ordersError && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-red-500">
                        {ordersError}
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500">
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
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 text-gray-900">{order.id}</td>
                          <td className="py-4 text-gray-900">{farmerName}</td>
                          <td className="py-4 text-gray-600">
                            {farmerAddress?.district
                              ? `${farmerAddress.district}, ${farmerAddress?.province ?? ''}`
                              : '—'}
                          </td>
                          <td className="py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                          <td className="py-4 text-gray-900">{productName}</td>
                          <td className="py-4 text-gray-600">
                            {quantity} {order.product?.measurementUnit || ''}
                          </td>
                          <td className="py-4 text-gray-900">{(totalPrice || 0).toLocaleString()} RWF</td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${order.status?.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status?.toLowerCase() === 'completed' ||
                                  order.status?.toLowerCase() === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status?.toLowerCase() === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-gray-600">
                            {order.delivery?.trackingSteps && order.delivery.trackingSteps.length > 0
                              ? (() => {
                                  const latestCompletedStep = order.delivery.trackingSteps
                                    .filter(step => step.completed)
                                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
                                  return latestCompletedStep 
                                    ? `${latestCompletedStep.status} · ${formatDate(latestCompletedStep.completedAt)}`
                                    : 'Processing';
                              })()
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-xs text-gray-500 mt-6">
            Contact Support: SMS Habla - +250 123 456 789
            <span className="float-right"> 2024 UmuhinziLink, All rights reserved.</span>
          </footer>
        </main>
      </div>

      {/* Order Management Modal */}
      {showOrderManagement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
                <button
                  onClick={() => setShowOrderManagement(false)}
                  className="text-gray-400 hover:text-gray-600"
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

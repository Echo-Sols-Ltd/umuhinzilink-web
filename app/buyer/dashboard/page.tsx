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
  DollarSign,
  Package,
  Filter,
  Leaf,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast-new';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useProduct } from '@/contexts/ProductContext';
import BuyerSidebar from '@/components/buyer/Navbar';
import { BuyerPages } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import OrderManagementDashboard from '@/components/orders/OrderManagementDashboard';
import useOrderAction from '@/hooks/useOrderAction';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';
import { 
  ProductListEmptyState, 
  OrdersEmptyState,
  SearchEmptyState 
} from '@/components/ui/enhanced-empty-states';


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

  const handleLogout = async () => {

  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <BuyerSidebar
          activePage={BuyerPages.DASHBOARD}
          handleLogout={handleLogout}
          logoutPending={logoutPending}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Green Welcome Bar */}
          <div className="bg-green-600 rounded-2xl mt-0 text-white px-6 py-8 shadow-sm mb-4">
            <h1 className="text-lg font-semibold mb-2">Welcome back, {buyerName}!</h1>
            <p className="text-sm opacity-90">
              Manage your agricultural purchases and connect with farmers across Rwanda
            </p>
          </div>
          {/* Beautiful Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Spent Card - Featured */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">
                    RWF {orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                <p className="text-blue-100 text-sm">All purchases</p>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {orders.filter(o => o.status?.toLowerCase() === 'completed').length} completed
                </span>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Available Products Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Available Products</p>
                  <p className="text-2xl font-bold text-gray-900">{recommendedProducts.length}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Fresh produce</span>
                <div className="flex items-center space-x-1 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Updated</span>
                </div>
              </div>
            </div>

            {/* Suppliers Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm font-medium">Connected Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(recommendedProducts.map(p => p.farmer?.user?.id).filter(Boolean)).size}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Active sellers</span>
                <div className="flex items-center space-x-1 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium">Network</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Analytics Dashboard */}
          <EnhancedDashboard
            userRole="buyer"
            orders={orders}
            products={recommendedProducts}
            className="mb-6"
          />

          {/* Modern Product Discovery Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Discover Fresh Produce</h2>
                <p className="text-sm text-gray-600 mt-1">Connect directly with local farmers and suppliers</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2 inline" />
                  Filter
                </button>
                <Link href="/buyer/products" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                  View All Products
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productsLoading && (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))
              )}
              
              {!productsLoading && productsError && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Products</h3>
                  <p className="text-gray-600 mb-4">{productsError}</p>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    Try Again
                  </button>
                </div>
              )}
              
              {!productsLoading && !productsError && recommendedProducts.length === 0 && (
                <div className="col-span-full py-12">
                  <ProductListEmptyState
                    userRole="buyer"
                    onAddProduct={() => window.location.href = '/buyer/products'}
                    size="md"
                  />
                </div>
              )}
              
              {!productsLoading && !productsError && recommendedProducts.map(product => {
                const priceText = `${Number(product.unitPrice || 0).toLocaleString()} RWF/${product.measurementUnit || 'unit'}`;
                const farmerName = product.farmer?.user?.names || 'Unknown farmer';
                const quantityText = product.quantity !== undefined
                  ? `${product.quantity?.toLocaleString?.() || product.quantity} ${product.measurementUnit || ''} available`
                  : '';

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                            <Leaf className="w-8 h-8 text-green-600" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        </button>
                      </div>
                      {product.productStatus === 'IN_STOCK' && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            Fresh
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">by {farmerName}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-green-600 font-bold text-lg">{priceText}</p>
                        {quantityText && (
                          <p className="text-xs text-gray-500 mt-1">{quantityText}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                          Contact Seller
                        </button>
                        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                          <Star className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-gray-500 font-medium">ID</th>
                    <th className="py-3 text-left text-gray-500 font-medium">FARMER</th>
                    <th className="py-3 text-left text-gray-500 font-medium">LOCATION</th>
                    <th className="py-3 text-left text-gray-500 font-medium">ORDERED</th>
                    <th className="py-3 text-left text-gray-500 font-medium">PRODUCT</th>
                    <th className="py-3 text-left text-gray-500 font-medium">QTY</th>
                    <th className="py-3 text-left text-gray-500 font-medium">TOTAL</th>
                    <th className="py-3 text-left text-gray-500 font-medium">STATUS</th>
                    <th className="py-3 text-left text-gray-500 font-medium">DELIVERY</th>
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
                      <td colSpan={9} className="py-8">
                        <OrdersEmptyState
                          userRole="buyer"
                          onBrowseProducts={() => window.location.href = '/buyer/products'}
                          size="sm"
                          showBackground={false}
                        />
                      </td>
                    </tr>
                  )}
                  {!ordersLoading &&
                    !ordersError &&
                    orders.map(order => {
                      const farmerName =
                        order.product?.farmer?.user?.names || order.buyer?.names || '—';
                      const farmerAddress = order.product?.farmer?.user?.address ||
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
                            {order.delivery?.status
                              ? `${order.delivery.status} · ${formatDate(order.delivery.estimatedDelivery)}`
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

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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, OrderStatus } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { useOrder } from '@/contexts/OrderContext';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import useWalletAction from '@/hooks/useWalletAction';

function MyPurchasesComponent() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { toast } = useToast()
  const { buyerOrders, loading: ordersLoading, fetchBuyerOrders } = useOrder();
  const { handleWalletPayment } = useWalletAction();

  // Filter and process orders
  const filteredOrders = useMemo(() => {
    if (!buyerOrders) return [];

    return buyerOrders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' ||
        order.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [buyerOrders, searchTerm, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!buyerOrders) return { total: 0, completed: 0, inProgress: 0, totalSpent: 0 };

    const total = buyerOrders.length;
    const completed = buyerOrders.filter(o => o.status === 'COMPLETED').length;
    const inProgress = buyerOrders.filter(o => o.status === 'ACTIVE' || o.status === 'PENDING').length;
    const totalSpent = buyerOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return { total, completed, inProgress, totalSpent };
  }, [buyerOrders]);

  const handlePayOrder = async (orderId: string) => {
    try {
      setPaymentLoading(orderId);
      const result = await handleWalletPayment(orderId, `Payment for order #${orderId.slice(-6)}`);

      if (result) {
        toast({
          title: 'Payment Successful',
          description: 'Your order has been paid successfully.',
          variant: 'success',
        });
        // Refresh orders to show updated status
        await fetchBuyerOrders();
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'PENDING_PAYMENT':
        return 'bg-orange-100 text-orange-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.BUYER}
        activeItem='My Purchase'
      />

      {/* Main Content */}
      <main className="h-screen flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">Track your orders and manage your purchases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Purchases</p>
                <h2 className="text-2xl font-bold text-gray-900">{stats.total}</h2>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Orders</p>
                <h2 className="text-2xl font-bold text-gray-900">{stats.completed}</h2>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <h2 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h2>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <h2 className="text-2xl font-bold text-gray-900">{stats.totalSpent.toLocaleString()} RWF</h2>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'pending_payment', label: 'Pending Payment' },
              { id: 'active', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setFilterStatus(option.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === option.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>
            <button className="bg-white border border-gray-300 text-gray-700 rounded-lg py-2.5 px-4 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
              All Crops
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">FARMER</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">QUANTITY</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRICE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">DATE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                    </td>
                  </tr>
                )}

                {!ordersLoading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      {searchTerm || filterStatus !== 'all'
                        ? 'No orders found matching your criteria.'
                        : 'You have no orders yet.'}
                    </td>
                  </tr>
                )}

                {!ordersLoading && filteredOrders.map((order, index) => {
                  const farmerName = order.product?.farmer?.user?.names || 'Unknown Farmer';
                  const productName = order.product?.name || 'Unknown Product';
                  const quantity = `${order.quantity || 0} ${order.product?.measurementUnit || 'units'}`;
                  const price = `${(order.totalPrice || 0).toLocaleString()} RWF`;
                  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={order.id} className={index < filteredOrders.length - 1 ? 'border-b border-gray-100' : ''}>
                      <td className="py-4 px-4 font-medium text-gray-900">#{order.id.slice(-6)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-xs font-semibold">
                              {productName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-gray-900">{productName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{farmerName}</td>
                      <td className="py-4 px-4 text-gray-900">{quantity}</td>
                      <td className="py-4 px-4 text-gray-900">{price}</td>
                      <td className="py-4 px-4 text-gray-900">{date}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-nowrap">
                        <div className="flex items-center gap-1">
                          {!order.isPaid && (
                            <button
                              onClick={() => handlePayOrder(order.id)}
                              disabled={paymentLoading === order.id}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {paymentLoading === order.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <DollarSign className="w-3 h-3" />
                              )}
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length > 0 ? '1' : '0'} to {filteredOrders.length} of {filteredOrders.length} results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">&lt;</button>
            <button className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium">1</button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">&gt;</button>
          </div>
        </div>
      </main>

      {/* Order Status Tracker Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.id.slice(-6)} - Status Tracking
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Product:</span>
                    <span className="ml-2 font-medium">{selectedOrder.product?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Farmer:</span>
                    <span className="ml-2 font-medium">{selectedOrder.product?.farmer?.user?.names}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium">{selectedOrder.quantity} {selectedOrder.product?.measurementUnit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium">{(selectedOrder.totalPrice || 0).toLocaleString()} RWF</span>
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

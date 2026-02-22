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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
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

function MyPurchasesComponent() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { toast } = useToast()
  const {
    buyerOrders,
    loading: ordersLoading,
    fetchBuyerOrders,
    buyerOrdersTotalPages: totalPages,
    buyerOrdersTotalElements: totalElements,
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
        toast({
          title: 'Payment Successful',
          description: 'Your order has been paid successfully.',
          variant: 'success',
        });
        // Refresh orders to show updated status
        await fetchBuyerOrders(currentPage - 1, itemsPerPage);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setPaymentLoading(null);
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
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-50 transition-colors w-40 cursor-pointer"
              >
                <option value="all">All Crops</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>PRODUCT</TableHead>
                <TableHead>FARMER</TableHead>
                <TableHead>QUANTITY</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
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
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Try adjusting your filters'
                          : 'You have no orders yet.'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const farmerName = order.product?.owner?.names || 'Unknown Farmer';
                  const productName = order.product?.name || 'Unknown Product';
                  const quantity = `${order.quantity || 0} ${order.product?.measurementUnit || 'units'}`;
                  const price = `${(order.totalPrice || 0).toLocaleString()} RWF`;
                  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold text-gray-900 leading-none">
                        <span className="text-gray-400 font-normal mr-1">#</span>
                        {order.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                            <span className="text-green-700 text-xs font-bold shrink-0">
                              {productName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{productName}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-tight">Product</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">{farmerName}</span>
                          <span className="text-[10px] text-gray-400">Merchant</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{quantity}</TableCell>
                      <TableCell className="font-bold text-gray-900">{price}</TableCell>
                      <TableCell className="text-gray-500">{date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any} className="font-medium text-[10px] uppercase tracking-wide px-2.5 py-0.5">
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1  transition-opacity">
                          {!order.isPaid && order.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handlePayOrder(order.id)}
                              disabled={paymentLoading === order.id}
                              className="px-4 py-1.5 bg-green-600 text-white text-[11px] font-bold rounded-full hover:bg-green-700 transition shadow-sm flex items-center gap-1.5"
                            >
                              {paymentLoading === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/buyer/orders/${order.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.delivery && (
                            <button
                              onClick={() => router.push('/buyer/delivery')}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Track Delivery"
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
            <p className="text-sm text-gray-600">
              Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {totalElements} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${currentPage === i + 1 ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'} px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
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

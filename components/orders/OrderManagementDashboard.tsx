'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  MoreVertical,
  Calendar,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import { FarmerOrder, SupplierOrder, OrderStatus, DeliveryStatus } from '@/types';
import { cn } from '@/lib/utils';
import OrderStatusTracker from './OrderStatusTracker';
import { useI18n } from '@/contexts/I18nContext';

interface OrderManagementDashboardProps {
  orders: (FarmerOrder | SupplierOrder)[];
  orderType?: string;
  title?: string;
  loading?: boolean;
  className?: string;
  onViewOrder?: (order: FarmerOrder | SupplierOrder) => void;
  onAcceptOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: DeliveryStatus) => void;
}

type FilterType = 'all' | 'pending' | 'active' | 'completed' | 'cancelled';
type SortType = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

export default function OrderManagementDashboard({
  orders,
  loading,
  orderType,
  title,
  className,
  onViewOrder,
  onAcceptOrder,
  onRejectOrder,
  onUpdateStatus,
}: OrderManagementDashboardProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [selectedOrder, setSelectedOrder] = useState<FarmerOrder | SupplierOrder | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Search filter
      const searchMatch = searchTerm === '' ||
        order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer.names.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = filterType === 'all' || order.status.toLowerCase() === filterType.toLowerCase();

      return searchMatch && statusMatch;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount_high':
          return b.totalPrice - a.totalPrice;
        case 'amount_low':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, filterType, sortType]);

  // Order statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === OrderStatus.PENDING).length;
    const active = orders.filter(o => o.status === OrderStatus.ACTIVE).length;
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    const cancelled = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    return { total, pending, active, completed, cancelled, totalValue };
  }, [orders]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-4 h-4 text-warning" />;
      case OrderStatus.ACTIVE:
        return <Truck className="w-4 h-4 text-info" />;
      case OrderStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-success" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-warning/10 text-warning';
      case OrderStatus.ACTIVE:
        return 'bg-info/10 text-info';
      case OrderStatus.COMPLETED:
        return 'bg-success/10 text-success';
      case OrderStatus.CANCELLED:
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const canAcceptOrder = (order: FarmerOrder | SupplierOrder) => {
    return (orderType === 'farmer' || orderType === 'supplier') &&
      order.status === OrderStatus.PENDING;
  };

  const canUpdateStatus = (order: FarmerOrder | SupplierOrder) => {
    return (orderType === 'farmer' || orderType === 'supplier') &&
      order.status === OrderStatus.ACTIVE;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-warning">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-info">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-success">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold text-success">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder={t('orderManagement.dashboard.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-background"
          >
            <Filter className="w-4 h-4" />
            <span>{t('orderManagement.dashboard.filters')}</span>
          </button>

          {/* Export */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90">
            <Download className="w-4 h-4" />
            <span>{t('orderManagement.dashboard.export')}</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('orderManagement.dashboard.status')}</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">{t('orderManagement.dashboard.allOrders')}</option>
                <option value="pending">{t('orderManagement.dashboard.pending')}</option>
                <option value="active">{t('orderManagement.dashboard.active')}</option>
                <option value="completed">{t('orderManagement.dashboard.completed')}</option>
                <option value="cancelled">{t('orderManagement.dashboard.cancelled')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t('orderManagement.dashboard.sortBy')}</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">{t('orderManagement.dashboard.newestFirst')}</option>
                <option value="oldest">{t('orderManagement.dashboard.oldestFirst')}</option>
                <option value="amount_high">{t('orderManagement.dashboard.highestAmount')}</option>
                <option value="amount_low">{t('orderManagement.dashboard.lowestAmount')}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-card rounded-lg border overflow-hidden">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Orders will appear here when they are created'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    {orderType === 'buyer' ? 'Seller' : 'Customer'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredAndSortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        #{order.id.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {order.buyer.names}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.buyer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <Image
                            className="h-10 w-10 rounded-lg object-cover"
                            src={order.product.image || '/placeholder.png'}
                            alt={order.product.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {order.product.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(order.product.unitPrice)} per {order.product.measurementUnit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.totalPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getStatusColor(order.status)
                        )}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            onViewOrder?.(order);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canAcceptOrder(order) && (
                          <button
                            onClick={() => onAcceptOrder?.(order.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Accept Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {canAcceptOrder(order) && (
                          <button
                            onClick={() => onRejectOrder?.(order.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <OrderStatusTracker
                orderStatus={selectedOrder.status}
                deliveryStatus={(() => {
                  if (!selectedOrder.delivery?.trackingSteps || selectedOrder.delivery.trackingSteps.length === 0) {
                    return undefined;
                  }
                  const latestCompletedStep = selectedOrder.delivery.trackingSteps
                    .filter(step => step.completed)
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
                  return latestCompletedStep?.status;
                })()}
                createdAt={selectedOrder.createdAt}
                updatedAt={selectedOrder.updatedAt}
                deliveryDate={(() => {
                  if (!selectedOrder.delivery?.trackingSteps || selectedOrder.delivery.trackingSteps.length === 0) {
                    return undefined;
                  }
                  const latestCompletedStep = selectedOrder.delivery.trackingSteps
                    .filter(step => step.completed)
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
                  return latestCompletedStep?.completedAt;
                })()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
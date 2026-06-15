'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import { Order, UserRole, isPaidOrder, isUnpaidOrder, getOrderStatusLabel } from '@/types';
import { notify } from '@/lib/notify';
import { ArrowLeft, Package, User, CreditCard, XCircle } from 'lucide-react';
import { orderService } from '@/services/orders';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.SELLER;
  const isBuyer = user?.role === UserRole.BUYER;
  const {
    orders,
    currentOrder,
    setCurrentOrder,
    fetchBuyingOrders,
    fetchSellingOrders,
  } = useOrder();
  const { payOrder, cancelOrder, loading: actionLoading } = useOrderAction();

  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);

      try {
        let foundOrder = orders?.find((o: Order) => o.id === orderId);

        if (!foundOrder && currentOrder?.id === orderId) {
          foundOrder = currentOrder;
        }

        if (foundOrder) {
          setCurrentOrder(foundOrder);
        } else {
          const response = await orderService.getOrderById(orderId);

          if (response.success && response.data) {
            setCurrentOrder(response.data);
            if (isSeller) {
              fetchSellingOrders();
            } else {
              fetchBuyingOrders();
            }
          } else {
            notify.error('Order not found', 'Error');
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error('Failed to load order details', 'Error');
      } finally {
        setLoading(false);
      }
    };

    if (orderId && user) {
      loadOrder();
    }
  }, [orderId, orders, currentOrder, setCurrentOrder, fetchBuyingOrders, fetchSellingOrders, isSeller, user]);

  const handlePay = async () => {
    if (!currentOrder) return;
    await payOrder(currentOrder.id);
  };

  const handleCancel = async () => {
    if (!currentOrder) return;
    const cancelled = await cancelOrder(currentOrder.id);
    if (cancelled) {
      router.push('/orders');
    }
  };

  if (loading) {
    return (
      <AppLayout maxWidth="max-w-5xl">
        <PageLoading fullScreen={false} label="Loading order" description="Fetching order details…" />
      </AppLayout>
    );
  }

  if (!currentOrder) {
    return (
      <AppLayout maxWidth="max-w-5xl">
        <PageHeader title="Order not found" backHref="/orders" backLabel="Orders" />
        <div className="py-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">This order may have been removed or you do not have access.</p>
        </div>
      </AppLayout>
    );
  }

  const buyer = currentOrder.buyer;
  const product = currentOrder.product;
  const seller = product?.owner;
  const unpaid = isUnpaidOrder(currentOrder.status);
  const paid = isPaidOrder(currentOrder.status);

  return (
    <AppLayout maxWidth="max-w-5xl">
      <PageHeader
        title="Order details"
        description={`#${currentOrder.orderNumber || currentOrder.id.slice(0, 8)}`}
        backHref="/orders"
        backLabel="Orders"
        actions={
          <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-muted">
            {getOrderStatusLabel(currentOrder.status)}
          </span>
        }
      />

      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <OrderStatusTracker
            orderStatus={currentOrder.status}
            createdAt={currentOrder.createdAt}
            updatedAt={currentOrder.updatedAt}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-semibold text-foreground">{product.name}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">{isSeller ? 'Customer' : 'Seller'}</p>
            <p className="font-semibold text-foreground">
              {isSeller
                ? `${buyer.firstName} ${buyer.lastName}`
                : seller ? `${seller.firstName} ${seller.lastName}` : '—'}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold text-foreground">RWF {currentOrder.totalPrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-success" />
              {isSeller ? 'Customer information' : 'Your order'}
            </h2>
            <div className="space-y-3 text-sm">
              {isSeller ? (
                <>
                  <p><span className="text-muted-foreground">Name:</span> {buyer.firstName} {buyer.lastName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {buyer.email}</p>
                  {buyer.phoneNumber && <p><span className="text-muted-foreground">Phone:</span> {buyer.phoneNumber}</p>}
                </>
              ) : (
                <>
                  <p><span className="text-muted-foreground">Quantity:</span> {currentOrder.quantity} {product.measurementUnit}</p>
                  <p><span className="text-muted-foreground">Payment:</span> {currentOrder.paymentMethod?.replace('_', ' ')}</p>
                  <p><span className="text-muted-foreground">Status:</span> {paid ? 'Paid' : unpaid ? 'Awaiting payment' : 'Not paid'}</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-success" />
              Product details
            </h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Product:</span> {product.name}</p>
              <p><span className="text-muted-foreground">Quantity:</span> {currentOrder.quantity} {product.measurementUnit}</p>
              <p><span className="text-muted-foreground">Unit price:</span> RWF {(currentOrder.totalPrice / currentOrder.quantity).toLocaleString()}</p>
              <p className="font-semibold text-success">Total: RWF {currentOrder.totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {unpaid && (
          <div className="flex items-center justify-end gap-3">
            {isBuyer && (
              <button
                onClick={handlePay}
                disabled={actionLoading}
                className="px-6 py-2 text-sm font-medium text-primary-foreground bg-warning rounded-lg hover:bg-warning/90 flex items-center gap-2 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                Pay now
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Cancel order
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

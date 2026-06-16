'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import { UserRole, isPaidOrder, isUnpaidOrder, getOrderStatusLabel } from '@/types';
import { notify } from '@/lib/notify';
import { Package, User, CreditCard, XCircle } from 'lucide-react';
import { orderService } from '@/services/orders';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import DetailPageShell, { ContentCard } from '@/components/layout/DetailPageShell';
import PageLoading from '@/components/layout/PageLoading';

function fmt(n: number) {
  return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.SELLER;
  const isBuyer = user?.role === UserRole.BUYER;
  const { currentOrder, setCurrentOrder } = useOrder();
  const { payOrder, cancelOrder, loading: actionLoading } = useOrderAction();

  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;
  const userId = user?.id;

  useEffect(() => {
    if (!orderId || !userId) return;

    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await orderService.getOrderById(orderId);
        if (cancelled) return;

        if (response.success && response.data) {
          setCurrentOrder(response.data);
        } else {
          notify.error('Order not found', 'Error');
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch order:', error);
          notify.error('Failed to load order details', 'Error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, userId, setCurrentOrder]);

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

  const orderLabel = currentOrder
    ? `#${currentOrder.orderNumber || currentOrder.id.slice(0, 8).toUpperCase()}`
    : 'Order';

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Orders', href: '/orders' },
    ...(currentOrder ? [{ label: orderLabel }] : [{ label: 'Details' }]),
  ];

  if (loading) {
    return (
      <DetailPageShell breadcrumbs={breadcrumbs} backHref="/orders" backLabel="Orders">
        <PageLoading
          variant="inline"
          label="Loading order"
          description="Fetching order details…"
          className="bg-transparent dark:bg-transparent"
        />
      </DetailPageShell>
    );
  }

  if (!currentOrder) {
    return (
      <DetailPageShell breadcrumbs={breadcrumbs} backHref="/orders" backLabel="Orders">
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Order not found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            This order may have been removed or you do not have access.
          </p>
        </div>
      </DetailPageShell>
    );
  }

  const buyer = currentOrder.buyer;
  const product = currentOrder.product;
  const seller = product?.owner;
  const unpaid = isUnpaidOrder(currentOrder.status);
  const paid = isPaidOrder(currentOrder.status);

  return (
    <DetailPageShell
      breadcrumbs={breadcrumbs}
      backHref="/orders"
      backLabel="Orders"
      actions={
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900">
          {getOrderStatusLabel(currentOrder.status)}
        </span>
      }
    >
      <ContentCard>
        <OrderStatusTracker
          orderStatus={currentOrder.status}
          createdAt={currentOrder.createdAt}
          updatedAt={currentOrder.updatedAt}
        />
      </ContentCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ContentCard padding="p-4">
          <p className="text-xs font-medium text-muted-foreground">Product</p>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{product.name}</p>
        </ContentCard>
        <ContentCard padding="p-4">
          <p className="text-xs font-medium text-muted-foreground">{isSeller ? 'Customer' : 'Seller'}</p>
          <p className="text-sm font-bold text-foreground mt-1 truncate">
            {isSeller
              ? `${buyer.firstName} ${buyer.lastName}`
              : seller ? `${seller.firstName} ${seller.lastName}` : '—'}
          </p>
        </ContentCard>
        <ContentCard padding="p-4">
          <p className="text-xs font-medium text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
            {fmt(currentOrder.totalPrice)}
          </p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ContentCard>
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <User size={16} className="text-green-600" />
            {isSeller ? 'Customer information' : 'Your order'}
          </h2>
          <div className="space-y-2.5 text-sm">
            {isSeller ? (
              <>
                <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{buyer.firstName} {buyer.lastName}</span></p>
                <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{buyer.email}</span></p>
                {buyer.phoneNumber && (
                  <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{buyer.phoneNumber}</span></p>
                )}
              </>
            ) : (
              <>
                <p><span className="text-muted-foreground">Quantity:</span> <span className="font-medium">{currentOrder.quantity} {product.measurementUnit}</span></p>
                <p><span className="text-muted-foreground">Payment:</span> <span className="font-medium">{currentOrder.paymentMethod?.replace('_', ' ')}</span></p>
                <p><span className="text-muted-foreground">Status:</span> <span className="font-medium">{paid ? 'Paid' : unpaid ? 'Awaiting payment' : 'Not paid'}</span></p>
              </>
            )}
          </div>
        </ContentCard>

        <ContentCard>
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Package size={16} className="text-green-600" />
            Product details
          </h2>
          <div className="space-y-2.5 text-sm">
            <p><span className="text-muted-foreground">Product:</span> <span className="font-medium">{product.name}</span></p>
            <p><span className="text-muted-foreground">Quantity:</span> <span className="font-medium">{currentOrder.quantity} {product.measurementUnit}</span></p>
            <p><span className="text-muted-foreground">Unit price:</span> <span className="font-medium">{fmt(currentOrder.totalPrice / currentOrder.quantity)}</span></p>
            <p className="font-bold text-green-600 dark:text-green-400 pt-1">Total: {fmt(currentOrder.totalPrice)}</p>
          </div>
        </ContentCard>
      </div>

      {unpaid && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {isBuyer && (
            <button
              type="button"
              onClick={handlePay}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              <CreditCard size={16} />
              Pay now
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900 text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50 transition-colors"
          >
            <XCircle size={16} />
            Cancel order
          </button>
        </div>
      )}
    </DetailPageShell>
  );
}

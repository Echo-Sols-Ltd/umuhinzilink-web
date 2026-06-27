'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useI18n } from '@/contexts/I18nContext';
import useOrderAction from '@/hooks/useOrderAction';
import { UserRole, isPaidOrder, isUnpaidOrder } from '@/types';
import { notify } from '@/lib/notify';
import { formatCurrency } from '@/lib/localeFormat';
import { Package, User, CreditCard, XCircle } from 'lucide-react';
import { orderService } from '@/services/orders';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import DetailPageShell, { ContentCard } from '@/components/layout/DetailPageShell';
import PageLoading from '@/components/layout/PageLoading';

export default function OrderDetailPage() {
  const { t, locale } = useI18n();
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

  const detailKeys = isSeller ? 'farmer.orders.detail' : 'buyer.orders';

  useEffect(() => {
    if (!orderId || !userId) return;

    let cancelled = false;
    const notFoundKey = isSeller ? 'farmer.orders.toasts.orderNotFound' : 'buyer.orders.orderNotFound';
    const failedKey = isSeller ? 'farmer.orders.toasts.failedToLoad' : 'buyer.orders.failedToLoad';

    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await orderService.getOrderById(orderId);
        if (cancelled) return;

        if (response.success && response.data) {
          setCurrentOrder(response.data);
        } else {
          notify.error(t(notFoundKey), t('common.error'));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch order:', error);
          notify.error(t(failedKey), t('common.error'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, userId, setCurrentOrder, t, isSeller]);

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
    : t('ordersPage.table.order');

  const backLabel = isSeller
    ? t('farmer.orders.detail.backToOrders')
    : t('buyer.orders.backToPurchases');

  const breadcrumbs = [
    { label: t('landing.nav.home'), href: '/' },
    { label: t('nav.myOrders'), href: '/orders' },
    ...(currentOrder ? [{ label: orderLabel }] : [{ label: t('buyer.orders.detailsBreadcrumb') }]),
  ];

  if (loading) {
    return (
      <DetailPageShell breadcrumbs={breadcrumbs} backHref="/orders" backLabel={backLabel}>
        <PageLoading
          variant="inline"
          label={t('buyer.orders.loadingLabel')}
          description={t('buyer.orders.loadingDescription')}
          className="bg-transparent dark:bg-transparent"
        />
      </DetailPageShell>
    );
  }

  if (!currentOrder) {
    return (
      <DetailPageShell breadcrumbs={breadcrumbs} backHref="/orders" backLabel={backLabel}>
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">{t(`${detailKeys}.orderNotFound`)}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {t('buyer.orders.accessDeniedDesc')}
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

  const paymentStatusLabel = paid
    ? t('ordersPage.detailsModal.paid')
    : unpaid
      ? t('buyer.orders.awaitingPayment')
      : t('buyer.orders.notPaid');

  return (
    <DetailPageShell
      breadcrumbs={breadcrumbs}
      backHref="/orders"
      backLabel={backLabel}
      actions={
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900">
          {t(`enums.orderStatus.${currentOrder.status}`)}
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
          <p className="text-xs font-medium text-muted-foreground">{t(`${detailKeys}.product`)}</p>
          <p className="text-sm font-bold text-foreground mt-1 truncate">{product.name}</p>
        </ContentCard>
        <ContentCard padding="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            {isSeller ? t('farmer.orders.detail.customer') : t('buyer.orders.seller')}
          </p>
          <p className="text-sm font-bold text-foreground mt-1 truncate">
            {isSeller
              ? `${buyer.firstName} ${buyer.lastName}`
              : seller ? `${seller.firstName} ${seller.lastName}` : '—'}
          </p>
        </ContentCard>
        <ContentCard padding="p-4">
          <p className="text-xs font-medium text-muted-foreground">{t('buyer.orders.total')}</p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
            {formatCurrency(currentOrder.totalPrice, locale)}
          </p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ContentCard>
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <User size={16} className="text-green-600" />
            {isSeller ? t('farmer.orders.detail.customerInfo') : t('buyer.orders.yourOrder')}
          </h2>
          <div className="space-y-2.5 text-sm">
            {isSeller ? (
              <>
                <p><span className="text-muted-foreground">{t(`${detailKeys}.name`)}:</span> <span className="font-medium">{buyer.firstName} {buyer.lastName}</span></p>
                <p><span className="text-muted-foreground">{t(`${detailKeys}.email`)}:</span> <span className="font-medium">{buyer.email}</span></p>
                {buyer.phoneNumber && (
                  <p><span className="text-muted-foreground">{t(`${detailKeys}.phone`)}:</span> <span className="font-medium">{buyer.phoneNumber}</span></p>
                )}
              </>
            ) : (
              <>
                <p><span className="text-muted-foreground">{t('buyer.orders.quantity')}:</span> <span className="font-medium">{currentOrder.quantity} {product.measurementUnit}</span></p>
                <p><span className="text-muted-foreground">{t('buyer.orders.paymentMethod')}:</span> <span className="font-medium">{t(`enums.paymentMethod.${currentOrder.paymentMethod}`)}</span></p>
                <p><span className="text-muted-foreground">{t('buyer.orders.paymentStatus')}:</span> <span className="font-medium">{paymentStatusLabel}</span></p>
              </>
            )}
          </div>
        </ContentCard>

        <ContentCard>
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Package size={16} className="text-green-600" />
            {t(`${detailKeys}.productDetails`)}
          </h2>
          <div className="space-y-2.5 text-sm">
            <p><span className="text-muted-foreground">{t(`${detailKeys}.productName`)}:</span> <span className="font-medium">{product.name}</span></p>
            <p><span className="text-muted-foreground">{t(`${detailKeys}.quantity`)}:</span> <span className="font-medium">{currentOrder.quantity} {product.measurementUnit}</span></p>
            <p><span className="text-muted-foreground">{t(`${detailKeys}.unitPrice`)}:</span> <span className="font-medium">{formatCurrency(currentOrder.totalPrice / currentOrder.quantity, locale)}</span></p>
            <p className="font-bold text-green-600 dark:text-green-400 pt-1">
              {t('buyer.orders.total')}: {formatCurrency(currentOrder.totalPrice, locale)}
            </p>
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
              {t('buyer.orders.payNow')}
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900 text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 disabled:opacity-50 transition-colors"
          >
            <XCircle size={16} />
            {t('buyer.orders.cancelOrder')}
          </button>
        </div>
      )}
    </DetailPageShell>
  );
}

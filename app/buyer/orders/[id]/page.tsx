'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, Order, DeliveryStatus } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { notify } from '@/lib/notify';
import { ArrowLeft, Truck, Calendar, Package, User, MapPin, CreditCard } from 'lucide-react';

import { useI18n } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';

function BuyerOrderDetailPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const {
    buyingOrders: buyerOrders,
    currentOrder: currentBuyerOrder,
    setCurrentOrder: setCurrentBuyerOrder,
    fetchBuyingOrders: fetchBuyerOrders
  } = useOrder();

  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);

      try {
        // Step 1: Check if order is already in context lists
        let foundOrder = buyerOrders?.find(o => o.id === orderId);

        // Step 2: Check if it's the current context order
        if (!foundOrder && currentBuyerOrder?.id === orderId) {
          foundOrder = currentBuyerOrder;
        }

        if (foundOrder) {
          // ✅ Found in context - use immediately
          setCurrentBuyerOrder(foundOrder);
          setLoading(false);
        } else {
          // ❌ Not in context - fetch from server
          const { orderService } = await import('@/services/orders');
          const response = await orderService.getOrderById(orderId);

          if (response.success && response.data) {
            // Store in context for future use and real-time updates
            setCurrentBuyerOrder(response.data);

            // Refresh the list to include this order for future navigation
            fetchBuyerOrders();
          } else {
            notify.error(t('buyer.orders.orderNotFound'), t('common.error'));
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error(t('buyer.orders.failedToLoad'), t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, buyerOrders, currentBuyerOrder, setCurrentBuyerOrder, fetchBuyerOrders, t]);

  const handleBack = () => {
    router.push('/buyer/purchases');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
        </main>
      </div>
    );
  }

  if (!currentBuyerOrder) {
    return (
      <div className="flex h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('buyer.orders.orderNotFound')}</h2>
            <p className="text-muted-foreground">{t('buyer.orders.orderNotFoundDesc')}</p>
            <button
              onClick={handleBack}
              className="mt-6 bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors"
            >
              {t('buyer.orders.backToPurchases')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const buyer = currentBuyerOrder.buyer;
  const product = currentBuyerOrder.product;

  return (
    <div className="flex h-screen bg-background">
      <Navbar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-success transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('buyer.orders.backToPurchases')}</span>
            </button>
            <div className="h-4 w-px bg-border"></div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">{t('buyer.orders.details')}</h1>
            <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded">#{currentBuyerOrder.id.slice(0, 8)}</span>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Package className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.orders.product')}</p>
                  <p className="font-semibold text-foreground truncate max-w-[150px]">{product.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <User className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.orders.farmer')}</p>
                  <p className="font-semibold text-foreground truncate max-w-[150px]">{currentBuyerOrder.product.owner.firstName ? `${currentBuyerOrder.product.owner.firstName} ${currentBuyerOrder.product.owner.lastName}` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.orders.totalAmount')}</p>
                  <p className="font-semibold text-foreground">{formatCurrency(currentBuyerOrder.totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center border-b pb-2">
                <User className="w-5 h-5 mr-2 text-info" />
                {t('buyer.orders.buyerInfo')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.name')}</label>
                  <p className="text-foreground col-span-2 font-medium">{buyer.firstName} {buyer.lastName}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.email')}</label>
                  <p className="text-foreground col-span-2">{buyer.email}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.phone')}</label>
                  <p className="text-foreground col-span-2">{buyer.phoneNumber || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.location')}</label>
                  <p className="text-foreground col-span-2">{buyer ? `${buyer.district}, ${buyer.province}` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center border-b pb-2">
                <Package className="w-5 h-5 mr-2 text-success" />
                {t('buyer.orders.productDetails')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.productName')}</label>
                  <p className="text-foreground col-span-2 font-medium">{product.name}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.quantity')}</label>
                  <p className="text-foreground col-span-2 font-semibold">
                    {currentBuyerOrder.quantity} {product.measurementUnit}
                  </p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.unitPrice')}</label>
                  <p className="text-foreground col-span-2">{formatCurrency(currentBuyerOrder.totalPrice / currentBuyerOrder.quantity)}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.totalPrice')}</label>
                  <p className="text-lg font-bold text-success col-span-2">{formatCurrency(currentBuyerOrder.totalPrice)}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.paymentMethod')}</label>
                  <p className="text-foreground col-span-2 uppercase text-sm">{currentBuyerOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div className="grid grid-cols-3">
                  <label className="text-sm font-medium text-muted-foreground">{t('buyer.orders.paymentStatus')}</label>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${currentBuyerOrder.isPaid ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {currentBuyerOrder.isPaid ? t('buyer.orders.paid') : t('buyer.orders.unpaid')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center border-b pb-2">
              <Truck className="w-5 h-5 mr-2 text-success" />
              {t('buyer.orders.deliveryTracking')}
            </h2>
            {currentBuyerOrder.delivery ? (
              <DeliveryTracker
                delivery={currentBuyerOrder.delivery}
                onUpdateStatus={() => { }} // Buyer cannot update delivery status
                isLoading={false}
                orderType="buyer"
                isOrderOwner={false}
                isPaid={currentBuyerOrder.isPaid}
              />
            ) : (
              <div className="py-12 text-center bg-muted/30 rounded-lg">
                <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground">{t('buyer.orders.deliveryNotAvailable')}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{t('buyer.orders.deliveryNotAvailableDesc')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BuyerOrderDetailPageWithGuard() {
  return (
    <BuyerGuard>
      <BuyerOrderDetailPage />
    </BuyerGuard>
  );
}

export default BuyerOrderDetailPageWithGuard;

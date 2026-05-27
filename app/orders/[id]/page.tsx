'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserRole, Order } from '@/types';
import FarmerGuard from '@/contexts/guard/SellerGuard';
import { notify } from '@/lib/notify';
import { ArrowLeft, Package, Calendar, User, MapPin, CreditCard } from 'lucide-react';
import { orderService } from '@/services/orders';
import { useI18n } from '@/contexts/I18nContext';

function FarmerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const {
    sellingOrders,
    currentOrder,
    setCurrentOrder,
    fetchSellingOrders
  } = useOrder();
  const { updateOrderStatus } = useOrderAction();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);

      try {
        // Step 1: Check if order is already in context lists
        let foundOrder = sellingOrders?.find((o: Order) => o.id === orderId);

        if (!foundOrder && currentOrder?.id === orderId) {
          foundOrder = currentOrder;
        }

        if (foundOrder) {
          setCurrentOrder(foundOrder);
          setLoading(false);
        } else {
          const response = await orderService.getOrderById(orderId);

          if (response.success && response.data) {
            setCurrentOrder(response.data);
            fetchSellingOrders();
          } else {
            notify.error(t('farmer.orders.toasts.orderNotFound'), t('common.error'));
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error(t('farmer.orders.toasts.failedToLoad'), t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, sellingOrders, currentOrder, setCurrentOrder, fetchSellingOrders]);



  const handleBack = () => {
    router.push('/farmer/orders');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex h-screen bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('farmer.orders.detail.orderNotFound')}</h2>
            <p className="text-muted-foreground">{t('farmer.orders.detail.orderNotFoundDesc')}</p>
          </div>
        </main>
      </div>
    );
  }

  const buyer = currentOrder.buyer;
  const product = currentOrder.product;

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      <main className="flex-1 h-full bg-background overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('farmer.orders.detail.backToOrders')}</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">{t('farmer.orders.detail.title')}</h1>
            <span className="text-sm text-muted-foreground">#{currentOrder.id.slice(0, 8)}</span>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Package className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('farmer.orders.detail.product')}</p>
                  <p className="font-semibold text-foreground">{product.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <User className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('farmer.orders.detail.customer')}</p>
                  <p className="font-semibold text-foreground">{buyer.firstName} {buyer.lastName}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('farmer.orders.detail.totalAmount')}</p>
                  <p className="font-semibold text-foreground">RWF {currentOrder.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-success" />
                {t('farmer.orders.detail.customerInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.name')}</label>
                  <p className="text-foreground">{buyer.firstName} {buyer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.email')}</label>
                  <p className="text-foreground">{buyer.email}</p>
                </div>
                {buyer.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.phone')}</label>
                    <p className="text-foreground">{buyer.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-success" />
                {t('farmer.orders.detail.productDetails')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.productName')}</label>
                  <p className="text-foreground">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.quantity')}</label>
                  <p className="text-foreground">{currentOrder.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.unitPrice')}</label>
                  <p className="text-foreground">RWF {(currentOrder.totalPrice / currentOrder.quantity).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.totalPrice')}</label>
                  <p className="text-lg font-semibold text-success">RWF {currentOrder.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.paymentMethod')}</label>
                  <p className="text-foreground">{currentOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.orders.detail.paymentStatus')}</label>
                  <p className={`font-medium ${currentOrder.status === 'COMPLETED' ? 'text-success' : 'text-destructive'}`}>
                    {currentOrder.status === 'COMPLETED' ? t('farmer.orders.detail.paid') : t('farmer.orders.detail.unpaid')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FarmerOrderDetailPageWithGuard() {
  return (
    <FarmerGuard>
      <FarmerOrderDetailPage />
    </FarmerGuard>
  );
}

export default FarmerOrderDetailPageWithGuard;

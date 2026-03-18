'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, Order } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { DeliveryStatus } from '@/types';
import { notify } from '@/lib/notify';
import { ArrowLeft, Package, Calendar, User, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

function FarmerSupplierOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { buyingOrders: supplierOrders } = useOrder();
  const { updateSupplierOrderStatus } = useOrderAction();
  const { t } = useI18n();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Find order in the existing supplierOrders
        const foundOrder = supplierOrders?.find(o => o.id === orderId) || null;
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Fallback to API call if not found in context
          const { orderService } = await import('@/services/orders');
          const response = await orderService.getOrderById(orderId);
          if (response.success && response.data) {
            setOrder(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error(t('farmer.supplierOrders.toasts.failedToLoad'), t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, supplierOrders]);

  const handleUpdateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!order) return;

    setUpdatingStatus(true);
    try {
      await updateSupplierOrderStatus(order.id, newStatus);

      // Update local order state
      setOrder(prev => prev ? {
        ...prev,
        delivery: prev.delivery ? {
          ...prev.delivery,
          status: newStatus,
          trackingSteps: [
            ...(prev.delivery.trackingSteps || []),
            {
              status: newStatus,
              completedAt: new Date().toISOString(),
              completed: true
            }
          ]
        } : undefined
      } : null);

      notify.success(`Order delivery status has been updated successfully.`, "Delivery Status Updated");
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      notify.error(t('farmer.supplierOrders.toasts.updateFailed'), t('common.error'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBack = () => {
    router.push('/farmer/supplier-orders');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem='Supplier Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem='Supply Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('farmer.supplierOrders.detail.orderNotFound')}</h2>
            <p className="text-muted-foreground">{t('farmer.supplierOrders.detail.orderNotFoundDesc')}</p>
          </div>
        </main>
      </div>
    );
  }

  const supplier = order.buyer;
  const product = order.product;
  const isOwner = order.product.owner === user

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.FARMER} activeItem='Supply Orders' />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('farmer.supplierOrders.detail.backToOrders')}</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">{t('farmer.supplierOrders.detail.title')}</h1>
            <span className="text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
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
                  <p className="text-sm text-muted-foreground">{t('farmer.supplierOrders.detail.product')}</p>
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
                  <p className="text-sm text-muted-foreground">{t('farmer.supplierOrders.detail.supplier')}</p>
                  <p className="font-semibold text-foreground">{supplier.firstName} {supplier.lastName}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('farmer.supplierOrders.detail.totalAmount')}</p>
                  <p className="font-semibold text-foreground">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-success" />
                {t('farmer.supplierOrders.detail.supplierInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.name')}</label>
                  <p className="text-foreground">{supplier.firstName} {supplier.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.email')}</label>
                  <p className="text-foreground">{supplier.email}</p>
                </div>
                {supplier.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.phone')}</label>
                    <p className="text-foreground">{supplier.phoneNumber}</p>
                  </div>
                )}
                {supplier && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.supplierAddress')}</label>
                    <p className="text-foreground">
                      {supplier.district}, {supplier.province}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Input Item Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-success" />
                {t('farmer.supplierOrders.detail.productDetails')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.productName')}</label>
                  <p className="text-foreground">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.quantity')}</label>
                  <p className="text-foreground">{order.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.unitPrice')}</label>
                  <p className="text-foreground">RWF {product.unitPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.totalPrice')}</label>
                  <p className="text-lg font-semibold text-success">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.paymentMethod')}</label>
                  <p className="text-foreground">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('farmer.supplierOrders.detail.paymentStatus')}</label>
                  <p className={`font-medium ${order.isPaid ? 'text-success' : 'text-destructive'}`}>
                    {order.isPaid ? t('farmer.supplierOrders.detail.paid') : t('farmer.supplierOrders.detail.unpaid')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-success" />
              {t('farmer.supplierOrders.detail.deliveryTracking')}
            </h2>
            <DeliveryTracker
              delivery={order.delivery}
              onUpdateStatus={handleUpdateDeliveryStatus}
              isLoading={updatingStatus}
              orderType="supplier"
              isOrderOwner={isOwner}
              isPaid={order.isPaid}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FarmerSupplierOrderDetailPageWithGuard() {
  return (
    <FarmerGuard>
      <FarmerSupplierOrderDetailPage />
    </FarmerGuard>
  );
}

export default FarmerSupplierOrderDetailPageWithGuard;

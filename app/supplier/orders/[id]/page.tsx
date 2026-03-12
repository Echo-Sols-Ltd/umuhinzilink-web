'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, Order } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { DeliveryStatus } from '@/types';
import { notify } from '@/lib/notify';
import { ArrowLeft, Package, Calendar, User, MapPin, CreditCard, ShoppingCart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

function SupplierOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    supplierOrders, 
    currentSupplierOrder, 
    setCurrentSupplierOrder,
    fetchSupplierOrders 
  } = useOrder();
  const { updateSupplierOrderStatus } = useOrderAction();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      
      try {
        // Step 1: Check if order is already in context lists
        let foundOrder = supplierOrders?.find(o => o.id === orderId);
        
        // Step 2: Check if it's the current context order
        if (!foundOrder && currentSupplierOrder?.id === orderId) {
          foundOrder = currentSupplierOrder;
        }
        
        if (foundOrder) {
          // ✅ Found in context - use immediately
          setCurrentSupplierOrder(foundOrder);
          setLoading(false);
        } else {
          // ❌ Not in context - fetch from server
          const { orderService } = await import('@/services/orders');
          const response = await orderService.getSupplierOrderById(orderId);
          
          if (response.success && response.data) {
            // Store in context for future use and real-time updates
            setCurrentSupplierOrder(response.data);
            
            // Refresh the list to include this order for future navigation
            fetchSupplierOrders();
          } else {
            notify.error(t('supplier.orders.toasts.orderNotFound'), t('common.error'));
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error(t('supplier.orders.toasts.failedToLoad'), t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, supplierOrders, currentSupplierOrder, setCurrentSupplierOrder, fetchSupplierOrders]);

  const handleUpdateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!currentSupplierOrder) return;

    setUpdatingStatus(true);
    try {
      await updateSupplierOrderStatus(currentSupplierOrder.id, newStatus);

      // Context will automatically update via socket events
      // No need to manually update local state
      notify.success(`Order delivery status has been updated successfully.`, "Delivery Status Updated");
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      notify.error(t('supplier.orders.toasts.updateFailed'), t('common.error'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBack = () => {
    router.push('/supplier/orders');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.SUPPLIER} activeItem='Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
        </main>
      </div>
    );
  }

  if (!currentSupplierOrder) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.SUPPLIER} activeItem='Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('supplier.orders.detail.orderNotFound')}</h2>
            <p className="text-muted-foreground">{t('supplier.orders.detail.orderNotFoundDesc')}</p>
          </div>
        </main>
      </div>
    );
  }

  const buyer = currentSupplierOrder.buyer;
  const product = currentSupplierOrder.product;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.SUPPLIER} activeItem='Orders' />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('supplier.orders.detail.backToOrders')}</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">{t('supplier.orders.detail.title')}</h1>
            <span className="text-sm text-muted-foreground">#{currentSupplierOrder.id.slice(0, 8)}</span>
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
                  <p className="text-sm text-muted-foreground">{t('supplier.orders.detail.product')}</p>
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
                  <p className="text-sm text-muted-foreground">{t('supplier.orders.detail.farmer')}</p>
                  <p className="font-semibold text-foreground">{buyer.names}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('supplier.orders.detail.totalAmount')}</p>
                  <p className="font-semibold text-foreground">RWF {currentSupplierOrder.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farmer Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-success" />
                {t('supplier.orders.detail.farmerInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.name')}</label>
                  <p className="text-foreground">{buyer.names}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.email')}</label>
                  <p className="text-foreground">{buyer.email}</p>
                </div>
                {buyer.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.phone')}</label>
                    <p className="text-foreground">{buyer.phoneNumber}</p>
                  </div>
                )}
                {buyer.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.deliveryAddress')}</label>
                    <p className="text-foreground">
                      {buyer.address.district}, {buyer.address.province}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Input Item Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-success" />
                {t('supplier.orders.detail.productDetails')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.productName')}</label>
                  <p className="text-foreground">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.quantity')}</label>
                  <p className="text-foreground">{currentSupplierOrder.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.unitPrice')}</label>
                  <p className="text-foreground">RWF {(currentSupplierOrder.totalPrice / currentSupplierOrder.quantity).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.totalPrice')}</label>
                  <p className="text-lg font-semibold text-success">RWF {currentSupplierOrder.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.paymentMethod')}</label>
                  <p className="text-foreground">{currentSupplierOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('supplier.orders.detail.paymentStatus')}</label>
                  <p className={`font-medium ${currentSupplierOrder.isPaid ? 'text-success' : 'text-destructive'}`}>
                    {currentSupplierOrder.isPaid ? t('supplier.orders.detail.paid') : t('supplier.orders.detail.unpaid')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-success" />
              {t('supplier.orders.detail.deliveryTracking')}
            </h2>
            <DeliveryTracker
              delivery={currentSupplierOrder.delivery}
              onUpdateStatus={handleUpdateDeliveryStatus}
              isLoading={updatingStatus}
              orderType="supplier"
              isOrderOwner={true}
              isPaid={currentSupplierOrder.isPaid}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function SupplierOrderDetailPageWithGuard() {
  return (
    <SupplierGuard>
      <SupplierOrderDetailPage />
    </SupplierGuard>
  );
}

export default SupplierOrderDetailPageWithGuard;

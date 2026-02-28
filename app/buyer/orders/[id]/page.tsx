'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, FarmerOrder, DeliveryStatus } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { notify } from '@/lib/notify';
import { ArrowLeft, Truck, Calendar, Package, User, MapPin, CreditCard } from 'lucide-react';

function BuyerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { buyerOrders } = useOrder();

  const [order, setOrder] = useState<FarmerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Find order in the existing buyerOrders
        const foundOrder = buyerOrders?.find(o => o.id === orderId) || null;
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Fallback to API call if not found in context
          const { orderService } = await import('@/services/orders');
          const response = await orderService.getFarmerOrderById(orderId);
          if (response.success && response.data) {
            setOrder(response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        notify.error("Failed to load order details", "Error");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, buyerOrders]);

  const handleBack = () => {
    router.push('/buyer/purchases');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.BUYER} activeItem='Purchases' />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.BUYER} activeItem='Purchases' />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h2>
            <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const product = order.product;
  const farmer = order.product.owner;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.BUYER} activeItem='Purchases' />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Purchases</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">Order Details</h1>
            <span className="text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Package className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold text-foreground">{product.name}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <User className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Farmer</p>
                  <p className="font-semibold text-foreground">{farmer.names}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-foreground">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farmer Information */}
            <div className="bg-card rounded-lg p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-success" />
                Farmer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <p className="text-foreground">{farmer.names}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <p className="text-foreground">{farmer.email}</p>
                </div>
                {farmer.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <p className="text-foreground">{farmer.phoneNumber}</p>
                  </div>
                )}
                {farmer.address && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <p className="text-foreground">
                      {farmer.address.district}, {farmer.address.province}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-card rounded-lg p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-success" />
                Product Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Product Name</label>
                  <p className="text-foreground">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Quantity</label>
                  <p className="text-foreground">{order.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Unit Price</label>
                  <p className="text-foreground">RWF {product.unitPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Total Price</label>
                  <p className="text-lg font-semibold text-success">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Payment Method</label>
                  <p className="text-foreground">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Payment Status</label>
                  <p className={`font-medium ${order.isPaid ? 'text-success' : 'text-destructive'}`}>
                    {order.isPaid ? 'PAID' : 'UNPAID'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-card rounded-lg p-6 border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-success" />
              Delivery Tracking
            </h2>
            {order.delivery ? (
              <DeliveryTracker
                delivery={order.delivery}
                onUpdateStatus={() => { }} // Buyers cannot update status
                isLoading={false}
                orderType="buyer"
                isOrderOwner={false} // Buyers are never order owners for delivery updates
              />
            ) : (
              <div className="bg-card rounded-lg p-6 text-center">
                <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Delivery information not yet available</p>
                <p className="text-sm text-muted-foreground mt-2">The farmer will update delivery status once the order is processed.</p>
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

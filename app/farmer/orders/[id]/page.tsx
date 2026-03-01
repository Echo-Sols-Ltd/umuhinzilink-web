'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, FarmerOrder } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { DeliveryStatus } from '@/types/enums';
import { notify } from '@/lib/notify';
import { ArrowLeft, Package, Calendar, User, MapPin, CreditCard } from 'lucide-react';
import { orderService } from '@/services/orders';

function FarmerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const {
    farmerOrders,
    currentFarmerOrder,
    setCurrentFarmerOrder,
    fetchFarmerOrders
  } = useOrder();
  const { updateFarmerOrderStatus } = useOrderAction();

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);

      try {
        // Step 1: Check if order is already in context lists
        let foundOrder = farmerOrders?.find(o => o.id === orderId);

        // Step 2: Check if it's the current context order
        if (!foundOrder && currentFarmerOrder?.id === orderId) {
          foundOrder = currentFarmerOrder;
        }

        if (foundOrder) {

          setCurrentFarmerOrder(foundOrder);
          setLoading(false);
        } else {
          const response = await orderService.getFarmerOrderById(orderId);

          if (response.success && response.data) {
            setCurrentFarmerOrder(response.data);
            fetchFarmerOrders();
          } else {
            notify.error("Order not found", "Error");
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
      loadOrder();
    }
  }, [orderId, farmerOrders, currentFarmerOrder, setCurrentFarmerOrder, fetchFarmerOrders]);

  const handleUpdateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!currentFarmerOrder) return;

    setUpdatingStatus(true);
    try {
      await updateFarmerOrderStatus(currentFarmerOrder.id, newStatus);
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      notify.error("Failed to update delivery status. Please try again.", "Update Failed");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBack = () => {
    router.push('/farmer/orders');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem='Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </div>
    );
  }

  if (!currentFarmerOrder) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem='Orders' />
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

  const buyer = currentFarmerOrder.buyer;
  const product = currentFarmerOrder.product;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem='Customer Orders' />

      <main className="flex-1 h-full bg-background overflow-auto">
        {/* Header */}
        <header className="bg-card border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">Order Details</h1>
            <span className="text-sm text-muted-foreground">#{currentFarmerOrder.id.slice(0, 8)}</span>
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
                  <p className="text-sm text-muted-foreground">Product</p>
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
                  <p className="text-sm text-muted-foreground">Customer</p>
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
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-foreground">RWF {currentFarmerOrder.totalPrice.toLocaleString()}</p>
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
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{buyer.names}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{buyer.email}</p>
                </div>
                {buyer.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{buyer.phoneNumber}</p>
                  </div>
                )}
                {buyer.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivery Address</label>
                    <p className="text-foreground">
                      {buyer.address.district}, {buyer.address.province}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-success" />
                Product Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p className="text-foreground">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                  <p className="text-foreground">{currentFarmerOrder.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unit Price</label>
                  <p className="text-foreground">RWF {(currentFarmerOrder.totalPrice / currentFarmerOrder.quantity).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Price</label>
                  <p className="text-lg font-semibold text-success">RWF {currentFarmerOrder.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <p className="text-foreground">{currentFarmerOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                  <p className={`font-medium ${currentFarmerOrder.isPaid ? 'text-success' : 'text-destructive'}`}>
                    {currentFarmerOrder.isPaid ? 'PAID' : 'UNPAID'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-success" />
              Delivery Tracking
            </h2>
            <DeliveryTracker
              delivery={currentFarmerOrder.delivery}
              onUpdateStatus={handleUpdateDeliveryStatus}
              isLoading={updatingStatus}
              orderType="farmer"
              isOrderOwner={true}
            />
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

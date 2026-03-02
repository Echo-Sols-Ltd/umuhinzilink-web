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
  const { 
    buyerOrders, 
    currentBuyerOrder, 
    setCurrentBuyerOrder,
    fetchBuyerOrders 
  } = useOrder();

  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;

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
          const response = await orderService.getFarmerOrderById(orderId);
          
          if (response.success && response.data) {
            // Store in context for future use and real-time updates
            setCurrentBuyerOrder(response.data);
            
            // Refresh the list to include this order for future navigation
            fetchBuyerOrders();
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
  }, [orderId, buyerOrders, currentBuyerOrder, setCurrentBuyerOrder, fetchBuyerOrders]);

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

  if (!currentBuyerOrder) {
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

  const buyer = currentBuyerOrder.buyer;
  const product = currentBuyerOrder.product;

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
            <span className="text-sm text-muted-foreground">#{currentBuyerOrder.id.slice(0, 8)}</span>
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
                  <p className="font-semibold text-foreground">{currentBuyerOrder.product.owner.names || 'N/A'}</p>
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
                  <p className="font-semibold text-foreground">RWF {currentBuyerOrder.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div className="bg-card rounded-lg p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-info" />
                Buyer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{buyer.names}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{buyer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{buyer.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-foreground">{buyer.address ? `${buyer.address.district}, ${buyer.address.province}` : 'N/A'}</p>
                </div>
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
                  <p className="text-foreground">{currentBuyerOrder.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unit Price</label>
                  <p className="text-foreground">RWF {(currentBuyerOrder.totalPrice / currentBuyerOrder.quantity).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Price</label>
                  <p className="text-lg font-semibold text-success">RWF {currentBuyerOrder.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                  <p className="text-foreground">{currentBuyerOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                  <p className={`font-medium ${currentBuyerOrder.isPaid ? 'text-success' : 'text-destructive'}`}>
                    {currentBuyerOrder.isPaid ? 'PAID' : 'UNPAID'}
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
            {currentBuyerOrder.delivery ? (
              <DeliveryTracker
                delivery={currentBuyerOrder.delivery}
                onUpdateStatus={() => {}} // Buyer cannot update delivery status
                isLoading={false}
                orderType="buyer"
                isOrderOwner={false}
                isPaid={currentBuyerOrder.isPaid}
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

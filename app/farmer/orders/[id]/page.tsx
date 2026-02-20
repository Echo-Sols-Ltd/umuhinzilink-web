'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, FarmerOrder } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { DeliveryStatus } from '@/types/enums';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Package, Calendar, User, MapPin, CreditCard } from 'lucide-react';

function FarmerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { farmerOrders, updateFarmerOrderStatus } = useOrder();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<FarmerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Find order in the existing farmerOrders
        const foundOrder = farmerOrders?.find(o => o.id === orderId) || null;
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
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, farmerOrders, toast]);

  const handleUpdateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      await updateFarmerOrderStatus(order.id, newStatus);
      
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

      toast({
        title: "Delivery Status Updated",
        description: `Order delivery status has been updated successfully.`,
        variant: "success"
      });
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update delivery status. Please try again.",
        variant: "error"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBack = () => {
    router.push('/farmer/orders');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType={UserType.FARMER} activeItem='Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userType={UserType.FARMER} activeItem='Orders' />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600">The order you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const buyer = order.buyer;
  const product = order.product;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType={UserType.FARMER} activeItem='Orders' />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Order Details</h1>
            <span className="text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">{buyer.names}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-gray-900">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{buyer.names}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{buyer.email}</p>
                </div>
                {buyer.phoneNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{buyer.phoneNumber}</p>
                  </div>
                )}
                {buyer.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                    <p className="text-gray-900">
                      {buyer.address.district}, {buyer.address.province}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Product Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <p className="text-gray-900">{order.quantity} {product.measurementUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Unit Price</label>
                  <p className="text-gray-900">RWF {product.unitPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Price</label>
                  <p className="text-lg font-bold text-green-600">RWF {order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Status</label>
                  <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'PAID' : 'UNPAID'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Delivery Tracking
            </h2>
            <DeliveryTracker
              delivery={order.delivery}
              onUpdateStatus={handleUpdateDeliveryStatus}
              isLoading={updatingStatus}
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

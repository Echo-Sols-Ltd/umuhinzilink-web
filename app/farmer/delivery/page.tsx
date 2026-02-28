'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, FarmerOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import DeliveryTracker from '@/components/delivery/DeliveryTracker';
import { notify } from '@/lib/notify';
import { ArrowLeft, Truck, Calendar, Filter, Search, Package } from 'lucide-react';

function FarmerDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { farmerOrders } = useOrder();
  const { updateFarmerOrderStatus } = useOrderAction();

  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (farmerOrders) {
      setOrders(farmerOrders);
      setLoading(false);
    }
  }, [farmerOrders]);

  const handleUpdateDeliveryStatus = async (orderId: string, newStatus: DeliveryStatus) => {
    setUpdatingStatus(orderId);
    try {
      await updateFarmerOrderStatus(orderId, newStatus);

      notify.success(`Order delivery status has been updated successfully.`, "Delivery Status Updated");
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      notify.error("Failed to update delivery status. Please try again.", "Update Failed");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBack = () => {
    router.push('/farmer/orders');
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning/10 text-warning';
      case 'ACTIVE':
        return 'bg-info/10 text-info';
      case 'COMPLETED':
        return 'bg-success/10 text-success';
      case 'CANCELLED':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.FARMER} activeItem='Orders' />

      <main className="flex-1 overflow-auto">
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
            <h1 className="text-xl font-semibold text-foreground flex items-center">
              <Truck className="w-5 h-5 mr-2 text-success" />
              Delivery Management
            </h1>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="bg-card rounded-lg p-4 border border-border mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary px-3 py-2"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full bg-card rounded-lg p-6 text-center border border-border">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No orders match your filters.'
                    : 'No orders available.'}
                </p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">#{order.id.slice(0, 8)}</h3>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Customer</h4>
                        <p className="text-sm text-foreground">{order.buyer.names}</p>
                        <p className="text-xs text-muted-foreground">{order.buyer.email}</p>
                        {order.buyer.address && (
                          <p className="text-xs text-muted-foreground">
                            {order.buyer.address.district}, {order.buyer.address.province}
                          </p>
                        )}
                      </div>

                      {/* Product Info */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Product</h4>
                        <p className="text-sm text-foreground">{order.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.quantity} {order.product.measurementUnit} × RWF {order.product.unitPrice?.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold text-success">
                          Total: RWF {order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Tracking */}
                    {order.status !== 'PENDING' && order.status !== 'CANCELLED' ? (
                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium text-foreground mb-4 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-success" />
                          Delivery Tracking
                        </h4>
                        <DeliveryTracker
                          delivery={order.delivery}
                          onUpdateStatus={(status) => handleUpdateDeliveryStatus(order.id, status)}
                          isLoading={updatingStatus === order.id}
                          orderType="farmer"
                          isOrderOwner={true} // Farmers are owners of their orders
                        />
                      </div>
                    ) : (
                      <div className="border-t border-border pt-4">
                        <div className="bg-card rounded-lg p-4 text-center">
                          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {order.status === 'CANCELLED' ? 'Delivery is cancelled' : 'Waiting for order approval'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FarmerDeliveryManagementPage() {
  return (
    <FarmerGuard>
      <FarmerDeliveryPage />
    </FarmerGuard>
  );
}

export default FarmerDeliveryManagementPage;

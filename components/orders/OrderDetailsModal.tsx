'use client';

import React from 'react';
import {
    X,
    Package,
    User,
    MapPin,
    Calendar,
    CreditCard,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Mail,
    Phone,
    ThumbsUp
} from 'lucide-react';
import { Order, OrderStatus, DeliveryStatus, deliveryStatusOptions } from '@/types';
import OrderStatusTracker from './OrderStatusTracker';
import DeliveryTracker from '../delivery/DeliveryTracker';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';

interface OrderDetailsModalProps {
    order: FarmerOrder | SupplierOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onAccept?: (id: string) => Promise<void>;
    onCancel?: (id: string) => Promise<void>;
    onUpdateStatus?: (id: string, status: DeliveryStatus) => Promise<void>;
    onPay?: (order: any) => Promise<void>;
    onMarkSatisfaction?: (id: string) => Promise<void>;
    loading?: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    isOpen,
    onClose,
    onAccept,
    onCancel,
    onUpdateStatus,
    onPay,
    onMarkSatisfaction,
    loading = false,
}) => {
    const { user } = useAuth();

    if (!isOpen || !order) return null;

    // Determine if current user is the order owner
    // - For FarmerOrder: Farmer is owner, buyer cannot update delivery
    // - For SupplierOrder: Supplier is owner, buyer (farmer) cannot update delivery
    const isOrderOwner =
        (user?.role === UserType.FARMER && 'buyer' in order) || // Farmer viewing farmer orders
        (user?.role === UserType.SUPPLIER && 'buyer' in order); // Supplier viewing supplier orders

    // Determine order type for DeliveryTracker
    const orderType = user?.role === UserType.FARMER ? 'farmer' : 'supplier';

    const status = (order.status as string)?.toUpperCase();
    const isActionable = status === 'PENDING';
    const buyer = order.buyer;
    const product = order.product;

    // Satisfaction logic
    const isBuyer = user?.role === UserType.BUYER;
    const isDelivered = order.delivery?.trackingSteps?.some(
        step => step.status === 'DELIVERED' && step.completed
    ) || false;
    const canMarkSatisfaction = isBuyer && isDelivered && !order.isBuyerSatisfied;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-card/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-semibold text-foreground">Order Details</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase  ${status === 'PENDING' ? 'bg-warning/10 text-warning' :
                                status === 'ACTIVE' || status === 'PENDING_PAYMENT' ? 'bg-info/10 text-info' :
                                    status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                        'bg-muted text-muted-foreground'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">#{order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Order Status Tracker */}
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            Order Status
                        </h3>
                        <OrderStatusTracker
                            orderStatus={order.status}
                            deliveryStatus={(() => {
                                if (!order.delivery?.trackingSteps || order.delivery.trackingSteps.length === 0) {
                                    return undefined;
                                }
                                const latestCompletedStep = order.delivery.trackingSteps
                                    .filter(step => step.completed)
                                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
                                return latestCompletedStep?.status;
                            })()}
                            createdAt={order.createdAt}
                            updatedAt={order.updatedAt}
                        />
                    </div>

                    {/* Satisfaction Status */}
                    {isDelivered && (
                        <div className="bg-card rounded-lg border p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4 text-primary" />
                                Delivery Satisfaction
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.isBuyerSatisfied 
                                            ? 'Buyer has confirmed safe delivery' 
                                            : 'Waiting for buyer to confirm safe delivery'
                                        }
                                    </p>
                                    {order.isBuyerSatisfied && (
                                        <p className="text-xs text-green-600 mt-1">
                                            ✓ Confirmed on {order.updatedAt ? formatDate(order.updatedAt) : 'Unknown date'}
                                        </p>
                                    )}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    order.isBuyerSatisfied 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.isBuyerSatisfied ? 'Satisfied' : 'Pending'}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Buyer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Customer Information
                            </h3>
                            <div className="bg-card rounded-lg p-4 space-y-3">
                                <p className="text-sm font-medium text-foreground">{buyer.names || 'N/A'}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5" />
                                    {buyer.email}
                                </div>
                                {buyer.phoneNumber && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone className="w-3.5 h-3.5" />
                                        {buyer.phoneNumber}
                                    </div>
                                )}
                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>
                                        {buyer.address?.district ? `${buyer.address.district}, ` : ''}
                                        {buyer.address?.province || 'No address provided'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" />
                                Product Details
                            </h3>
                            <div className="bg-card rounded-lg p-4 space-y-3">
                                <p className="text-sm font-medium text-foreground">{product.name}</p>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Quantity:</span>
                                    <span className="font-semibold">{order.quantity} {product.measurementUnit}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Unit Price:</span>
                                    <span>RWF {product.unitPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border">
                                    <span>Total Price:</span>
                                    <span className="text-success">RWF {order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                Payment Method
                            </h3>
                            <div className="bg-card rounded-lg p-4">
                                <p className="text-sm text-foreground">{order.paymentMethod.replace('_', ' ')}</p>
                                <p className="text-xs mt-1 font-medium text-muted-foreground">
                                    Status: {order.isPaid ? 'PAID' : 'UNPAID'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                Order Date
                            </h3>
                            <div className="bg-card rounded-lg p-4">
                                <p className="text-sm text-foreground">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Tracking Section */}
                    {status !== 'PENDING' && status !== 'CANCELLED' && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Truck className="w-4 h-4 text-primary" />
                                Delivery Tracking
                            </h3>
                            <DeliveryTracker
                                delivery={order.delivery}
                                onUpdateStatus={(status) => onUpdateStatus?.(order.id, status)}
                                isLoading={loading}
                                orderType={orderType}
                                isOrderOwner={isOrderOwner}
                                isPaid={order.isPaid}
                            />
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-card flex items-center justify-end gap-3">
                    {onPay && !order.isPaid && status !== 'CANCELLED' && (
                        <button
                            onClick={() => onPay(order)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-primary-foreground bg-warning rounded-lg hover:bg-warning/90 shadow-md shadow-warning/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                            Pay Now
                        </button>
                    )}
                    
                    {canMarkSatisfaction && onMarkSatisfaction && (
                        <button
                            onClick={() => onMarkSatisfaction(order.id)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-primary-foreground bg-success rounded-lg hover:bg-success/90 shadow-md shadow-success/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                            Confirm Safe Delivery
                        </button>
                    )}
                    
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-background shadow-sm transition-all"
                    >
                        Close
                    </button>

                    {isActionable && onCancel && (
                        <button
                            onClick={() => onCancel(order.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 shadow-sm transition-all disabled:opacity-50"
                        >
                            Reject Order
                        </button>
                    )}

                    {isActionable && onAccept && (
                        <button
                            onClick={() => onAccept(order.id)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-primary-foreground bg-success rounded-lg hover:bg-success/90 shadow-md shadow-success/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Approve Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;

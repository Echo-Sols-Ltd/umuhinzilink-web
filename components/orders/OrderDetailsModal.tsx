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
    Phone
} from 'lucide-react';
import { FarmerOrder, SupplierOrder, OrderStatus, DeliveryStatus, deliveryStatusOptions } from '@/types';
import OrderStatusTracker from './OrderStatusTracker';

interface OrderDetailsModalProps {
    order: FarmerOrder | SupplierOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onAccept?: (id: string) => Promise<void>;
    onCancel?: (id: string) => Promise<void>;
    onUpdateStatus?: (id: string, status: DeliveryStatus) => Promise<void>;
    onPay?: (order: any) => Promise<void>;
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
    loading = false,
}) => {
    if (!isOpen || !order) return null;

    const status = (order.status as string)?.toUpperCase();
    const isActionable = true;
    const buyer = order.buyer;
    const product = order.product;

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                status === 'ACTIVE' || status === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-700' :
                                    status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">#{order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Order Status Tracker */}
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-green-600" />
                            Order Status
                        </h3>
                        <OrderStatusTracker
                            orderStatus={order.status}
                            deliveryStatus={order.delivery?.status as any}
                            createdAt={order.createdAt}
                            updatedAt={order.updatedAt}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Buyer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" />
                                Customer Information
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <p className="text-sm font-medium text-gray-900">{buyer.names || 'N/A'}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Mail className="w-3.5 h-3.5" />
                                    {buyer.email}
                                </div>
                                {buyer.phoneNumber && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Phone className="w-3.5 h-3.5" />
                                        {buyer.phoneNumber}
                                    </div>
                                )}
                                <div className="flex items-start gap-2 text-xs text-gray-600">
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
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-600" />
                                Product Details
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Quantity:</span>
                                    <span className="font-semibold">{order.quantity} {product.measurementUnit}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Unit Price:</span>
                                    <span>RWF {product.unitPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                                    <span>Total Price:</span>
                                    <span className="text-green-600">RWF {order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-green-600" />
                                Payment Method
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-700">{order.paymentMethod.replace('_', ' ')}</p>
                                <p className="text-xs mt-1 font-medium text-gray-500">
                                    Status: {order.isPaid ? 'PAID' : 'UNPAID'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Order Date
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Status Update Section (Only for Farmers/Suppliers to manage) */}
                    {onUpdateStatus && (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-green-600" />
                                Update Delivery Status
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    defaultValue={order.delivery?.status || DeliveryStatus.PENDING}
                                    onChange={(e) => onUpdateStatus(order.id, e.target.value as DeliveryStatus)}
                                    disabled={loading}
                                    className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 transition-all outline-none"
                                >
                                    {deliveryStatusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 sm:max-w-[200px]">
                                    Changing the delivery status will notify the buyer and update the tracking progress.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3">
                    {onPay && !order.isPaid && status !== 'CANCELLED' && (
                        <button
                            onClick={() => onPay(order)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-200 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                            Pay Now
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                    >
                        Close
                    </button>

                    {isActionable && onCancel && (
                        <button
                            onClick={() => onCancel(order.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm transition-all disabled:opacity-50"
                        >
                            Reject Order
                        </button>
                    )}

                    {isActionable && onAccept && (
                        <button
                            onClick={() => onAccept(order.id)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md shadow-green-200 transition-all flex items-center gap-2 disabled:opacity-50"
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

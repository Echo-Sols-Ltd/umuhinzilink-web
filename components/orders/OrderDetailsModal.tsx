'use client';

import React from 'react';
import {
    X,
    Package,
    User,
    Calendar,
    CreditCard,
    Truck,
    XCircle,
    Clock,
} from '@/lib/icons';
import { Order, OrderStatus, isUnpaidOrder, isPaidOrder, getOrderStatusLabel } from '@/types';
import OrderStatusTracker from './OrderStatusTracker';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate } from '@/lib/localeFormat';

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
    onCancel?: (id: string) => Promise<void>;
    onPay?: (order: Order) => Promise<void>;
    loading?: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    isOpen,
    onClose,
    onCancel,
    onPay,
    loading = false,
}) => {
    const { user } = useAuth();
    const { t, locale } = useI18n();

    if (!isOpen || !order) return null;

    const isBuyer = user?.id === order.buyer?.id;
    const unpaid = isUnpaidOrder(order.status);
    const paid = isPaidOrder(order.status);
    const buyer = order.buyer;
    const product = order.product;

    const paymentStatusLabel = paid
        ? t('ordersPage.detailsModal.paid')
        : unpaid
            ? t('ordersPage.detailsModal.awaitingPayment')
            : t('ordersPage.detailsModal.notPaid');

    const statusBadgeClass =
        paid ? 'bg-success/10 text-success' :
            order.status === OrderStatus.CANCELLED ? 'bg-destructive/10 text-destructive' :
                unpaid ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex items-center justify-between bg-card/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-semibold text-foreground">{t('ordersPage.detailsModal.title')}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${statusBadgeClass}`}>
                                {t(`enums.orderStatus.${order.status}`)}
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

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            {t('ordersPage.detailsModal.orderStatus')}
                        </h3>
                        <OrderStatusTracker
                            orderStatus={order.status}
                            createdAt={order.createdAt}
                            updatedAt={order.updatedAt}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                {t('ordersPage.detailsModal.customerInfo')}
                            </h3>
                            <div className="bg-card rounded-lg p-4 space-y-3">
                                <p className="text-sm font-medium text-foreground">{buyer.firstName} {buyer.lastName}</p>
                                <p className="text-xs text-muted-foreground">{buyer.email}</p>
                                {buyer.phoneNumber && (
                                    <p className="text-xs text-muted-foreground">{buyer.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" />
                                {t('ordersPage.detailsModal.productDetails')}
                            </h3>
                            <div className="bg-card rounded-lg p-4 space-y-3">
                                <p className="text-sm font-medium text-foreground">{product.name}</p>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{t('ordersPage.detailsModal.quantity')}</span>
                                    <span className="font-semibold">{order.quantity} {product.measurementUnit}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{t('ordersPage.detailsModal.unitPrice')}</span>
                                    <span>{formatCurrency(product.unitPrice ?? 0, locale)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border">
                                    <span>{t('ordersPage.detailsModal.totalPrice')}</span>
                                    <span className="text-success">{formatCurrency(order.totalPrice, locale)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                {t('ordersPage.detailsModal.payment')}
                            </h3>
                            <div className="bg-card rounded-lg p-4">
                                <p className="text-sm text-foreground">{t(`enums.paymentMethod.${order.paymentMethod}`)}</p>
                                <p className="text-xs mt-1 font-medium text-muted-foreground">
                                    {paymentStatusLabel}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {t('ordersPage.detailsModal.orderDate')}
                            </h3>
                            <div className="bg-card rounded-lg p-4">
                                <p className="text-sm text-foreground">
                                    {formatDate(order.createdAt, locale, {
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-card flex items-center justify-end gap-3">
                    {isBuyer && unpaid && onPay && (
                        <button
                            onClick={() => onPay(order)}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-primary-foreground bg-warning rounded-lg hover:bg-warning/90 shadow-md shadow-warning/20 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                            {t('ordersPage.detailsModal.payNow')}
                        </button>
                    )}

                    {unpaid && onCancel && (
                        <button
                            onClick={() => onCancel(order.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            {t('ordersPage.detailsModal.cancelOrder')}
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-background shadow-sm transition-all"
                    >
                        {t('ordersPage.detailsModal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;

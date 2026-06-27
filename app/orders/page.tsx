'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Package, Eye, CheckCircle, XCircle,
    AlertCircle, TrendingUp, Wallet,
    ChevronRight, User, CreditCard,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useI18n } from '@/contexts/I18nContext';
import useOrderAction from '@/hooks/useOrderAction';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { formatCurrency, formatDate } from '@/lib/localeFormat';
import { OrderStatus, Order, UserRole, isUnpaidOrder } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Partial<Record<OrderStatus, { icon: React.ElementType; cls: string; dot: string }>> = {
    PENDING_PAYMENT: { icon: AlertCircle, cls: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400', dot: 'bg-amber-500' },
    PENDING: { icon: AlertCircle, cls: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400', dot: 'bg-amber-500' },
    COMPLETED: { icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    CONFIRMED: { icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    CANCELLED: { icon: XCircle, cls: 'text-red-500   bg-red-50    dark:bg-red-950/30    dark:text-red-400', dot: 'bg-red-500' },
};

const DEFAULT_STATUS = STATUS_CONFIG.PENDING_PAYMENT!;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string | number; sub?: string;
    icon: React.ElementType; accent?: boolean;
}) {
    return (
        <div className={`rounded-2xl border border-border p-4 flex flex-col gap-1 ${accent ? 'bg-green-600 border-green-600' : 'bg-white dark:bg-gray-900'
            }`}>
            <div className={`flex items-center gap-2 ${accent ? 'text-green-200' : 'text-muted-foreground'}`}>
                <Icon size={13} />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className={`text-xl font-extrabold ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
            {sub && <p className={`text-xs ${accent ? 'text-green-200' : 'text-muted-foreground'}`}>{sub}</p>}
        </div>
    );
}

function StatusBadge({ status }: { status: OrderStatus }) {
    const { t } = useI18n();
    const { icon: Icon, cls } = STATUS_CONFIG[status] ?? DEFAULT_STATUS;
    const label = t(`enums.orderStatus.${status}`);
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={10} /> {label}
        </span>
    );
}

function SkeletonRow({ columnCount }: { columnCount: number }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columnCount }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </td>
            ))}
        </tr>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
    const { t, locale } = useI18n();
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const isSeller = user?.role === UserRole.SELLER;
    const {
        orders,
        loading,
        fetchBuyingOrders,
        fetchSellingOrders,
        ordersTotalPages: totalPages,
        ordersTotalElements: totalElements,
    } = useOrder();
    const { loading: actionLoading, payOrder, cancelOrder } = useOrderAction();

    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchOrders = useCallback((pageIndex: number) => {
        if (isSeller) {
            return fetchSellingOrders(pageIndex, ITEMS_PER_PAGE);
        }
        return fetchBuyingOrders(pageIndex, ITEMS_PER_PAGE);
    }, [isSeller, fetchBuyingOrders, fetchSellingOrders]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/auth/signin?redirect=/orders');
        }
    }, [authLoading, isAuthenticated, router]);

    const userId = user?.id;

    useEffect(() => {
        if (!userId) return;
        fetchOrders(page - 1);
    }, [page, userId, isSeller, fetchOrders]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, isSeller]);

    const handleOpenOrder = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handlePay = async (order: Order) => {
        const paid = await payOrder(order.id);
        if (paid) {
            await fetchOrders(page - 1);
            setModalOpen(false);
        }
    };

    const handleCancel = async (id: string) => {
        const cancelled = await cancelOrder(id);
        if (cancelled) {
            await fetchOrders(page - 1);
            setModalOpen(false);
        }
    };

    const getFilterLabel = (s: OrderStatus | 'ALL') => {
        if (s === 'ALL') {
            return isSeller ? t('farmer.orders.filters.all') : t('buyer.purchases.filters.all');
        }
        if (s === 'PENDING_PAYMENT') {
            return t('enums.orderStatus.PENDING_PAYMENT');
        }
        return t(`enums.orderStatus.${s}`);
    };

    // ── Metrics ───────────────────────────────────────────────────────────

    const metrics = useMemo(() => ({
        total: totalElements ?? orders.length,
        revenue: isSeller
            ? orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.totalPrice, 0)
            : orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.totalPrice, 0),
        pending: orders.filter(o => isUnpaidOrder(o.status)).length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
    }), [orders, totalElements, isSeller]);

    const filtered = useMemo(() => {
        if (statusFilter === 'ALL') return orders;
        if (statusFilter === OrderStatus.PENDING_PAYMENT) {
            return orders.filter(o => isUnpaidOrder(o.status));
        }
        return orders.filter(o => o.status === statusFilter);
    }, [orders, statusFilter]);

    const tableColumnCount = isSeller ? 8 : 7;

    const tableHeaders = isSeller
        ? [
            t('ordersPage.table.order'),
            t('farmer.orders.table.buyer'),
            t('farmer.orders.table.product'),
            t('ordersPage.table.qty'),
            t('ordersPage.table.total'),
            t('farmer.orders.table.status'),
            t('farmer.orders.table.date'),
            t('farmer.orders.table.action'),
        ]
        : [
            t('ordersPage.table.order'),
            t('buyer.purchases.table.product'),
            t('ordersPage.table.qty'),
            t('ordersPage.table.total'),
            t('buyer.purchases.table.status'),
            t('buyer.purchases.table.date'),
            t('buyer.purchases.table.actions'),
        ];

    if (!authLoading && !isAuthenticated) {
        return null;
    }

    if (authLoading) {
        return (
            <AppLayout maxWidth="max-w-6xl">
                <PageLoading
                    fullScreen={false}
                    label={t('ordersPage.loadingLabel')}
                    description={t('ordersPage.loadingDescription')}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout maxWidth="max-w-6xl">
            <PageHeader
                title={isSeller ? t('farmer.orders.title') : t('buyer.purchases.title')}
                description={isSeller ? t('ordersPage.description.seller') : t('ordersPage.description.buyer')}
                actions={
                    <Link
                        href="/dashboard"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        {t('common.dashboard')} <ChevronRight size={12} />
                    </Link>
                }
            />

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard
                        icon={Package}
                        label={isSeller ? t('farmer.orders.metrics.total') : t('buyer.purchases.stats.totalPurchases')}
                        value={metrics.total}
                        accent
                    />
                    <StatCard
                        icon={isSeller ? TrendingUp : Wallet}
                        label={isSeller ? t('farmer.orders.metrics.revenue') : t('buyer.purchases.stats.totalSpent')}
                        value={formatCurrency(metrics.revenue, locale)}
                        sub={t('ordersPage.stats.completedOnly')}
                    />
                    <StatCard
                        icon={AlertCircle}
                        label={t('buyer.purchases.filters.pendingPayment')}
                        value={metrics.pending}
                        sub={t('ordersPage.stats.awaitingPayment')}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label={isSeller ? t('farmer.orders.status.completed') : t('buyer.purchases.stats.completed')}
                        value={metrics.completed}
                    />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-muted-foreground">{t('ordersPage.filter')}</span>
                    {(['ALL', OrderStatus.PENDING_PAYMENT, OrderStatus.COMPLETED, OrderStatus.CANCELLED] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s === 'ALL' ? 'ALL' : s)}
                            className={`h-8 px-3 text-xs font-semibold rounded-xl border transition-colors ${statusFilter === s
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground'
                                }`}>
                            {getFilterLabel(s)}
                        </button>
                    ))}
                    {statusFilter !== 'ALL' && (
                        <span className="text-xs text-muted-foreground ml-1">
                            {filtered.length === 1
                                ? t('ordersPage.results', { count: filtered.length })
                                : t('ordersPage.resultsPlural', { count: filtered.length })}
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                                    {tableHeaders.map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columnCount={tableColumnCount} />)
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={tableColumnCount} className="py-20 text-center">
                                            <Package size={32} className="text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-foreground">
                                                {isSeller ? t('farmer.orders.table.noOrders') : t('buyer.purchases.noOrders')}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {statusFilter !== 'ALL'
                                                    ? t('ordersPage.empty.tryDifferentFilter')
                                                    : isSeller
                                                        ? t('ordersPage.empty.sellerHint')
                                                        : t('ordersPage.empty.buyerHint')}
                                            </p>
                                        </td>
                                    </tr>
                                ) : filtered.map(order => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                                        {/* Order number */}
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-foreground text-xs">
                                                {order.orderNumber ?? '#' + order.id.slice(0, 6).toUpperCase()}
                                            </p>
                                        </td>

                                        {/* Buyer (sellers only) */}
                                        {isSeller && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                                                        <User size={12} className="text-green-700 dark:text-green-300" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-foreground text-xs truncate max-w-[140px]">
                                                            {order.buyer?.firstName} {order.buyer?.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-medium text-foreground truncate max-w-[180px]">
                                                {order.product?.name ?? '—'}
                                            </p>
                                        </td>

                                        {/* Qty */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-foreground font-medium">
                                                {order.quantity} {order.product?.measurementUnit?.toLowerCase()}
                                            </p>
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-bold text-green-700 dark:text-green-400">
                                                {formatCurrency(order.totalPrice, locale)}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(order.createdAt, locale)}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {user?.role === UserRole.BUYER && isUnpaidOrder(order.status) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePay(order)}
                                                        disabled={actionLoading}
                                                        aria-label={t('ordersPage.actions.payOrder')}
                                                        className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 disabled:opacity-50 transition-colors"
                                                    >
                                                        <CreditCard size={13} />
                                                        {t('buyer.purchases.pay')}
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenOrder(order)}
                                                    aria-label={t('ordersPage.actions.viewSummary')}
                                                    className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-medium rounded-lg border border-border bg-white dark:bg-gray-900 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <Eye size={13} />
                                                    {t('ordersPage.actions.summary')}
                                                </button>
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    aria-label={t('ordersPage.actions.openFullPage')}
                                                    className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-medium rounded-lg border border-border bg-white dark:bg-gray-900 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    {t('ordersPage.actions.open')}
                                                    <ChevronRight size={13} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-xs text-muted-foreground">
                                {t('ordersPage.pagination.pageOf', {
                                    page,
                                    totalPages,
                                    total: totalElements,
                                })}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                    className="h-8 px-3 text-xs border border-border rounded-lg bg-white dark:bg-gray-900 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    {t('ordersPage.pagination.prev')}
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                    const n = i + 1;
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-8 h-8 text-xs rounded-lg transition-colors ${page === n
                                                ? 'bg-green-600 text-white'
                                                : 'border border-border bg-white dark:bg-gray-900 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}>
                                            {n}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || loading}
                                    className="h-8 px-3 text-xs border border-border rounded-lg bg-white dark:bg-gray-900 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    {t('ordersPage.pagination.next')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onPay={user?.role === UserRole.BUYER ? handlePay : undefined}
                onCancel={handleCancel}
                loading={actionLoading}
            />
        </AppLayout>
    );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Package, Eye, CheckCircle, XCircle,
    AlertCircle, Clock, TrendingUp, Wallet,
    Sprout, ChevronRight, User, Filter,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import { OrderStatus, Order } from '@/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; cls: string; dot: string }> = {
    PENDING: { label: 'Pending', icon: AlertCircle, cls: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400', dot: 'bg-amber-500' },
    CONFIRMED: { label: 'Confirmed', icon: CheckCircle, cls: 'text-blue-600  bg-blue-50  dark:bg-blue-950/30  dark:text-blue-400', dot: 'bg-blue-500' },
    COMPLETED: { label: 'Completed', icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    CANCELLED: { label: 'Cancelled', icon: XCircle, cls: 'text-red-500   bg-red-50    dark:bg-red-950/30    dark:text-red-400', dot: 'bg-red-500' },
};

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function fmtDate(s: string) {
    return new Date(s).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' });
}

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
    const { label, icon: Icon, cls } = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
            <Icon size={10} /> {label}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </td>
            ))}
        </tr>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SellerOrdersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        sellingOrders,
        loading,
        fetchBuyingOrders,
        sellingOrdersTotalPages: totalPages,
        sellingOrdersTotalElements: totalElements,
    } = useOrder();
    const { loading: actionLoading } = useOrderAction();

    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [page, setPage] = useState(1);

    const orders: Order[] = useMemo(() => sellingOrders ?? [], [sellingOrders]);

    useEffect(() => {
        fetchBuyingOrders(page - 1, ITEMS_PER_PAGE);
    }, [page]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    // ── Metrics ───────────────────────────────────────────────────────────

    const metrics = useMemo(() => ({
        total: totalElements ?? orders.length,
        revenue: orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.totalPrice, 0),
        pending: orders.filter(o => o.status === 'PENDING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
    }), [orders, totalElements]);

    const filtered = useMemo(() =>
        statusFilter === 'ALL' ? orders : orders.filter(o => o.status === statusFilter),
        [orders, statusFilter]
    );


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <header className="sticky top-0 z-40 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Sprout size={18} className="text-green-600" />
                    <span className="text-sm font-bold text-foreground">My Orders</span>
                </div>
                <Link
                    href="/dashboard"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    Dashboard <ChevronRight size={12} />
                </Link>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard icon={Package} label="Total orders" value={metrics.total} accent />
                    <StatCard icon={TrendingUp} label="Revenue" value={fmt(metrics.revenue)} sub="completed only" />
                    <StatCard icon={AlertCircle} label="Pending" value={metrics.pending} sub="need action" />
                    <StatCard icon={CheckCircle} label="Completed" value={metrics.completed} />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-muted-foreground" />
                    {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as OrderStatus)}
                            className={`h-8 px-3 text-xs font-semibold rounded-xl border transition-colors ${statusFilter === s
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground'
                                }`}>
                            {s === 'ALL' ? 'All' : STATUS_CONFIG[s].label}
                        </button>
                    ))}
                    {statusFilter !== 'ALL' && (
                        <span className="text-xs text-muted-foreground ml-1">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-gray-50 dark:bg-gray-800/50">
                                    {['Order', 'Buyer', 'Product', 'Qty', 'Total', 'Status', 'Date', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <Package size={32} className="text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-foreground">No orders found</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {statusFilter !== 'ALL'
                                                    ? 'Try a different filter'
                                                    : 'Orders will appear here when buyers place them'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : filtered.map(order => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">

                                        {/* Order number */}
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-foreground text-xs">
                                                {order.orderNumber ?? '#' + order.id.slice(0, 6).toUpperCase()}
                                            </p>
                                        </td>

                                        {/* Buyer */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                                                    <User size={12} className="text-green-700 dark:text-green-300" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-foreground text-xs truncate max-w-[100px]">
                                                        {order.buyer?.firstName} {order.buyer?.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-medium text-foreground truncate max-w-[120px]">
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
                                                {fmt(order.totalPrice)}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <StatusBadge status={order.status} />
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {fmtDate(order.createdAt)}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                    <Eye size={14} />
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
                                Page {page} of {totalPages} · {totalElements} orders
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                    className="h-8 px-3 text-xs border border-border rounded-lg bg-white dark:bg-gray-900 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Prev
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
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

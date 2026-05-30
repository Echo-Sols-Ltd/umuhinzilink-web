'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Sprout, TrendingUp, Clock, CheckCircle,
    XCircle, AlertCircle, Package, User,
    ChevronRight, Search, Filter, Loader2,
    MessageSquare, DollarSign, Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn, imageUrl } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

type NegotiationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
type UserRole = 'BUYER' | 'SELLER';
type TabFilter = 'ALL' | NegotiationStatus;

interface NegotiationSummary {
    id: string;
    status: NegotiationStatus;
    buyerProposedPrice: number;
    agreedPrice?: number;
    expiresAt: string;
    createdAt: string;
    unreadCount: number;
    order: {
        id: string;
        orderNumber: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            image?: string;
            unitPrice: number;
            measurementUnit: string;
            category: string;
        };
        buyer: {
            id: string;
            firstName: string;
            lastName: string;
        };
        seller?: {
            id: string;
            displayName: string;
        };
    };
}

// ── Mock data — remove when wired ─────────────────────────────────────────────

const MOCK: NegotiationSummary[] = [
    {
        id: 'neg-1', status: 'PENDING', buyerProposedPrice: 12000, agreedPrice: 13500,
        expiresAt: new Date(Date.now() + 2 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(), unreadCount: 2,
        order: {
            id: 'ord-1', orderNumber: 'ORD-2026-004821', quantity: 5,
            product: { id: 'p1', name: 'Fresh Maize', unitPrice: 15000, measurementUnit: 'BAG_50KG', category: 'CEREALS' },
            buyer: { id: 'b1', firstName: 'Mukamana', lastName: 'Alice' },
            seller: { id: 's1', displayName: 'Mugisha Farm' },
        },
    },
    {
        id: 'neg-2', status: 'ACCEPTED', buyerProposedPrice: 7500, agreedPrice: 8000,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0,
        order: {
            id: 'ord-2', orderNumber: 'ORD-2026-003112', quantity: 10,
            product: { id: 'p2', name: 'Irish Potatoes', unitPrice: 9000, measurementUnit: 'BAG_25KG', category: 'ROOTS_TUBERS' },
            buyer: { id: 'b2', firstName: 'Niyonzima', lastName: 'Bob' },
            seller: { id: 's1', displayName: 'Mugisha Farm' },
        },
    },
    {
        id: 'neg-3', status: 'REJECTED', buyerProposedPrice: 3000,
        expiresAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), unreadCount: 0,
        order: {
            id: 'ord-3', orderNumber: 'ORD-2026-001999', quantity: 3,
            product: { id: 'p3', name: 'Tomatoes', unitPrice: 5000, measurementUnit: 'CRATE', category: 'VEGETABLES' },
            buyer: { id: 'b3', firstName: 'Uwera', lastName: 'Claire' },
            seller: { id: 's1', displayName: 'Mugisha Farm' },
        },
    },
    {
        id: 'neg-4', status: 'EXPIRED', buyerProposedPrice: 20000,
        expiresAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), unreadCount: 0,
        order: {
            id: 'ord-4', orderNumber: 'ORD-2026-000743', quantity: 2,
            product: { id: 'p4', name: 'NPK Fertiliser', unitPrice: 42000, measurementUnit: 'BAG_50KG', category: 'FERTILISER' },
            buyer: { id: 'b4', firstName: 'Habimana', lastName: 'David' },
            seller: { id: 's1', displayName: 'AgriSupplies Kigali' },
        },
    },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<NegotiationStatus, {
    label: string; icon: React.ElementType;
    bg: string; text: string; dot: string;
}> = {
    PENDING:   { label: 'Pending',   icon: AlertCircle,  bg: 'bg-amber-50 dark:bg-amber-950/30',   text: 'text-amber-600 dark:text-amber-400',   dot: 'bg-amber-500' },
    ACCEPTED:  { label: 'Accepted',  icon: CheckCircle,  bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    REJECTED:  { label: 'Rejected',  icon: XCircle,      bg: 'bg-red-50 dark:bg-red-950/30',        text: 'text-red-500',                          dot: 'bg-red-500' },
    EXPIRED:   { label: 'Expired',   icon: Clock,        bg: 'bg-gray-100 dark:bg-gray-800',        text: 'text-gray-500',                         dot: 'bg-gray-400' },
};

const TABS: { key: TabFilter; label: string }[] = [
    { key: 'ALL',      label: 'All' },
    { key: 'PENDING',  label: 'Active' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'EXPIRED',  label: 'Expired' },
];

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function expiryLabel(dateStr: string, status: NegotiationStatus) {
    if (status !== 'PENDING') return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hrs}h left`;
    if (hrs > 0) return `${hrs}h left`;
    return 'Expiring soon';
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: number; icon: React.ElementType; color: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ── Negotiation card ──────────────────────────────────────────────────────────

function NegotiationCard({ neg, role }: { neg: NegotiationSummary; role: UserRole }) {
    const { label, icon: Icon, bg, text, dot } = STATUS_CONFIG[neg.status];
    const product = neg.order.product;
    const expiry = expiryLabel(neg.expiresAt, neg.status);
    const otherName = role === 'SELLER'
        ? `${neg.order.buyer.firstName} ${neg.order.buyer.lastName}`
        : neg.order.seller?.displayName ?? 'Seller';

    const finalPrice = neg.agreedPrice ?? neg.buyerProposedPrice;
    const discount = Math.round((1 - neg.buyerProposedPrice / product.unitPrice) * 100);
    const isActive = neg.status === 'PENDING';

    return (
        <Link
            href={`/negotiations/${neg.id}`}
            className="group block bg-white dark:bg-gray-900 rounded-2xl border border-border hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 overflow-hidden">

            <div className="p-4">
                <div className="flex items-start gap-3">

                    {/* Product image */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        {product.image ? (
                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-300 dark:text-gray-600" />
                            </div>
                        )}
                        {/* Status dot */}
                        <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${dot} ring-2 ring-white dark:ring-gray-800`} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                    <User size={10} />
                                    <span className="truncate">{otherName}</span>
                                </p>
                            </div>

                            {/* Unread badge */}
                            {neg.unreadCount > 0 && (
                                <span className="shrink-0 w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
                                    {neg.unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Order ref + qty */}
                        <p className="text-xs text-muted-foreground mt-1.5">
                            {neg.order.orderNumber} · {neg.order.quantity} {product.measurementUnit?.replace(/_/g, ' ').toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* Price section */}
                <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Offered</p>
                            <p className="text-sm font-extrabold text-foreground">
                                {fmt(neg.buyerProposedPrice)}
                            </p>
                        </div>

                        {discount > 0 && (
                            <>
                                <ChevronRight size={12} className="text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Listed</p>
                                    <p className="text-xs text-muted-foreground line-through">{fmt(product.unitPrice)}</p>
                                </div>
                            </>
                        )}

                        {neg.agreedPrice && neg.agreedPrice !== neg.buyerProposedPrice && (
                            <>
                                <ChevronRight size={12} className="text-muted-foreground" />
                                <div>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold tracking-wider">Agreed</p>
                                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{fmt(neg.agreedPrice)}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Status badge */}
                    <span className={cn(
                        'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                        bg, text
                    )}>
                        <Icon size={11} /> {label}
                    </span>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar size={10} /> {timeAgo(neg.createdAt)}
                        </span>
                        {expiry && (
                            <span className={cn(
                                'flex items-center gap-1 font-medium',
                                expiry === 'Expiring soon' ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
                            )}>
                                <Clock size={10} /> {expiry}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold group-hover:gap-2 transition-all">
                        {isActive ? (
                            <><MessageSquare size={12} /> Chat</>
                        ) : (
                            <>View</>
                        )}
                        <ChevronRight size={12} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ tab, role }: { tab: TabFilter; role: UserRole }) {
    return (
        <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
                <TrendingUp size={28} className="text-green-400" />
            </div>
            <h3 className="text-base font-bold text-foreground">
                {tab === 'ALL' ? 'No negotiations yet' : `No ${tab.toLowerCase()} negotiations`}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {tab === 'ALL'
                    ? role === 'BUYER'
                        ? 'Browse products and start negotiating with sellers.'
                        : 'Negotiations from buyers will appear here.'
                    : 'Nothing matches this filter.'}
            </p>
            {tab === 'ALL' && role === 'BUYER' && (
                <Link
                    href="/products"
                    className="mt-5 flex items-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    Browse products
                </Link>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function NegotiationsPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Derive role from user — adjust based on your UserRole type
    const role: UserRole = (user as any)?.role === 'SELLER' ? 'SELLER' : 'BUYER';

    const [negotiations, setNegotiations] = useState<NegotiationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<TabFilter>('ALL');
    const [search, setSearch] = useState('');

    // ── Load ──────────────────────────────────────────────────────────────

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // TODO: const res = role === 'SELLER'
                //     ? await negotiationService.getSellerNegotiations()
                //     : await negotiationService.getBuyerNegotiations();
                // setNegotiations(res.data.content);
                await new Promise(r => setTimeout(r, 700));
                setNegotiations(MOCK); // remove when wired
            } catch {
                //
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [role]);

    // ── Filter ────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        let list = tab === 'ALL' ? negotiations : negotiations.filter(n => n.status === tab);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(n =>
                n.order.product.name.toLowerCase().includes(q) ||
                n.order.orderNumber.toLowerCase().includes(q) ||
                `${n.order.buyer.firstName} ${n.order.buyer.lastName}`.toLowerCase().includes(q)
            );
        }
        return list;
    }, [negotiations, tab, search]);

    // ── Metrics ───────────────────────────────────────────────────────────

    const metrics = useMemo(() => ({
        total: negotiations.length,
        active: negotiations.filter(n => n.status === 'PENDING').length,
        accepted: negotiations.filter(n => n.status === 'ACCEPTED').length,
        unread: negotiations.reduce((s, n) => s + n.unreadCount, 0),
    }), [negotiations]);

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-600" />
                        <span className="text-sm font-bold text-foreground">Negotiations</span>
                        {metrics.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
                                {metrics.unread}
                            </span>
                        )}
                    </div>
                    {role === 'BUYER' && (
                        <Link
                            href="/products"
                            className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors">
                            <Sprout size={12} /> Browse
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Total" value={metrics.total} icon={TrendingUp} color="bg-green-50 dark:bg-green-950/30 text-green-600" />
                    <StatCard label="Active" value={metrics.active} icon={AlertCircle} color="bg-amber-50 dark:bg-amber-950/30 text-amber-600" />
                    <StatCard label="Accepted" value={metrics.accepted} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" />
                    <StatCard label="Unread" value={metrics.unread} icon={MessageSquare} color="bg-blue-50 dark:bg-blue-950/30 text-blue-600" />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by product, order number or name…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {TABS.map(({ key, label }) => {
                        const count = key === 'ALL'
                            ? negotiations.length
                            : negotiations.filter(n => n.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={cn(
                                    'flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-xl border whitespace-nowrap transition-colors shrink-0',
                                    tab === key
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground'
                                )}>
                                {label}
                                {count > 0 && (
                                    <span className={cn(
                                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        tab === key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-4 animate-pulse space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                                        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
                                    </div>
                                </div>
                                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState tab={tab} role={role} />
                ) : (
                    <div className="space-y-3">
                        {filtered.map(neg => (
                            <NegotiationCard key={neg.id} neg={neg} role={role} />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}
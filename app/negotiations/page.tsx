'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Sprout, TrendingUp, Clock, CheckCircle,
    XCircle, AlertCircle, Package, User,
    ChevronRight, Search, Filter, Loader2,
    MessageSquare, DollarSign, Calendar,
} from '@/lib/icons';
import { useAuth } from '@/contexts/AuthContext';
import { cn, imageUrl } from '@/lib/utils';
import { useNegotiation } from '@/contexts/NegotiationContext';
import NegotiationCard from '@/components/negotiation/NegotiationCard';
import { UserRole } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';

// ── Types ─────────────────────────────────────────────────────────────────────

type NegotiationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
type TabFilter = 'ALL' | NegotiationStatus;



const TABS: { key: TabFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Active' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'EXPIRED', label: 'Expired' },
];




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
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const { negotiations, loading } = useNegotiation()

    const [tab, setTab] = useState<TabFilter>('ALL');
    const [search, setSearch] = useState('');
    const [productFilter, setProductFilter] = useState<string | null>(null);
    const [sellerFilter, setSellerFilter] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/auth/signin?redirect=/negotiations');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setProductFilter(params.get('product'));
        setSellerFilter(params.get('seller'));
    }, []);



    // ── Filter ────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        let list = tab === 'ALL' ? negotiations : negotiations.filter(n => n.status === tab);
        if (productFilter) {
            list = list.filter(n => n.order.product.id === productFilter);
        }
        if (sellerFilter) {
            list = list.filter(n => n.order.product.owner?.id === sellerFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(n =>
                n.order.product.name.toLowerCase().includes(q) ||
                n.order.orderNumber.toLowerCase().includes(q) ||
                `${n.order.buyer.firstName} ${n.order.buyer.lastName}`.toLowerCase().includes(q)
            );
        }
        return list;
    }, [negotiations, tab, search, productFilter, sellerFilter]);

    // ── Metrics ───────────────────────────────────────────────────────────

    const metrics = useMemo(() => ({
        total: negotiations.length,
        active: negotiations.filter(n => n.status === 'PENDING').length,
        accepted: negotiations.filter(n => n.status === 'ACCEPTED').length,
    }), [negotiations]);

    // ── Render ────────────────────────────────────────────────────────────

    if (!authLoading && !isAuthenticated) {
        return null;
    }

    if (authLoading || !user) {
        return (
            <AppLayout maxWidth="max-w-6xl">
                <PageLoading fullScreen={false} label="Loading negotiations" description="Fetching your active deals…" />
            </AppLayout>
        );
    }

    return (
        <AppLayout maxWidth="max-w-6xl">
            <PageHeader
                title="Negotiations"
                description="Track price discussions and deals with buyers or sellers."
                actions={
                    user?.role === 'BUYER' ? (
                        <Link
                            href="/products"
                            className="flex items-center gap-1.5 h-9 px-4 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors">
                            <Sprout size={12} /> Browse products
                        </Link>
                    ) : undefined
                }
            />

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Total" value={metrics.total} icon={TrendingUp} color="bg-green-50 dark:bg-green-950/30 text-green-600" />
                    <StatCard label="Active" value={metrics.active} icon={AlertCircle} color="bg-amber-50 dark:bg-amber-950/30 text-amber-600" />
                    <StatCard label="Accepted" value={metrics.accepted} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
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
                    productFilter ? (
                        <div className="py-20 flex flex-col items-center text-center">
                            <h3 className="text-base font-bold text-foreground">No negotiation for this product yet</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                Start a negotiation from the product page to discuss pricing with the seller.
                            </p>
                            <Link
                                href={`/products/${productFilter}${sellerFilter ? '?negotiate=1' : ''}`}
                                className="mt-5 flex items-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
                                View product
                            </Link>
                        </div>
                    ) : (
                        <EmptyState tab={tab} role={user.role} />
                    )
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {filtered.map(neg => (
                            <NegotiationCard key={neg.id} neg={neg} role={user.role} />
                        ))}
                    </div>
                )}

        </AppLayout>
    );
}
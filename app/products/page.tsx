'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Package, Eye, Edit3, Trash2,
    ChevronRight, MoreVertical, TrendingUp,
    AlertTriangle, XCircle, FileText, Filter,
    LayoutGrid, List, Sprout, ArrowUpDown,
    CheckCircle, Clock, PauseCircle,
} from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import ProductList from '@/components/products/ProductList';
import { ProductGridSkeleton } from '@/components/layout/PageLoading';

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DRAFT' | 'DISCONTINUED';
type SortKey = 'name' | 'unitPrice' | 'stockQuantity' | 'viewCount' | 'createdAt';
type ViewMode = 'grid' | 'list';




const CATEGORY_LABELS: Record<string, string> = {
    CEREALS: 'Cereals', LEGUMES_PULSES: 'Legumes', ROOTS_TUBERS: 'Roots & Tubers',
    BANANAS_PLANTAINS: 'Bananas', VEGETABLES: 'Vegetables', FRUITS: 'Fruits',
    CASH_CROPS: 'Cash Crops', OILSEEDS: 'Oilseeds', SPICES_HERBS: 'Spices',
    FODDER_FORAGE: 'Fodder', FERTILISER: 'Fertiliser', PESTICIDE: 'Pesticide',
    HERBICIDE: 'Herbicide', FUNGICIDE: 'Fungicide', SEEDS_SEEDLINGS: 'Seeds',
    IRRIGATION: 'Irrigation', HAND_TOOLS: 'Tools', MACHINERY: 'Machinery',
    STORAGE_EQUIPMENT: 'Storage', PACKAGING: 'Packaging',
    ANIMAL_FEED: 'Animal Feed', VETERINARY: 'Veterinary', OTHER: 'Other',
};




// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
                <Package size={28} className="text-green-400" />
            </div>
            <h3 className="text-base font-bold text-foreground">
                {filtered ? 'No listings match your filters' : 'No listings yet'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {filtered
                    ? 'Try adjusting your search or filter to find what you are looking for.'
                    : ''}
            </p>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Products() {
    const { products, loading, error, } = useProduct()
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
    const [sortKey, setSortKey] = useState<SortKey>('createdAt');
    const [sortAsc, setSortAsc] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 6;

    const filtered = useMemo(() => {
        let result = products || [];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(l =>
                l.name.toLowerCase().includes(q) ||
                (CATEGORY_LABELS[l.category] ?? '').toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'ALL') result = result.filter(l => l.status === statusFilter);
        result = [...result].sort((a, b) => {
            const av = a[sortKey] as number | string;
            const bv = b[sortKey] as number | string;
            return sortAsc
                ? av < bv ? -1 : av > bv ? 1 : 0
                : av > bv ? -1 : av < bv ? 1 : 0;
        });
        return result;
    }, [products, search, statusFilter, sortKey, sortAsc]);


    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortAsc(v => !v);
        else { setSortKey(key); setSortAsc(false); }
        setPage(1);
    };

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <AppLayout>
            <PageHeader
                title="Browse products"
                description="Discover fresh produce and farm supplies from sellers across Rwanda."
            />

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search listings…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>
                    {/* Sort + view mode */}
                    <div className="flex items-center gap-2">
                        <select
                            value={sortKey}
                            onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
                            className="h-9 px-2.5 text-xs bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="createdAt">Newest</option>
                            <option value="name">Name</option>
                            <option value="unitPrice">Price</option>
                            <option value="stockQuantity">Stock</option>
                        </select>
                        <button
                            onClick={() => setSortAsc(v => !v)}
                            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-900 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowUpDown size={14} />
                        </button>
                        <div className="flex items-center bg-white dark:bg-gray-900 border border-border rounded-xl overflow-hidden">
                            {(['grid', 'list'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setViewMode(m)}
                                    className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === m
                                        ? 'bg-green-600 text-white'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}>
                                    {m === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {search || statusFilter !== 'ALL' ? (
                    <p className="text-xs text-muted-foreground">
                        {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
                        {search && <> for "<span className="font-medium text-foreground">{search}</span>"</>}
                    </p>
                ) : null}

                {/* Listings */}
                {loading ? (
                    <ProductGridSkeleton count={PAGE_SIZE} />
                ) : paginated.length === 0 ? (
                    <EmptyState filtered={!!(search || statusFilter !== 'ALL')} />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginated.map(l => (
                            <ProductCard key={l.id} product={l} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border divide-y divide-border overflow-hidden">
                        {paginated.map(l => (
                            <ProductList key={l.id} listing={l} onDelete={() => { }} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="h-9 px-4 text-sm font-medium bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            Prev
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${page === i + 1
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white dark:bg-gray-900 border border-border text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="h-9 px-4 text-sm font-medium bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            Next
                        </button>
                    </div>
                )}

        </AppLayout>
    );
}
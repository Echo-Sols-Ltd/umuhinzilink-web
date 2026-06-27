'use client';

import { useState, useMemo } from 'react';
import {
    Search, Package, ArrowUpDown,
    LayoutGrid, List,
} from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useI18n } from '@/contexts/I18nContext';
import { Product, ProductCategory } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import ProductList from '@/components/products/ProductList';
import { ProductGridSkeleton } from '@/components/layout/PageLoading';

type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DRAFT' | 'DISCONTINUED';
type SortKey = 'name' | 'unitPrice' | 'stockQuantity' | 'viewCount' | 'createdAt';
type ViewMode = 'grid' | 'list';

function categoryLabel(category: string, t: (key: string) => string): string {
    const direct = t(`enums.categories.${category}`);
    if (direct !== `enums.categories.${category}`) return direct;
    const enumKey = Object.keys(ProductCategory).find(
        (k) => ProductCategory[k as keyof typeof ProductCategory] === category,
    );
    if (enumKey) {
        const translated = t(`enums.categories.${enumKey}`);
        if (translated !== `enums.categories.${enumKey}`) return translated;
    }
    return category;
}

function EmptyState({ filtered }: { filtered: boolean }) {
    const { t } = useI18n();
    return (
        <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
                <Package size={28} className="text-green-400" />
            </div>
            <h3 className="text-base font-bold text-foreground">
                {filtered ? t('products.browse.empty.filtered') : t('products.browse.empty.none')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {filtered ? t('products.browse.empty.filteredHint') : ''}
            </p>
        </div>
    );
}

export default function Products() {
    const { products, loading } = useProduct();
    const { t } = useI18n();
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
                categoryLabel(String(l.category), t).toLowerCase().includes(q)
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
    }, [products, search, statusFilter, sortKey, sortAsc, t]);

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    return (
        <AppLayout>
            <PageHeader
                title={t('products.browse.title')}
                description={t('products.browse.description')}
            />

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={t('products.browse.searchPlaceholder')}
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={sortKey}
                        onChange={e => { setSortKey(e.target.value as SortKey); setPage(1); }}
                        className="h-9 px-2.5 text-xs bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="createdAt">{t('products.browse.sort.newest')}</option>
                        <option value="name">{t('products.browse.sort.name')}</option>
                        <option value="unitPrice">{t('products.browse.sort.price')}</option>
                        <option value="stockQuantity">{t('products.browse.sort.stock')}</option>
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

            {search || statusFilter !== 'ALL' ? (
                <p className="text-xs text-muted-foreground">
                    {filtered.length === 1
                        ? t('products.browse.results', { count: filtered.length })
                        : t('products.browse.resultsPlural', { count: filtered.length })}
                    {search && (
                        <> {t('products.browse.resultsFor')} "<span className="font-medium text-foreground">{search}</span>"</>
                    )}
                </p>
            ) : null}

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

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-9 px-4 text-sm font-medium bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        {t('products.pagination.prev')}
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
                        {t('products.pagination.next')}
                    </button>
                </div>
            )}

        </AppLayout>
    );
}

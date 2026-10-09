'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Package, ArrowUpDown,
  LayoutGrid, List, CheckCircle, AlertTriangle, XCircle, FileText, PauseCircle,
} from '@/lib/icons';
import ProductCard from '@/components/products/ProductCard';
import { useProduct } from '@/contexts/ProductContext';
import { useI18n } from '@/contexts/I18nContext';
import { Product, ProductStatus } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import { ProductGridSkeleton } from '@/components/layout/PageLoading';
import SellerGuard from '@/contexts/guard/SellerGuard';

type SortKey = 'name' | 'unitPrice' | 'stockQuantity' | 'viewCount' | 'createdAt';
type ViewMode = 'grid' | 'list';

function SummaryBar({ listings }: { listings: Product[] }) {
  const { t } = useI18n();
  const total = listings.length;
  const inStock = listings.filter((l) => l.status === 'IN_STOCK').length;
  const lowStock = listings.filter((l) => l.status === 'LOW_STOCK').length;
  const outOfStock = listings.filter((l) => l.status === 'OUT_OF_STOCK').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: t('products.seller.metrics.total'), value: total, color: 'text-foreground' },
        { label: t('products.seller.metrics.inStock'), value: inStock, color: 'text-emerald-600 dark:text-emerald-400' },
        { label: t('products.seller.metrics.lowStock'), value: lowStock, color: 'text-amber-600 dark:text-amber-400' },
        { label: t('products.seller.metrics.outOfStock'), value: outOfStock, color: 'text-red-500' },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-900 border border-border rounded-2xl px-4 py-3 text-center shadow-sm"
        >
          <p className={`text-xl font-extrabold ${color}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  const { t } = useI18n();
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
        <Package size={28} className="text-green-400" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        {filtered ? t('products.seller.empty.filtered') : t('products.seller.empty.none')}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        {filtered
          ? t('products.seller.empty.filteredHint')
          : t('products.seller.empty.noneHint')}
      </p>
      {!filtered && (
        <Link
          href="/products/create"
          className="mt-5 flex items-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={15} /> {t('products.seller.addFirstListing')}
        </Link>
      )}
    </div>
  );
}

export default function SellerListings() {
  return (
    <SellerGuard>
      <SellerListingsContent />
    </SellerGuard>
  );
}

function SellerListingsContent() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const { myProducts: listings, loading } = useProduct();

  const filtered = useMemo(() => {
    let result = listings ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          String(l.category).toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((l) => l.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      return sortAsc ? (av < bv ? -1 : av > bv ? 1 : 0) : av > bv ? -1 : av < bv ? 1 : 0;
    });
    return result;
  }, [listings, search, statusFilter, sortKey, sortAsc]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const statusFilters = [
    'ALL',
    ProductStatus.IN_STOCK,
    ProductStatus.LOW_STOCK,
    ProductStatus.OUT_OF_STOCK,
    ProductStatus.DRAFT,
  ] as const;

  return (
    <AppLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t('products.seller.title')}
        description={t('products.seller.description')}
        actions={
          <Link
            href="/products/create"
            className="flex items-center gap-1.5 h-9 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus size={13} /> {t('products.seller.newListing')}
          </Link>
        }
      />

      <SummaryBar listings={listings ?? []} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={t('products.seller.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`h-9 px-3 text-xs font-medium rounded-xl border transition-colors ${
                statusFilter === s
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'ALL' ? t('products.seller.filterAll') : t(`enums.productStatus.${s}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value as SortKey);
              setPage(1);
            }}
            className="h-9 px-2.5 text-xs bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="createdAt">{t('products.browse.sort.newest')}</option>
            <option value="name">{t('products.browse.sort.name')}</option>
            <option value="unitPrice">{t('products.browse.sort.price')}</option>
            <option value="stockQuantity">{t('products.browse.sort.stock')}</option>
            <option value="viewCount">{t('products.seller.sort.views')}</option>
          </select>
          <button
            type="button"
            onClick={() => setSortAsc((v) => !v)}
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-900 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowUpDown size={14} />
          </button>
          <div className="flex items-center bg-white dark:bg-gray-900 border border-border rounded-xl overflow-hidden">
            {(['grid', 'list'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  viewMode === m
                    ? 'bg-green-600 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {search || statusFilter !== 'ALL' ? (
        <p className="text-xs text-muted-foreground">
          {filtered.length === 1
            ? t('products.seller.results', { count: filtered.length })
            : t('products.seller.resultsPlural', { count: filtered.length })}
        </p>
      ) : null}

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : paginated.length === 0 ? (
        <EmptyState filtered={!!(search || statusFilter !== 'ALL')} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((l) => (
            <ProductCard key={l.id} product={l} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-sm">
          {paginated.map((l) => (
            <div key={l.id} className="p-3">
              <ProductCard product={l} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-9 px-4 text-sm font-medium bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {t('products.pagination.prev')}
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${
                  page === i + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-900 border border-border text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-9 px-4 text-sm font-medium bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {t('products.pagination.next')}
          </button>
        </div>
      )}
    </AppLayout>
  );
}

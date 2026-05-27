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

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DRAFT' | 'DISCONTINUED';
type SortKey = 'name' | 'unitPrice' | 'stockQuantity' | 'viewCount' | 'createdAt';
type ViewMode = 'grid' | 'list';

interface Listing {
  id: string;
  name: string;
  image?: string;
  category: string;
  unitPrice: number;
  stockQuantity: number;
  measurementUnit: string;
  status: ProductStatus;
  isNegotiable: boolean;
  viewCount: number;
  activeNegotiations: number;
  createdAt: string;
}

// ── Mock data — replace with API call ─────────────────────────────────────────

const MOCK_LISTINGS: Listing[] = [
  { id: '1', name: 'Fresh Maize', category: 'CEREALS', unitPrice: 15000, stockQuantity: 200, measurementUnit: 'BAG_50KG', status: 'IN_STOCK', isNegotiable: true, viewCount: 142, activeNegotiations: 3, createdAt: '2024-03-01' },
  { id: '2', name: 'Irish Potatoes', category: 'ROOTS_TUBERS', unitPrice: 8000, stockQuantity: 8, measurementUnit: 'BAG_25KG', status: 'LOW_STOCK', isNegotiable: true, viewCount: 89, activeNegotiations: 1, createdAt: '2024-03-05' },
  { id: '3', name: 'NPK Fertiliser', category: 'FERTILISER', unitPrice: 42000, stockQuantity: 0, measurementUnit: 'BAG_50KG', status: 'OUT_OF_STOCK', isNegotiable: false, viewCount: 210, activeNegotiations: 0, createdAt: '2024-02-20' },
  { id: '4', name: 'Tomatoes', category: 'VEGETABLES', unitPrice: 3000, stockQuantity: 50, measurementUnit: 'CRATE', status: 'IN_STOCK', isNegotiable: true, viewCount: 67, activeNegotiations: 2, createdAt: '2024-03-10' },
  { id: '5', name: 'Banana Bunch', category: 'BANANAS_PLANTAINS', unitPrice: 2500, stockQuantity: 30, measurementUnit: 'BUNCH', status: 'IN_STOCK', isNegotiable: false, viewCount: 44, activeNegotiations: 0, createdAt: '2024-03-08' },
  { id: '6', name: 'Maize Seeds (OPV)', category: 'SEEDS_SEEDLINGS', unitPrice: 12000, stockQuantity: 100, measurementUnit: 'KG', status: 'DRAFT', isNegotiable: false, viewCount: 0, activeNegotiations: 0, createdAt: '2024-03-12' },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProductStatus, { label: string; icon: React.ElementType; cls: string; dot: string }> = {
  IN_STOCK: { label: 'In stock', icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  LOW_STOCK: { label: 'Low stock', icon: AlertTriangle, cls: 'text-amber-600  bg-amber-50  dark:bg-amber-950/30  dark:text-amber-400', dot: 'bg-amber-500' },
  OUT_OF_STOCK: { label: 'Out of stock', icon: XCircle, cls: 'text-red-500    bg-red-50    dark:bg-red-950/30    dark:text-red-400', dot: 'bg-red-500' },
  DRAFT: { label: 'Draft', icon: FileText, cls: 'text-gray-500   bg-gray-100  dark:bg-gray-800      dark:text-gray-400', dot: 'bg-gray-400' },
  DISCONTINUED: { label: 'Discontinued', icon: PauseCircle, cls: 'text-gray-400   bg-gray-100  dark:bg-gray-800      dark:text-gray-500', dot: 'bg-gray-300' },
};

const UNIT_LABELS: Record<string, string> = {
  KG: 'kg', G: 'g', TON: 'ton', LITER: 'L', ML: 'ml',
  BAG_25KG: '25kg bag', BAG_50KG: '50kg bag', BAG_100KG: '100kg bag',
  CRATE: 'crate', BUNDLE: 'bundle', BUNCH: 'bunch',
  PIECE: 'pc', DOZEN: 'doz', JERRICAN: 'jerrican', SACK: 'sack',
};

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

function fmt(n: number) {
  return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, icon: Icon, cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

function StatPill({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon size={12} />
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

// ── Action menu ───────────────────────────────────────────────────────────────

function ActionMenu({ listing, onDelete }: { listing: Listing; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={e => { e.preventDefault(); setOpen(v => !v); }}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            <Link
              href={`/seller/listings/${listing.id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Edit3 size={13} className="text-muted-foreground" /> Edit listing
            </Link>
            <Link
              href={`/products/${listing.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Eye size={13} className="text-muted-foreground" /> View as buyer
            </Link>
            <div className="border-t border-border my-1" />
            <button
              onClick={() => { onDelete(listing.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <Trash2 size={13} /> Delete listing
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Grid card ────────────────────────────────────────────────────────────────

function GridCard({ listing, onDelete }: { listing: Listing; onDelete: (id: string) => void }) {
  const { dot } = STATUS_CONFIG[listing.status];
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-green-200 dark:hover:border-green-800 transition-all duration-200">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {listing.image ? (
          <img src={listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
        )}
        {/* Status dot */}
        <div className={`absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full ${dot} ring-2 ring-white dark:ring-gray-900`} />
        {/* Negotiable badge */}
        {listing.isNegotiable && (
          <span className="absolute top-2.5 right-2.5 text-xs font-semibold text-white bg-green-600/90 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Negotiable
          </span>
        )}
        {/* Action menu */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionMenu listing={listing} onDelete={onDelete} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-1">{listing.name}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{CATEGORY_LABELS[listing.category] ?? listing.category}</p>

        <div className="flex items-baseline justify-between mb-3">
          <p className="text-base font-extrabold text-green-700 dark:text-green-400">
            {fmt(listing.unitPrice)}
          </p>
          <p className="text-xs text-muted-foreground">/ {UNIT_LABELS[listing.measurementUnit] ?? listing.measurementUnit}</p>
        </div>

        <StatusBadge status={listing.status} />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <StatPill icon={Eye} value={listing.viewCount} label="views" />
            {listing.activeNegotiations > 0 && (
              <StatPill icon={TrendingUp} value={listing.activeNegotiations} label="active" />
            )}
          </div>
          <Link
            href={`/seller/listings/${listing.id}`}
            className="flex items-center gap-1 text-xs text-green-600 font-semibold hover:underline">
            Manage <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── List row ──────────────────────────────────────────────────────────────────

function ListRow({ listing, onDelete }: { listing: Listing; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
        {listing.image ? (
          <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={20} className="text-gray-300 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-foreground truncate">{listing.name}</p>
          {listing.isNegotiable && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold shrink-0">Negotiable</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_LABELS[listing.category]}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <StatusBadge status={listing.status} />
          <span className="text-xs text-muted-foreground">
            {listing.stockQuantity} {UNIT_LABELS[listing.measurementUnit] ?? listing.measurementUnit} left
          </span>
        </div>
      </div>

      {/* Price + stats */}
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <p className="text-sm font-extrabold text-green-700 dark:text-green-400">{fmt(listing.unitPrice)}</p>
        <div className="flex items-center gap-3">
          <StatPill icon={Eye} value={listing.viewCount} label="views" />
          {listing.activeNegotiations > 0 && (
            <StatPill icon={TrendingUp} value={listing.activeNegotiations} label="negotiating" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          href={`/seller/listings/${listing.id}/edit`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
          <Edit3 size={14} />
        </Link>
        <ActionMenu listing={listing} onDelete={onDelete} />
      </div>
    </div>
  );
}

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
          : 'Add your first product and start selling to buyers across Rwanda.'}
      </p>
      {!filtered && (
        <Link
          href="/products/create"
          className="mt-5 flex items-center gap-2 h-10 px-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus size={15} /> Add first listing
        </Link>
      )}
    </div>
  );
}

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({ listings }: { listings: Listing[] }) {
  const total = listings.length;
  const inStock = listings.filter(l => l.status === 'IN_STOCK').length;
  const lowStock = listings.filter(l => l.status === 'LOW_STOCK').length;
  const outOfStock = listings.filter(l => l.status === 'OUT_OF_STOCK').length;
  const totalViews = listings.reduce((a, l) => a + l.viewCount, 0);
  const totalNeg = listings.reduce((a, l) => a + l.activeNegotiations, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {[
        { label: 'Total', value: total, color: 'text-foreground' },
        { label: 'In stock', value: inStock, color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Low stock', value: lowStock, color: 'text-amber-600 dark:text-amber-400' },
        { label: 'Out of stock', value: outOfStock, color: 'text-red-500' },
        { label: 'Active negotiations', value: totalNeg, color: 'text-green-600' },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white dark:bg-gray-900 border border-border rounded-xl px-3 py-2.5 text-center">
          <p className={`text-xl font-extrabold ${color}`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SellerListings() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // ── Delete handler ────────────────────────────────────────────────────

  const handleDelete = (id: string) => {
    // TODO: call DELETE /api/v1/products/:id then refetch
    setListings(prev => prev.filter(l => l.id !== id));
  };

  // ── Filter + sort ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = listings;
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
  }, [listings, search, statusFilter, sortKey, sortAsc]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(false); }
    setPage(1);
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout size={18} className="text-green-600" />
            <span className="text-sm font-bold text-foreground">My Listings</span>
          </div>
          <Link
            href="/products/create"
            className="flex items-center gap-1.5 h-8 px-4 bg-green-600 hover:bg-green-700 active:scale-[0.97] text-white text-xs font-semibold rounded-full transition-all">
            <Plus size={13} /> New listing
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* Summary */}
        <SummaryBar listings={listings} />

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

          {/* Status filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DRAFT'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`h-9 px-3 text-xs font-medium rounded-xl border transition-colors ${statusFilter === s
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground hover:border-green-300'
                  }`}>
                {s === 'ALL' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
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
              <option value="viewCount">Views</option>
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
        {paginated.length === 0 ? (
          <EmptyState filtered={!!(search || statusFilter !== 'ALL')} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(l => (
              <GridCard key={l.id} listing={l} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border divide-y divide-border overflow-hidden">
            {paginated.map(l => (
              <ListRow key={l.id} listing={l} onDelete={handleDelete} />
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

      </main>
    </div>
  );
}
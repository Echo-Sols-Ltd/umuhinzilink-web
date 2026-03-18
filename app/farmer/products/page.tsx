'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LayoutGrid
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS_PER_PAGE = 12;

import { cn, imageUrl } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';

function FarmerProducts() {
  const { user } = useAuth();
  const { t } = useI18n();
  const {
    myProducts: farmerProducts,
    loading,
    fetchMyProducts: fetchFarmerProducts,
    myProductsTotalPages: totalPages,
    myProductsTotalElements: totalElements,
  } = useProduct();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const products = useMemo(() => farmerProducts || [], [farmerProducts]);

  useEffect(() => {
    fetchFarmerProducts(currentPage - 1, ITEMS_PER_PAGE);
  }, [currentPage]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        product => (product.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        [product.name, product.category, product.description]
          .filter(Boolean)
          .some(value => value!.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [products, statusFilter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status?.toUpperCase() === 'IN_STOCK').length;
    const outOfStock = products.filter(p => p.status?.toUpperCase() === 'OUT_OF_STOCK').length;
    const inventory = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
    return { total, active, outOfStock, inventory };
  }, [products]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem="My Products" />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b flex items-center justify-between p-6 shadow-sm sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-foreground">{t('farmer.products.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('farmer.products.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchFarmerProducts()}
              className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/farmer/add_produce"
              className="bg-success text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-success/90 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3px]" /> {t('farmer.products.addProduct')}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-8 max-w-7xl mx-auto w-full">

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <HighlightCard 
              title={t('farmer.products.metrics.listings')} 
              value={stats.total} 
              icon={<LayoutGrid />} 
              color="bg-info" 
            />
            <HighlightCard 
              title={t('farmer.products.metrics.inStock')} 
              value={stats.active} 
              icon={<CheckCircle />} 
              color="bg-success" 
            />
            <HighlightCard 
              title={t('farmer.products.metrics.outOfStock')} 
              value={stats.outOfStock} 
              icon={<AlertCircle />} 
              color="bg-destructive" 
            />
            <HighlightCard 
              title={t('farmer.products.metrics.units')} 
              value={stats.inventory} 
              icon={<TrendingUp />} 
              color="bg-warning" 
            />
          </div>

          {/* Filtering Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('farmer.products.filters.search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 rounded-lg border border-border bg-card">
                  <SelectValue placeholder={t('farmer.products.filters.allStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('farmer.products.filters.allStatus')}</SelectItem>
                  <SelectItem value="in_stock">{t('farmer.products.filters.inStock')}</SelectItem>
                  <SelectItem value="out_of_stock">{t('farmer.products.filters.outOfStock')}</SelectItem>
                  <SelectItem value="pending">{t('farmer.products.filters.pending')}</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                  className="px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  {t('farmer.products.filters.reset')}
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <span className="w-2 h-6 bg-success rounded-full mr-3"></span>
                {t('farmer.products.activeListings')}
              </h2>
              <span className="text-xs font-bold text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
                {filteredProducts.length} {t('farmer.products.results')}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-sm">
                    <Skeleton className="aspect-square rounded-lg w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card rounded-2xl border-2 border-dashed border-border p-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t('farmer.products.noListings')}</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t('farmer.products.noListingsDesc')}</p>
                <button
                   onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                   className="mt-6 text-success hover:underline font-medium"
                >
                  {t('farmer.products.filters.reset')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      disabled={loading}
                      showSummary
                      totalItems={totalElements}
                      itemsPerPage={ITEMS_PER_PAGE}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function HighlightCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-card p-5 rounded-xl shadow-sm border border-border flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white shrink-0`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
          className: cn('w-6 h-6', color.replace('bg-', 'text-')) 
        })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 leading-none">{title}</p>
        <p className="text-2xl font-bold text-foreground leading-none">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function FarmerProductsPage() {
  return (
    <FarmerGuard>
      <FarmerProducts />
    </FarmerGuard>
  );
}
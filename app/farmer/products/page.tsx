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
import ProductCard from '@/components/products/Product';
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

function FarmerProducts() {
  const { user } = useAuth();
  const {
    farmerProducts,
    loading,
    fetchFarmerProducts,
    farmerProductsTotalPages: totalPages,
    farmerProductsTotalElements: totalElements,
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
        product => (product.productStatus || '').toLowerCase() === statusFilter.toLowerCase()
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
    const active = products.filter(p => p.productStatus?.toUpperCase() === 'IN_STOCK').length;
    const outOfStock = products.filter(p => p.productStatus?.toUpperCase() === 'OUT_OF_STOCK').length;
    const inventory = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
    return { total, active, outOfStock, inventory };
  }, [products]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem="My Products" />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b  flex items-center justify-between p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Marketplace Inventory</h1>
            <p className="text-xs text-muted-foreground">Manage your produce listings and monitor stock levels</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchFarmerProducts()}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/farmer/add_produce"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </header>

        <main className="flex-1 bg-card p-6 space-y-6">

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-info" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-semibold text-foreground">{stats.inventory}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtering Section */}
          <div className="bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-lg border border-border">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground border-l-4 border-primary pl-3">Active Listings</h2>
              <span className="text-xs font-medium text-muted-foreground uppercase ">{filteredProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-sm">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-16 text-center shadow-sm">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No listings found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or create a new product listing.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6">
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
    <div className="bg-card p-5 rounded-xl shadow-sm border border-border flex items-center gap-4 transition-all hover:scale-[1.01]">
      <div className={`p-3 rounded-lg bg-linear-to-br ${color} text-white shadow-md`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase  leading-none mb-1">{title}</p>
        <p className="text-xl font-semibold text-foreground leading-none">{value.toLocaleString()}</p>
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
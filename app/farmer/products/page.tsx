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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar userType={UserType.FARMER} activeItem="Products" />

      <main className="flex-1 overflow-auto bg-gray-50/30">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace Inventory</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your produce listings and monitor stock levels</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchFarmerProducts()}
                className="p-2.5 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
              </button>
              <Link
                href="/farmer/add_produce"
                className="bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> New Listing
              </Link>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <HighlightCard title="Total Listings" value={stats.total} icon={<LayoutGrid />} color="from-green-600 to-emerald-600" />
            <HighlightCard title="In Stock" value={stats.active} icon={<CheckCircle />} color="from-blue-500 to-indigo-600" />
            <HighlightCard title="Out of Stock" value={stats.outOfStock} icon={<AlertCircle />} color="from-red-500 to-rose-600" />
            <HighlightCard title="Total Units" value={stats.inventory} icon={<TrendingUp />} color="from-amber-400 to-orange-500" />
          </div>

          {/* Filtering Section */}
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50/50"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-white border-gray-200 rounded-lg h-10 font-medium text-xs uppercase tracking-wider">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                  className="px-4 py-2 text-xs font-semibold text-red-500 uppercase tracking-wider hover:bg-red-50 rounded-lg transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-green-500 pl-3">Active Listings</h2>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{filteredProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm">
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
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No listings found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or create a new product listing.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onContact={() => { }}
                      onPurchase={() => { }}
                      onSelect={() => { }}
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
        </div>
      </main>
    </div>
  );
}

function HighlightCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:scale-[1.01]">
      <div className={`p-3 rounded-lg bg-linear-to-br ${color} text-white shadow-md`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-900 leading-none">{value.toLocaleString()}</p>
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
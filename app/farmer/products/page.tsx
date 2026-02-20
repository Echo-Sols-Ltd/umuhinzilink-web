'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import ProductCard from '@/components/products/Product';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function FarmerProducts() {
  const router = useRouter();
  const { user } = useAuth();
  const { farmerProducts, loading, fetchFarmerProducts } = useProduct();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const products = useMemo(() => farmerProducts || [], [farmerProducts]);

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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketplace Inventory</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage your produce listings and monitor stock levels</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchFarmerProducts()}
                className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-green-600' : ''}`} />
              </button>
              <Link
                href="/farmer/add_produce"
                className="bg-green-600 text-white font-black py-3.5 px-6 rounded-2xl flex items-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-100 text-xs uppercase tracking-widest"
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
          <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-3.5 bg-gray-50/50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium italic"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-gray-50/50 border-none rounded-2xl h-12 font-bold text-xs uppercase tracking-widest">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              {(statusFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                  className="px-4 py-2 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-4 uppercase tracking-tight">Active Listings</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 p-4 space-y-4 shadow-sm">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-500 font-medium italic">Try adjusting your filters or create a new product listing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function HighlightCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-md">
      <div className={`p-3.5 rounded-2xl bg-linear-to-br ${color} text-white shadow-lg`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{title}</p>
        <p className="text-2xl font-black text-gray-900 leading-none">{value.toLocaleString()}</p>
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
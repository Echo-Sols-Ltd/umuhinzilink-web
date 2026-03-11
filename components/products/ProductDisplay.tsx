import React from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { RwandaCropCategory } from '@/types';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';

interface ProductDisplayProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: any) => void;
  onProductSelect?: (product: Product) => void;
  onProductPurchase?: (product: Product) => void;
  onProductContact?: (product: Product) => void;
  selectedCategory?: string;
  selectedLocation?: string;
  search?: string;
}

export function ProductDisplay({
  products,
  loading = false,
  viewMode = 'grid',
  showFilters = true,
  showSearch = true,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onViewModeChange,
  onSearchChange,
  onFilterChange,
  selectedCategory,
  selectedLocation,
  search,
}: ProductDisplayProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  return (
    <div className="space-y-8 bg-background/50 p-4 sm:p-6 lg:p-8 rounded-[32px] border border-border/40">
      {/* 1️⃣ Filtering & Search Bar */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/40 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex flex-1 gap-3">
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Find fresh produce..."
                  value={search || ''}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showFilters && (
              <>
                <Select value={selectedCategory} onValueChange={(value) => onFilterChange?.({ category: value })}>
                  <SelectTrigger className="h-11 w-40 rounded-xl bg-background/50 border-border/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RwandaCropCategory).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={(value) => onFilterChange?.({ location: value })}>
                  <SelectTrigger className="h-11 w-40 rounded-xl bg-background/50 border-border/50">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'].map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <div className="flex items-center gap-1.5 ml-2 p-1 bg-muted rounded-xl">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange?.('grid')}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange?.('list')}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2️⃣ Products Grid / Loading State */}
      <section className="relative min-h-[400px]">
        {loading ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8"
            : "space-y-4"
          }>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card rounded-[24px] border border-border overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <div className="pt-4 flex gap-2">
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No matching products</h3>
            <p className="text-muted-foreground mt-2 max-w-xs">We couldn't find what you're looking for. Try a different category or location.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8"
            : "space-y-6"
          }>
            {products.map((product, idx) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                {viewMode === 'grid' ? (
                  <ProductCard product={product} featured={idx === 0} />
                ) : (
                  <ProductRow
                    product={product}
                    onContact={() => { }}
                    onSelect={() => { }}
                    onPurchase={() => { }} />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3️⃣ Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8 pb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-xl h-11 w-11"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                onClick={() => onPageChange?.(page)}
                className={`h-11 min-w-[44px] rounded-xl font-bold ${currentPage === page ? 'shadow-lg shadow-primary/20' : ''}`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-xl h-11 w-11"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

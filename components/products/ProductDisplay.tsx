import React from 'react';
import {
  Star,
  MapPin,
  Search,
  LayoutGrid,
  List,
  X,
  Filter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProgressiveImage } from '@/components/ui/progressive-loading';

import { RwandaCrop, RwandaCropCategory } from '@/types';
import { FarmerProduct } from '@/types/product';
import { cn, imageUrl } from '@/lib/utils';
import { ResponsiveLayout, MobileTable, TouchOptimizedButton } from '@/components/ui/responsive-layout';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDisplayProps {
  products: FarmerProduct[];
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
  onProductSelect?: (product: FarmerProduct) => void;
  onProductPurchase?: (product: FarmerProduct) => void;
  onProductContact?: (product: FarmerProduct) => void;
  selectedCategory?: string;
  selectedLocation?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}




// Main ProductDisplay Component
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
  onProductSelect,
  onProductPurchase,
  onProductContact,
  selectedCategory,
  selectedLocation,
  search,
  minPrice,
  maxPrice,
}: ProductDisplayProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={(value) => onFilterChange?.({ category: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RwandaCropCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={(value) => onFilterChange?.({ location: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {['Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'].map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange?.('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {Array.from({ length: 8 }).map((_, i) => (
            viewMode === 'grid' ? (
              <div key={`skeleton-grid-${i}`} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none bg-gray-200" />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-1/2 bg-gray-200" />
                    <Skeleton className="h-5 w-1/4 bg-gray-200" />
                  </div>
                  <Skeleton className="h-4 w-1/3 bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200 mb-4" />
                  <div className="flex items-center gap-2 mt-3">
                    <Skeleton className="h-9 flex-1 bg-gray-200 rounded" />
                    <Skeleton className="h-9 w-10 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <div key={`skeleton-list-${i}`} className="bg-white rounded-lg shadow-sm border flex overflow-hidden">
                <Skeleton className="h-48 w-48 shrink-0 rounded-none bg-gray-200" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-1/3 bg-gray-200" />
                      <Skeleton className="h-6 w-1/4 bg-gray-200" />
                    </div>
                    <Skeleton className="h-4 w-1/4 bg-gray-200 mb-2" />
                    <Skeleton className="h-4 w-1/3 bg-gray-200 mb-4" />
                    <Skeleton className="h-4 w-3/4 bg-gray-200 mt-2" />
                    <Skeleton className="h-4 w-2/3 bg-gray-200 mt-2" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Skeleton className="h-10 w-32 bg-gray-200 rounded-lg" />
                    <Skeleton className="h-10 w-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}

      {/* Products Grid/List */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onSelect={() => onProductSelect?.(product)}
                  onPurchase={() => onProductPurchase?.(product)}
                  onContact={() => onProductContact?.(product)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange?.(page)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

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
import { useToast } from '@/components/ui/use-toast';
import { RwandaCrop, RwandaCropCategory } from '@/types';
import { FarmerProduct } from '@/types/product';
import { cn, imageUrl } from '@/lib/utils';
import { ResponsiveLayout, MobileTable, TouchOptimizedButton } from '@/components/ui/responsive-layout';
import ProductCard from './Product';

export interface ProductDisplayProps {
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
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                  onSelect={() => onProductSelect?.(product)}
                  onPurchase={() => onProductPurchase?.(product)}
                  onContact={() => onProductContact?.(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard
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

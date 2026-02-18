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
import { cn } from '@/lib/utils';
import { ResponsiveLayout, MobileTable, TouchOptimizedButton } from '@/components/ui/responsive-layout';

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

// Product Card Component
interface ProductCardProps {
  product: FarmerProduct;
  onSelect: () => void;
  onPurchase: () => void;
  onContact: () => void;
}

function ProductCard({ product, onSelect, onPurchase, onContact }: ProductCardProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div onClick={onSelect}>
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <ProgressiveImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>

          {/* Save Button */}
          <button
            onClick={(e: any) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-green-600" /> : <Bookmark className="w-4 h-4 text-gray-600" />}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{product.farmer?.user?.address?.district || 'Location'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">
                {product.unitPrice.toLocaleString()} RWF
              </span>
              <span className="text-sm text-gray-500 ml-1">/{product.measurementUnit}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.5</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <span>{product.quantity} {product.measurementUnit}</span>
              <div className="flex items-center ml-2">
                <div className="w-2 h-2 bg-green-100 rounded-full mr-1" />
                <span>{product.farmer?.names}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 gap-2">
            <TouchOptimizedButton
              onClick={(e: any) => {
                e.stopPropagation();
                onPurchase();
              }}
              size="sm"
              className="flex-1"
            >
              Buy Now
            </TouchOptimizedButton>
            <TouchOptimizedButton
              onClick={(e: any) => {
                e.stopPropagation();
                onContact();
              }}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4 mr-4" />
              Contact Seller
            </TouchOptimizedButton>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Product List Item Component
interface ProductListItemProps {
  product: FarmerProduct;
  onSelect: () => void;
  onPurchase: () => void;
  onContact: () => void;
}

function ProductListItem({ product, onSelect, onPurchase, onContact }: ProductListItemProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0 w-24 h-24">
            <ProgressiveImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{product.farmer?.user?.address?.district || 'Location'}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {product.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-lg font-bold text-green-600">
                  {product.unitPrice.toLocaleString()} RWF/{product.measurementUnit}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.5</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>{product.quantity} {product.measurementUnit}</span>
              <div className="flex items-center ml-2">
                <div className="w-2 h-2 bg-green-100 rounded-full mr-1" />
                <span>{product.farmer?.names}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TouchOptimizedButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  onPurchase();
                }}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Buy Now
              </TouchOptimizedButton>
              <TouchOptimizedButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  onContact();
                }}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                Contact
              </TouchOptimizedButton>
              <TouchOptimizedButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  onSelect();
                }}
                size="sm"
                variant="outline"
              >
                View Details
              </TouchOptimizedButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
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
                <ProductListItem
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

'use client';

import { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast-new';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, RwandaCrop, RwandaCropCategory, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { useProduct } from '@/contexts/ProductContext';
import { ProductOrderInterface } from '@/components/orders/ProductOrderInterface';
import { productService } from '@/services/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ResponsiveLayout, MobileTable, TouchOptimizedButton } from '@/components/ui/responsive-layout';
import { ProgressiveImage } from '@/components/ui/progressive-loading';
import { useIsMobile } from '@/hooks/use-mobile';

function ProductsPageComponent() {
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { buyerProducts, loading: productsLoading } = useProduct();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const itemsPerPage = 12;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = buyerProducts || [];

    // Search filter
    if (search) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Crop filter
    if (cropFilter && cropFilter !== 'all') {
      filtered = filtered.filter(product => product.name === cropFilter);
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(product =>
        product.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter(product => product.unitPrice >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.unitPrice <= parseFloat(maxPrice));
    }

    return filtered;
  }, [buyerProducts, search, cropFilter, categoryFilter, locationFilter, minPrice, maxPrice]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.unitPrice - b.unitPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.unitPrice - a.unitPrice);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sortedProducts.slice(startIndex, endIndex);
    setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
    return paginated;
  }, [sortedProducts, currentPage, itemsPerPage]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      // Implement search API call here
      toast({
        title: "Search completed",
        description: `Found ${filteredProducts.length} results for "${search}"`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to search products. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSearch = () => {
    if (!search.trim()) return;

    if (!savedSearches.includes(search)) {
      setSavedSearches(prev => [...prev, search]);
      toast({
        title: "Search saved",
        description: `"${search}" has been saved to your searches.`,
        variant: "success",
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCropFilter('all');
    setCategoryFilter('all');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasSearchParams = search || cropFilter || categoryFilter || locationFilter || minPrice || maxPrice;

  const sidebar = <Sidebar userType={UserType.BUYER} activeItem='Browse Product' />;

  const header = (
    <div className="p-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-900">Products</h1>
    </div>
  );

  return (
    <ResponsiveLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg">
          {/* Search Bar */}
          <div className="">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 py-4"
                />
              </div>
              <div className="flex gap-2">
                <TouchOptimizedButton
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? 'Searching...' : 'Search'}
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className={`${showFilters ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-600'
                    }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </TouchOptimizedButton>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Crop Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                  <Select value={cropFilter} onValueChange={setCropFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Crops" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      {Object.values(RwandaCrop).map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.values(RwandaCropCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    type="text"
                    placeholder="Enter location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <TouchOptimizedButton
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear All Filters
                </TouchOptimizedButton>
                <div className="flex gap-2">
                  <TouchOptimizedButton
                    onClick={handleSaveSearch}
                    variant="outline"
                    size="sm"
                    disabled={!search.trim()}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    Save Search
                  </TouchOptimizedButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {sortedProducts.length} results
              {hasSearchParams && ` for "${search}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <TouchOptimizedButton
                onClick={() => setViewMode('grid')}
                variant="ghost"
                size="sm"
                className={`rounded-r-none ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : 'hover:text-green-600'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </TouchOptimizedButton>
              <TouchOptimizedButton
                onClick={() => setViewMode('list')}
                variant="ghost"
                size="sm"
                className={`rounded-l-none border-l ${viewMode === 'list' ? 'bg-green-50 text-green-600' : 'hover:text-green-600'
                  }`}
              >
                <List className="w-4 h-4" />
              </TouchOptimizedButton>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    onSelect={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <TouchOptimizedButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </TouchOptimizedButton>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <TouchOptimizedButton
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </TouchOptimizedButton>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
            <TouchOptimizedButton onClick={clearFilters} variant="outline">
              Clear Filters
            </TouchOptimizedButton>
          </div>
        )}
      </div>

      {/* Product Order Interface Modal */}
      {selectedProduct && (
        <div className='fixed top-0 left-0 w-full h-full z-50 p-40 bg-black/85 align-center justify-center items-center overflow-auto'>
          <ProductOrderInterface
            product={selectedProduct}
            productType={selectedProduct.type || 'farmer'}
          />
        </div>
      )}
    </ResponsiveLayout>
  );
}

// Product Card Component
interface ProductCardProps {
  product: any;
  onSelect: () => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div onClick={onSelect}>
        <div className="relative">
          <ProgressiveImage
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <TouchOptimizedButton
              onClick={() => setIsSaved(!isSaved)}
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-green-600" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-600" />
              )}
            </TouchOptimizedButton>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-green-600">
              {product.unitPrice} RWF
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{product.location}</span>
            </div>
            <span>{product.quantity} {product.measurementUnit}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full mr-2" />
              <span className="text-sm text-gray-600">{product.farmer?.names}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Product List Item Component
interface ProductListItemProps {
  product: any;
  onSelect: () => void;
}

function ProductListItem({ product, onSelect }: ProductListItemProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <ProgressiveImage
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors cursor-pointer" onClick={onSelect}>
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  {product.unitPrice} RWF
                </span>
                <TouchOptimizedButton
                  onClick={() => setIsSaved(!isSaved)}
                  variant="ghost"
                  size="sm"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  )}
                </TouchOptimizedButton>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{product.location}</span>
                </div>
                <span>{product.quantity} {product.measurementUnit}</span>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded-full mr-1" />
                  <span>{product.farmer?.names}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1">4.5</span>
                </div>
                <TouchOptimizedButton
                  onClick={onSelect}
                  size="sm"
                >
                  View Details
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ProductsPage() {
  return (
    <BuyerGuard>
      <ProductsPageComponent />
    </BuyerGuard>
  );
}
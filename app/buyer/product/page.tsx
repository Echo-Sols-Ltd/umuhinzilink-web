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
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast-new';
import BuyerSidebar from '@/components/buyer/Navbar';
import { BuyerPages, RwandaCrop, RwandaCropCategory } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { useProduct } from '@/contexts/ProductContext';
import Pr/ProductOrderInterface';
import { productService } from '@/services/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ProductsPageComponent() {
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showF useState(false);
  const [selectedProduct, setSel;
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { buyerProducts, loading: productsLoading } = useProduct();
  const { toast } = useToast();

  // Debounced search function
  const performSearch = async () => {
    setLoading(true);
    try {
      const searchParams = {
        keyword: search,
        name: cropFilter,
        category: categoryFilter,
        location: locationFilter,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page: currentPage - 1,
        size: 20,
      };

      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await productService.searchFarmerProducts(cleanParams);
      
      if (response.success && response.data) {
        setSearchResults(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setSearchResults([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search products. Please try again.',
        variant: 'error',
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Use search results if we have search parameters, otherwise use context products
  const hasSearchParams = search || cropFilter || categoryFilter || locationFilter || minPrice || maxPrice;
  const productsList = hasSearchParams ? searchResults : (buyerProducts || []);

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...productsList];
    
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
      case 'price-high':
        return products.sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'location':
        return products.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
      case 'newest':
      default:
        return products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
  }, [productsList, sortBy]);

  // Trigger search when parameters change
  useEffect(() => {
  if (hasSearchParams) {
      const timeoutId = setTimeout(performSearch, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [search, cropFilter, categoryFilter, locationFilter, minPrice, maxPrice, currentPage]);

  const handleSaveSearch = () => {
    const searchQuery = `${search} ${cropFilter} ${categoryFilter} ${locationFilter}`.trim();
    if (searchQuery && !savedSearches.includes(searchQuery)) {
      setSavedSearches([...savedSearches, searchQuery]);
      toast({
        title: 'Search Saved',
        description: 'Your search has been saved for future use.',
        variant: 'success',
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCropFilter('');
    setCategoryFilter('');
    setLocationFilter('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-row h-screen bg-gray-50 overflow-hidden">
      <BuyerSidebar
        activePage={BuyerPages.PRODUCT}
        handleLogout={() => {}}
        logoutPending={false}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-72 m-12 overflow-auto">
        {/* Enhanced Search + Filter Bar */}
        <div className="bg-white border rounded-lg shadow-sm mb-6">
          {/* Main Search Bar */}
          <div className="p-4 border-b">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for crops, farmers, or locations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
    ms-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                  showFilters ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={handleSaveSearch}
                className="flex items-center gap-2 px-4 py-2 rounde0"
              >
                <Bookmark className="w-4 h-4" />
                Save Search
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              {cropFilter} onValueChange={setCropFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Crops</SelectItem>
                      {Object.values(RwandaCrop).map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop.replace(/_/g, ' ')}
                        </SelectItem>
       ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <Selealue="">All Categories</SelectItem>
                      {Object.values(RwandaCropCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pbel>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={clearFilters}
                  cl text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </button>
                
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      tItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="p-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Searches</h4>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((savedSearch, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const terms = savedSearch.split(' ');
                      setSearch(terms[0] || '');
                      setCropFilter(terms[1] || '');
                      setCategoryFilter(terms[2] || '');
                      setLocationFilter(terms[3] || '');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                  >
                    <BookmarkCheck className="w-3 h-3" />
                    {savedSearch}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <main className="flex-1 overflow-auto">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {sortedProducts.length} results
              {hasSearchParams && ` for "${search}"`}
            </p>
            <div className="flex items-center gap-4">
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                  urrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
              
              {/* View Mode Toggle */}
              <div className="flex gap-2 text-gray-500">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'hover:text-green-600'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
            0 text-green-600' : 'hover:text-green-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {(loading || productsLoading) && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Grid/List View */}
          {!loading && !productsLoading && (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
            }>
              {sortedProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No products found</p>
           <p className="text-gray-400 text-sm">
                    {hasSearchParams 
                      ? 'Try adjusting your search criteria or clearing filters'
                      : 'No products are currently available'
                    }
                  </p>
                  {hasSearchParams && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"

                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                sortedProducts.map(product => {
                  const farmerName = product.farmer?.user?.names || 'Unknown Farmer';
                  const price = `RWF ${product.unitPrice?.toFixed(2) || '0.00'}/${product.measurementUnit || 'unit'}`;
                  const available = `${product.quantity || 0} ${product.measurementUnit || 'units'} available`;
                  
                  if (viewMode === 'list') {
                    return (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4 flex gap-4">
                        <img 
                          src={product.image || '/placeholder.png'} 
                          alt={product.name} 
                          className="h-24 w-24 object-cover rounded-lg flex-shrink-0" 
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                              <p className="text-green-600 font-bold text-lg">{price}</p>
                              <p className="text-sm text-gray-500">{available}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                              onClick={() => setSelectedProduct(product)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                              >
                                Buy Now
                              </button>
                              <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                Contact
                              </button>
               n className="border border-gray-300 p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Heart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                <span className="text-green-600 font-semibold text-xs">
                                  {farmerName.charAt(0)}
                                </span>
                              </div>
                              <span>{farmerName}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" /> {product.location || 'Unknown'}
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4" /> 4.5
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={product.image || '/placeholder.png'} 
                        alt={product.name} 
                        className="h-40 w-full object-cover" 
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-700">{product.name}</h3>
                        <p className="text-green-600 font-bold">{price}</p>
                        <p className="text-sm text-gray-500">{available}</p>

                        {/* Farmer Info */}
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
    console.log('Share product:', product);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <BuyerGuard>
      <ProductsPageComponent />
    </BuyerGuard>
  );
}SelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <ProductOrderInterface
                product={selectedProduct}
                productType="farmer"
                onSaveProduct={(productId) => {
                  console.log('Save product:', productId);
                }}
                onShareProduct={(product) => {
              uct Order Interface Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                <button
                  onClick={() => set                    <button className="border border-gray-300 p-2 cursor-pointer rounded text-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>

      {/* Prodrsor-pointer rounded text-sm w-full hover:bg-green-700"
                          >
                            Buy Now
                          </button>

                          {/* Contact + Heart side-by-side */}
                          <div className="flex gap-2">
                            <button className="border border-gray-300 px-3 cursor-pointer py-1 rounded text-sm flex-grow text-gray-600 hover:bg-gray-50">
                              Contact
                            </button>
                     </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4" /> 4.5
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          {/* Buy Now */}
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="bg-green-600 text-white px-3 py-1 cureen-600 font-semibold text-xs">
                              {farmerName.charAt(0)}
                            </span>
                          </div>
                          <span>{farmerName}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {product.location || 'Unknown'}
                                         <span className="text-g
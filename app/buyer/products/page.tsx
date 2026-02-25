'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, FarmerProduct, RwandaCrop, RwandaCropCategory, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import { useProduct } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { MessageType } from '@/types/message';
import ProductOrderInterface from '@/components/orders/ProductOrderInterface';
import { productService } from '@/services/products';
import { ProductDisplay } from '@/components/products/ProductDisplay';
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
import OrderCreationModal from '@/components/orders/OrderCreationModal';
import { useMessages } from '@/contexts/MessageContext';
import { useUser } from '@/contexts/UserContext';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function ProductsPageComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: buyer } = useAuth();
  const { handleUserClick, handleSendMessage } = useChat();
  const { chatUsers } = useUser()
  const { buyerProducts, loading: productsLoading } = useProduct();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FarmerProduct | null>(null);

  // State for filters and search
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = buyerProducts || [];

    // Search filter
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(product =>
        product.owner?.address?.district?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filtered = filtered.filter(product => {
        const price = Number(product.unitPrice);
        const minOk = minPrice === undefined || price >= minPrice;
        const maxOk = maxPrice === undefined || price <= maxPrice;
        return minOk && maxOk;
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.unitPrice) - Number(b.unitPrice);
        case 'price-high':
          return Number(b.unitPrice) - Number(a.unitPrice);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return 0;
      }
    });

    return filtered;
  }, [buyerProducts, search, categoryFilter, locationFilter, minPrice, maxPrice, sortBy]);

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts?.slice(startIndex, endIndex) || [];

  const handleContactFarmer = async (product: FarmerProduct) => {
    if (!buyer) {
      toast({
        title: "Authentication Required",
        description: "Please log in to contact farmers",
        variant: "error"
      });
      return;
    }

    if (!product.owner) {
      toast({
        title: "Farmer Not Available",
        description: "Unable to find farmer information for this product",
        variant: "error"
      });
      return;
    }

    try {
      // Create a user object for farmer
      const farmerUser = product.owner;
      const chatUser = chatUsers.find(user => user.id === farmerUser.id);

      // Switch to chat with the farmer
      handleUserClick(chatUser!);

      // Send product reference message
      await handleSendMessage(
        `Hi! I'm interested in your ${product.name}\n Send me more details about this product to reach me`,
        MessageType.PRODUCT,
        product.owner.names,
        product.id
      );

      toast({
        title: "Message Sent",
        description: `You can now chat with ${product.owner.names} about ${product.name}`,
        variant: "success"
      });

      // Navigate to chat page with specific user ID
      router.push(`/chat/${farmerUser.id}`);
    } catch (error) {
      console.error('Failed to contact farmer:', error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again later",
        variant: "error"
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCropFilter('all');
    setCategoryFilter('');
    setLocationFilter('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const header = (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Browse Products</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Rwanda's Largest Agricultural Marketplace</span>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span className="font-medium">Verified Farmers</span>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );

  const sidebar = <Sidebar userType={UserType.BUYER} activeItem='Marketplace' />;

  return (
    <ResponsiveLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        {/* Search and Filters */}
        <ProductDisplay
          products={paginatedProducts}
          loading={productsLoading}
          viewMode={viewMode}
          showFilters={showFilters}
          showSearch={true}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewModeChange={setViewMode}
          onSearchChange={setSearch}
          onFilterChange={(filters) => {
            if ('category' in filters) setCategoryFilter(filters.category);
            if ('location' in filters) setLocationFilter(filters.location);
          }}
          onProductSelect={setSelectedProduct}
          onProductPurchase={(product) => {
            setSelectedProduct(product);
            setIsPurchasing(true);
          }}
          onProductContact={handleContactFarmer}
          selectedCategory={categoryFilter}
          selectedLocation={locationFilter}
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        {/* Product Order Interface Modal */}
        {selectedProduct && !isPurchasing && (
          <div className='fixed top-0 left-0 w-full h-full z-50 p-4 flex items-center justify-center bg-black/85 overflow-auto'>
            <ProductOrderInterface
              product={selectedProduct}
              productType="farmer"
              setIsPurchasing={setIsPurchasing}
            />
          </div>
        )}

        {isPurchasing && (
          <div>
            {/* Order Creation Modal */}
            <OrderCreationModal
              isOpen={isPurchasing}
              onClose={() => {
                setIsPurchasing(false)
                setSelectedProduct(null)
              }}
              product={selectedProduct}
              productType="farmer"
            />
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}

export default function ProductsPage() {
  return (
    <BuyerGuard>
      <ProductsPageComponent />
    </BuyerGuard>
  );
}

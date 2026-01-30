'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useGovernment } from '@/contexts/GovernmentContext';
import { GovernmentLayout } from '../components/GovernmentLayout';
import { GovernmentPages } from '@/types';
import GovernmentGuard from '@/contexts/guard/GovernmentGuard';

// Banner data
const bannerData = [
  {
    title: 'Enjoy new produce In this summer',
    subtitle: 'Tomatoes - 2.345/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Fresh vegetables available',
    subtitle: 'Potatoes - 1.500/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Organic produce collection',
    subtitle: 'Cabbage - 1.200/kg',
    image: '/api/placeholder/600/300',
  },
];

function FarmersProducePage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});

  const { farmerProducts: products } = useGovernment();

  const handleBannerPrev = () => {
    setCurrentBannerIndex(prev => (prev === 0 ? bannerData.length - 1 : prev - 1));
  };

  const handleBannerNext = () => {
    setCurrentBannerIndex(prev => (prev === bannerData.length - 1 ? 0 : prev + 1));
  };

  const handleProductImagePrev = (productId: string) => {
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? 2 : (prev[productId] || 0) - 1,
    }));
  };

  const handleProductImageNext = (productId: string) => {
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 2 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  const handleGetPrice = (productId: string) => {
    toast({
      title: 'Price Request',
      description: 'Price information has been requested for this product.',
    });
  };

  const currentBanner = bannerData[currentBannerIndex];

  return (
    <GovernmentLayout
      activePage={GovernmentPages.FARMERS_PRODUCE}
      headerTitle="Farmers Produce"
      showDateInHeader={true}
    >
      <div className="space-y-6">
        {/* Banner Section */}
        <div className="relative bg-gradient-to-r from-green-700 to-green-500 rounded-xl p-8 text-white overflow-hidden">
          <button
            onClick={handleBannerPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleBannerNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{currentBanner.title}</h2>
              <p className="text-lg opacity-90">{currentBanner.subtitle}</p>
            </div>
            <div className="w-64 h-48 bg-white/10 rounded-lg flex items-center justify-center">
              <img
                src={currentBanner.image}
                alt="Banner"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {!products || products?.length === 0 ? (
            <div className="flex items-center justify-center h-64 col-span-full">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : products?.map(product => {
            const isDone = product.quantity === 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image with Navigation */}
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleProductImagePrev(product.id)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleProductImageNext(product.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">${product.unitPrice.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 5
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => (isDone ? undefined : handleGetPrice(product.id))}
                    className={`w-full ${isDone
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    disabled={isDone}
                  >
                    {isDone ? 'Done' : 'Get Price'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GovernmentLayout>
  );
}

export default function GovernmentFarmersProducePage() {
  return (
    <GovernmentGuard>
      <FarmersProducePage />
    </GovernmentGuard>
  );
}

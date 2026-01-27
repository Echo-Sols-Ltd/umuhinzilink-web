'use client';

import React, { useState } from 'react';
import { FarmProductCard, EnhancedFarmProduct } from './FarmProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RwandaCrop, 
  RwandaCropCategory, 
  ProductStatus, 
  MeasurementUnit, 
  CertificationType 
} from '@/types/enums';

// Sample farm products data
const sampleProducts: EnhancedFarmProduct[] = [
  {
    id: '1',
    name: RwandaCrop.TOMATO,
    description: 'Fresh, juicy tomatoes grown using sustainable farming practices. Perfect for cooking and salads.',
    unitPrice: 800,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400&h=300&fit=crop',
    quantity: 500,
    measurementUnit: MeasurementUnit.KG,
    category: RwandaCropCategory.VEGETABLES,
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    location: 'Musanze District',
    isNegotiable: true,
    certification: CertificationType.RWANDA_GAP,
    productStatus: ProductStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    farmer: {
      id: 'farmer-1',
      name: 'Jean Baptiste Uwimana',
      verified: true,
      rating: 4.8,
      totalSales: 150,
      responseTime: 2,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      farmName: 'Green Valley Farm',
      experience: 8
    },
    freshness: 'fresh',
    organic: true,
    views: 245,
    inquiries: 12,
    trending: true,
    availableQuantity: 500,
    minimumOrder: 10,
    deliveryOptions: ['pickup', 'delivery'],
    estimatedDelivery: '1-2 days',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    id: '2',
    name: RwandaCrop.IRISH_POTATO,
    description: 'High-quality Irish potatoes, perfect for various culinary applications.',
    unitPrice: 450,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    quantity: 1000,
    measurementUnit: MeasurementUnit.KG,
    category: RwandaCropCategory.ROOTS_TUBERS,
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: 'Nyagatare District',
    isNegotiable: false,
    certification: CertificationType.RSB,
    productStatus: ProductStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    farmer: {
      id: 'farmer-2',
      name: 'Marie Claire Mukamana',
      verified: true,
      rating: 4.6,
      totalSales: 89,
      responseTime: 1,
      farmName: 'Highland Potato Farm',
      experience: 12
    },
    freshness: 'just_harvested',
    organic: false,
    views: 189,
    inquiries: 8,
    trending: false,
    availableQuantity: 1000,
    minimumOrder: 25,
    deliveryOptions: ['pickup', 'delivery', 'shipping'],
    estimatedDelivery: '2-3 days',
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: '3',
    name: RwandaCrop.COFFEE,
    description: 'Premium Arabica coffee beans from high-altitude farms in Rwanda.',
    unitPrice: 3500,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    quantity: 200,
    measurementUnit: MeasurementUnit.KG,
    category: RwandaCropCategory.CASH_CROPS,
    harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    location: 'Huye District',
    isNegotiable: true,
    certification: CertificationType.NAEB,
    productStatus: ProductStatus.LOW_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    farmer: {
      id: 'farmer-3',
      name: 'Emmanuel Nkurunziza',
      verified: true,
      rating: 4.9,
      totalSales: 234,
      responseTime: 3,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      farmName: 'Mountain Coffee Estate',
      experience: 15
    },
    freshness: 'good',
    organic: true,
    views: 567,
    inquiries: 23,
    trending: true,
    availableQuantity: 200,
    minimumOrder: 5,
    deliveryOptions: ['pickup', 'shipping'],
    estimatedDelivery: '3-5 days',
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: '4',
    name: RwandaCrop.MAIZE,
    description: 'Yellow maize corn, dried and ready for processing or direct consumption.',
    unitPrice: 350,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    quantity: 2000,
    measurementUnit: MeasurementUnit.KG,
    category: RwandaCropCategory.CEREALS,
    harvestDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    location: 'Kayonza District',
    isNegotiable: true,
    certification: CertificationType.COOPERATIVE_CERT,
    productStatus: ProductStatus.IN_STOCK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    farmer: {
      id: 'farmer-4',
      name: 'Cooperative Twiyubake',
      verified: true,
      rating: 4.4,
      totalSales: 456,
      responseTime: 4,
      farmName: 'Twiyubake Cooperative',
      experience: 6
    },
    freshness: 'fair',
    organic: false,
    views: 123,
    inquiries: 5,
    trending: false,
    availableQuantity: 2000,
    minimumOrder: 50,
    deliveryOptions: ['pickup', 'delivery'],
    estimatedDelivery: '1-2 days',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  }
];

export const FarmProductCardDemo: React.FC = () => {
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());
  const [selectedVariant, setSelectedVariant] = useState<'grid' | 'list' | 'featured' | 'compact'>('grid');

  const handleSave = (productId: string) => {
    setSavedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleContact = (farmerId: string) => {
    console.log('Contact farmer:', farmerId);
    // In a real app, this would open a messaging interface
  };

  const handleShare = (productId: string) => {
    console.log('Share product:', productId);
    // In a real app, this would open a share dialog
  };

  const handleView = (productId: string) => {
    console.log('View product details:', productId);
    // In a real app, this would navigate to product detail page
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Enhanced Farm Product Cards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Agricultural-themed product cards with organic styling, freshness indicators, 
          farmer verification badges, and touch-optimized interactions.
        </p>
      </div>

      <Tabs value={selectedVariant} onValueChange={(value) => setSelectedVariant(value as any)}>
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="compact">Compact</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Grid Layout
                <Badge variant="outline">Default</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleProducts.map((product) => (
                  <FarmProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                    saved={savedProducts.has(product.id)}
                    onSave={handleSave}
                    onContact={handleContact}
                    onShare={handleShare}
                    onView={handleView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                List Layout
                <Badge variant="outline">Mobile Optimized</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleProducts.map((product) => (
                  <FarmProductCard
                    key={product.id}
                    product={product}
                    variant="list"
                    saved={savedProducts.has(product.id)}
                    onSave={handleSave}
                    onContact={handleContact}
                    onShare={handleShare}
                    onView={handleView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Featured Layout
                <Badge variant="outline">Premium</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleProducts.slice(0, 3).map((product) => (
                  <FarmProductCard
                    key={product.id}
                    product={product}
                    variant="featured"
                    saved={savedProducts.has(product.id)}
                    onSave={handleSave}
                    onContact={handleContact}
                    onShare={handleShare}
                    onView={handleView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Compact Layout
                <Badge variant="outline">Space Efficient</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {sampleProducts.map((product) => (
                  <FarmProductCard
                    key={product.id}
                    product={product}
                    variant="compact"
                    showActions={false}
                    saved={savedProducts.has(product.id)}
                    onSave={handleSave}
                    onContact={handleContact}
                    onShare={handleShare}
                    onView={handleView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Agricultural Design</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Organic rounded corners (12px)</li>
                <li>• Natural shadow system with green tints</li>
                <li>• Earth-tone color palette</li>
                <li>• Agricultural-themed icons</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Smart Indicators</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Freshness badges (Just Harvested, Fresh, Good, Fair)</li>
                <li>• Organic certification indicators</li>
                <li>• Stock status with color coding</li>
                <li>• Trending product highlights</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Touch Optimized</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 44px minimum touch targets</li>
                <li>• Hover states for desktop</li>
                <li>• Smooth animations and transitions</li>
                <li>• Mobile-first responsive design</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Farmer Information</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Verification badges</li>
                <li>• Rating display with stars</li>
                <li>• Farm name and experience</li>
                <li>• Response time indicators</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Rich Metadata</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• View and inquiry counts</li>
                <li>• Last updated timestamps</li>
                <li>• Delivery options</li>
                <li>• Minimum order quantities</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--agricultural-primary)]">Interactive Actions</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Save/favorite functionality</li>
                <li>• Direct farmer contact</li>
                <li>• Social sharing</li>
                <li>• Quick view details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmProductCardDemo;
'use client';

import { useState } from 'react';
import { GovernmentLayout } from '../components/GovernmentLayout';
import { Banner, type BannerData } from '../components/Banner';
import { Button } from '@/components/ui/button';

import { toast } from '@/components/ui/use-toast';
import { Edit } from 'lucide-react';

// Banner data
const bannerData: BannerData[] = [
  {
    title: 'Enjoy new farm inputs In this season',
    subtitle: 'NPK Fertilizer-2.34$/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Quality seeds available',
    subtitle: 'Hybrid Seeds-5.50$/kg',
    image: '/api/placeholder/600/300',
  },
  {
    title: 'Organic fertilizers collection',
    subtitle: 'Compost-1.80$/kg',
    image: '/api/placeholder/600/300',
  },
];

// Product data
const products = [
  {
    id: '1',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 300,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '2',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 349,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '3',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 100,
    image: '/api/placeholder/300/300',
    status: 'done',
  },
  {
    id: '4',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 250,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '5',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 180,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '6',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 200,
    image: '/api/placeholder/300/300',
    status: 'done',
  },
  {
    id: '7',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 150,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '8',
    name: 'NPK Fertilizer',
    category: 'Fertilizers',
    price: 320.4,
    stock: 275,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '9',
    name: 'Urea Fertilizer',
    category: 'Fertilizers',
    price: 280.0,
    stock: 320,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '10',
    name: 'DAP Fertilizer',
    category: 'Fertilizers',
    price: 350.0,
    stock: 200,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '11',
    name: 'Hybrid Seeds',
    category: 'Seeds',
    price: 450.0,
    stock: 150,
    image: '/api/placeholder/300/300',
    status: 'available',
  },
  {
    id: '12',
    name: 'Organic Compost',
    category: 'Fertilizers',
    price: 180.0,
    stock: 400,
    image: '/api/placeholder/300/300',
    status: 'done',
  },
];

function SuppliersProducePage() {
  const handleSetPrice = (productId: string) => {
    toast({
      title: 'Set Price',
      description: 'Price setting functionality will be implemented here.',
    });
  };

  return (
    <GovernmentLayout
      activePath="/dashboard/government/suppliers-produce"
      headerTitle="Suppliers produce"
      showDateInHeader={false}
    >
      <div className="space-y-6">
        {/* Banner Section */}
        <Banner banners={bannerData} />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const isDone = product.status === 'done';

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    In Stock
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">${product.price.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => (isDone ? undefined : handleSetPrice(product.id))}
                      className={`flex-1 ${isDone
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      disabled={isDone}
                    >
                      {isDone ? 'Done' : 'Set Price'}
                    </Button>
                    {isDone && (
                      <button
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GovernmentLayout>
  );
}

export default function GovernmentSuppliersProducePage() {
  return (

    <SuppliersProducePage />

  );
}


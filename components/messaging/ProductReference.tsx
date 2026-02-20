import React from 'react';
import { Card } from '@/components/ui/card';
import { ProgressiveImage } from '@/components/ui/progressive-loading';
import { MessageSquare, Package, AlertCircle } from 'lucide-react';
import { useProductById } from '@/hooks/useProductById';
import { imageUrl } from '@/lib/utils';

interface ProductReferenceProps {
  productId: string;
  messageContent?: string;
  compact?: boolean;
}

export function ProductReference({ productId, messageContent, compact = false }: ProductReferenceProps) {
  const { product, loading, error } = useProductById(productId);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <Package className="w-4 h-4 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-500">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-600">Product not available</span>
      </div>
    );
  }

  // Extract product info (works for both FarmerProduct and SupplierProduct)
  const productInfo = {
    name: product.name,
    image: 'image' in product ? product.image : product.images?.[0] || '/placeholder.jpg',
    price: product.unitPrice,
    unit: product.measurementUnit,
    farmerName: product.owner?.names || 'Unknown',
  };

  const imageSrc = imageUrl(productInfo.image!) ;

  if (compact) {
    return (
      <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <ProgressiveImage
            src={imageSrc}
            alt={productInfo.name}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{productInfo.name}</p>
            <p className="text-xs text-gray-500">
              {productInfo.price} RWF/{productInfo.unit} • {productInfo.farmerName}
            </p>
          </div>
          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
        {messageContent && (
          <p className="text-sm text-gray-700 mt-1">{messageContent}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Card className="overflow-hidden border border-gray-200 bg-white">
        <div className="flex">
          <div className="flex-shrink-0 w-24 h-24">
            <ProgressiveImage
              src={imageSrc}
              alt={productInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-3">
            <h4 className="font-semibold text-sm text-gray-900 mb-1">{productInfo.name}</h4>
            <p className="text-lg font-bold text-green-600 mb-1">
              {productInfo.price} RWF/{productInfo.unit}
            </p>
            <p className="text-xs text-gray-500">
              Sold by {productInfo.farmerName}
            </p>
          </div>
        </div>
      </Card>
      {messageContent && (
        <p className="text-sm text-gray-700 px-1">{messageContent}</p>
      )}
    </div>
  );
}

import React from 'react';
import { Card } from '@/components/ui/card';
import { ProgressiveImage } from '@/components/ui/progressive-loading';
import { MessageSquare, Package, AlertCircle } from 'lucide-react';
import { useProductById } from '@/hooks/useProductById';
import { imageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProductRef } from '@/types';

interface ProductReferenceProps {
  productRef: ProductRef;
  messageContent?: string;
  compact?: boolean;
  isMessageOwner: boolean
}

export function ProductReference({ productRef, messageContent, compact = false, isMessageOwner }: ProductReferenceProps) {
  const { product, loading, error } = useProductById(productRef);
  const router = useRouter()
  const { user } = useAuth()

  const handleProductClick = () => {
    if (!user) return
    const userRole = user.role.toLowerCase()
    router.push(`/${userRole}/products/${productRef.productId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
        <Package className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading product...</span>
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
    image: product.image || '/placeholder.jpg',
    price: product.unitPrice,
    unit: product.measurementUnit,
    farmerName: product.owner?.names || 'Unknown',
  };

  const imageSrc = imageUrl(productInfo.image!);

  if (compact) {
    return (
      <div className="flex flex-col gap-2 p-2 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <ProgressiveImage
            src={imageSrc}
            alt={productInfo.name}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">{productInfo.name}</p>
            <p className="text-xs text-gray-500">
              {productInfo.price} RWF/{productInfo.unit} • {productInfo.farmerName}
            </p>
          </div>
          <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
        {messageContent && (
          <p className="text-sm text-background mt-1">{messageContent}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 cursor-pointer"
      onClick={handleProductClick}>
      <Card className="overflow-hidden border border-border bg-card">
        <div className="flex">
          <div className="shrink-0 w-24 h-24">
            <ProgressiveImage
              src={imageSrc}
              alt={productInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-3">
            <h4 className="font-semibold text-sm text-foreground mb-1">{productInfo.name}</h4>
            <p className="text-lg font-semibold text-success mb-1">
              {productInfo.price} RWF/{productInfo.unit}
            </p>
            <p className="text-xs text-muted-foreground">
              Sold by {productInfo.farmerName}
            </p>
          </div>
        </div>
      </Card>
      {messageContent && (
        <p className={`text-sm  px-1 ${isMessageOwner ? 'text-background' : 'text-foreground'}`}>{messageContent}</p>
      )}
    </div>
  );
}

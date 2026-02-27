'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, MapPin, Calendar, Award, Info, Edit, Trash2, Package, DollarSign, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { FarmerProduct, SupplierProduct } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface ProductDetailProps {
  product: FarmerProduct | SupplierProduct;
  productType: 'farmer' | 'supplier';
  onSaveProduct?: (productId: string) => void;
  onShareProduct?: (product: FarmerProduct | SupplierProduct) => void;
  onEditProduct?: (product: FarmerProduct | SupplierProduct) => void;
  onDeleteProduct?: (productId: string) => void;
  onPurchaseProduct?: (product: FarmerProduct | SupplierProduct) => void;
  isSaved?: boolean;
  showActions?: boolean;
  className?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  productType,
  onSaveProduct,
  onShareProduct,
  onEditProduct,
  onDeleteProduct,
  onPurchaseProduct,
  isSaved = false,
  showActions = true,
  className,
}) => {
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = (product as any).images || (product.image ? [product.image] : ['/placeholder.png']);
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOwner = user?.id === product.owner.id;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
    if (isLowStock) {
      return { text: `Only ${product.quantity} left`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
    return { text: `${product.quantity} available`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockStatus = getStockStatus();

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
    }).format(price);
  };

  return (
    <div className={cn('max-w-6xl mx-auto p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{product.description}</p>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(stockStatus.color, stockStatus.bgColor)}>
              {stockStatus.text}
            </Badge>
            {product.isNegotiable && (
              <Badge variant="secondary">Negotiable</Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Out of Stock</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    selectedImageIndex === index ? 'border-green-600' : 'border-gray-200'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Price and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Product Information</span>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(product.unitPrice)}
                  <span className="text-sm text-gray-500 ml-1">/{product.measurementUnit}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-medium">{formatPrice(product.unitPrice)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="font-medium">{product.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Harvested:</span>
                  <span className="font-medium">{formatDate(product.harvestDate)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Certification:</span>
                <Badge variant={product.certification === 'COOPERATIVE_CERT' ? 'default' : 'secondary'}>
                  {product.certification}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {product.owner.names.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{product.owner.names}</h3>
                  <p className="text-sm text-gray-600">
                    {productType === 'farmer' ? 'Farmer' : 'Supplier'} • {product.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {showActions && (
            <div className="space-y-3">
              {!isOwner && (
                <Button
                  onClick={() => onPurchaseProduct?.(product)}
                  disabled={isOutOfStock}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Purchase Product'}
                </Button>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onSaveProduct?.(product.id)}
                  className="flex-1"
                >
                  <Heart className={cn('w-4 h-4 mr-2', isSaved && 'fill-red-500 text-red-500')} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onShareProduct?.(product)}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {isOwner && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onEditProduct?.(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDeleteProduct?.(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

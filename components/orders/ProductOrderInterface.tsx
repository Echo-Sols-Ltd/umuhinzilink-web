'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, MapPin, Calendar, Award, Info } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import OrderCreationModal from './OrderCreationModal';

interface ProductOrderInterfaceProps {
  product: Product;
  productType: 'farmer' | 'supplier';
  onSaveProduct?: (productId: string) => void;
  onShareProduct?: (product: Product) => void;
  isSaved?: boolean;
  className?: string;
  setIsPurchasing: (isPurchasing: boolean) => void;
}

const ProductOrderInterface: React.FC<ProductOrderInterfaceProps> = ({
  product,
  productType,
  onSaveProduct,
  onShareProduct,
  isSaved = false,
  className,
  setIsPurchasing,
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = (product as any).images || (product.image ? [product.image] : ['/placeholder.png']);
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;

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

  const getCertificationBadge = (certification: string) => {
    if (certification === 'NONE') return null;

    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        <Award className="w-3 h-3" />
        <span>{certification.replace('_', ' ')}</span>
      </div>
    );
  };

  const sellerInfo = 'farmer' in product ? product.owner : product.owner;

  return (
    <>
      <div className={cn('bg-card rounded-lg shadow-lg overflow-hidden', className)}>
        {/* Image Gallery */}
        <div className="relative">
          <div className="bg-foreground h-[400px] w-[500px]">
            <Image
              src={images[selectedImageIndex]}
              alt={product.name}
              fill

              className="object-cover"
            />
          </div>

          {/* Image Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors',
                    index === selectedImageIndex ? 'bg-background' : 'bg-background bg-opacity-50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => onSaveProduct?.(product.id)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                isSaved ? 'bg-destructive text-destructive-foreground' : 'bg-background text-muted-foreground hover:bg-background'
              )}
            >
              <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
            </button>
            <button
              onClick={() => onShareProduct?.(product)}
              className="w-10 h-10 bg-background text-muted-foreground rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              stockStatus.bgColor,
              stockStatus.color
            )}>
              {stockStatus.text}
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-semibold text-primary">
                  {product.unitPrice.toLocaleString()} RWF
                </span>
                <span className="text-muted-foreground">per {product.measurementUnit}</span>
              </div>
              {product.isNegotiable && (
                <span className="px-2 py-1 bg-info/10 text-info rounded-full text-xs font-medium">
                  Negotiable
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm font-medium text-foreground">{product.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Harvest Date:</span>
                <span className="text-sm font-medium text-foreground">
                  {productType === 'farmer' && 'harvestDate' in product ? formatDate((product as any).harvestDate) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm font-medium text-foreground">{product.category}</span>
              </div>

              {getCertificationBadge(product.certification) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Certification:</span>
                  {getCertificationBadge(product.certification)}
                </div>
              )}
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {productType === 'farmer' ? 'Farmer' : 'Supplier'} Information
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-success font-semibold text-lg">
                  {sellerInfo.names.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{sellerInfo.names}</p>
                <p className="text-sm text-muted-foreground">{sellerInfo.email}</p>
                {sellerInfo.address && (
                  <p className="text-sm text-muted-foreground">
                    {sellerInfo.address.district}, {sellerInfo.address.province}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Button */}
          <div className="flex space-x-4">
            <button
              onClick={() => setIsPurchasing(true)}
              disabled={isOutOfStock}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors',
                isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Order Now'}</span>
            </button>

            <button
              onClick={() => onSaveProduct?.(product.id)}
              className={cn(
                'px-6 py-3 border rounded-lg font-medium transition-colors',
                isSaved
                  ? 'border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20'
                  : 'border-border text-foreground hover:bg-background'
              )}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Additional Information */}
          {isLowStock && !isOutOfStock && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  Limited stock available. Order soon to avoid disappointment.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>


    </>
  );
};

export default ProductOrderInterface;
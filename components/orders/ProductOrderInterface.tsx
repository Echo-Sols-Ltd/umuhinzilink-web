'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, MapPin, Calendar, Award, Info } from '@/lib/icons';
import Image from 'next/image';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency, formatDate } from '@/lib/localeFormat';

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
  const { t, locale } = useI18n();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = (product as any).images || (product.image ? [product.image] : ['/placeholder.png']);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        text: t('buyer.productDetail.stock.outOfStock'),
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    }
    if (isLowStock) {
      return {
        text: t('buyer.productDetail.stock.lowStock', { count: product.stockQuantity }),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      };
    }
    return {
      text: t('buyer.productDetail.stock.available', { count: product.stockQuantity }),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    };
  };

  const stockStatus = getStockStatus();

  const getCertificationBadge = (certification: string) => {
    if (certification === 'NONE') return null;

    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        <Award className="w-3 h-3" />
        <span>{certification.replace('_', ' ')}</span>
      </div>
    );
  };

  const sellerInfo = product.owner;

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
                  {formatCurrency(product.unitPrice, locale)}
                </span>
                <span className="text-muted-foreground">
                  {t('buyer.productDetail.perUnit', { unit: product.measurementUnit })}
                </span>
              </div>
              {product.isNegotiable && (
                <span className="px-2 py-1 bg-info/10 text-info rounded-full text-xs font-medium">
                  {t('buyer.productDetail.actions.negotiable')}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('buyer.productDetail.description')}</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('buyer.productDetail.location')}:</span>
                <span className="text-sm font-medium text-foreground">{product.district}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('buyer.productDetail.details.harvestDate')}:</span>
                <span className="text-sm font-medium text-foreground">
                  {productType === 'farmer' && 'harvestDate' in product
                    ? formatDate((product as any).harvestDate, locale, { month: 'long' })
                    : t('ordersPage.productOrder.notAvailable')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('buyer.productDetail.category')}:</span>
                <span className="text-sm font-medium text-foreground">{product.category}</span>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {productType === 'farmer'
                ? t('buyer.productDetail.farmerInfo')
                : t('buyer.productDetail.supplierInfo')}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-success font-semibold text-lg">
                  {sellerInfo.firstName?.charAt(0) || sellerInfo.lastName?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{sellerInfo.firstName} {sellerInfo.lastName}</p>
                <p className="text-sm text-muted-foreground">{sellerInfo.email}</p>
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
              <span>
                {isOutOfStock
                  ? t('buyer.productDetail.stock.outOfStock')
                  : t('ordersPage.productOrder.orderNow')}
              </span>
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
              {isSaved
                ? t('buyer.productDetail.actions.saved')
                : t('buyer.productDetail.actions.save')}
            </button>
          </div>

          {/* Additional Information */}
          {isLowStock && !isOutOfStock && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  {t('buyer.productDetail.stock.limitedWarning')}
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

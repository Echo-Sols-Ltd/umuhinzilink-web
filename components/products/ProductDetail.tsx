'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, MapPin, Calendar, Award, Info, Edit, Trash2, Package, DollarSign, TrendingUp, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { FarmerProduct, SupplierProduct } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

import { useI18n } from '@/contexts/I18nContext';

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
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = (product as any).images || (product.image ? [product.image] : ['/placeholder.png']);
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOwner = user?.id === product.owner.id;

  // 🚀 Chat with Product Owner functionality
  const handleChatWithOwner = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    // Navigate to chat with the product owner
    router.push(`/chat/${product.owner.id}`);
  };

  const getStockStatus = () => {
    if (isOutOfStock) {
      return { text: t('buyer.productDetail.stock.outOfStock'), color: 'text-red-600', bgColor: 'bg-red-100' };
    }
    if (isLowStock) {
      return { text: t('buyer.productDetail.stock.lowStock', { count: product.quantity }), color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
    return { text: t('buyer.productDetail.stock.available', { count: product.quantity }), color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockStatus = getStockStatus();

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={cn('max-w-6xl mx-auto p-4 sm:p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-1">{product.description}</p>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('px-3 py-1', stockStatus.color, stockStatus.bgColor)}>
              {stockStatus.text}
            </Badge>
            {product.isNegotiable && (
              <Badge variant="secondary" className="px-3 py-1 font-medium">{t('buyer.productDetail.actions.negotiable')}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border shadow-sm">
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-destructive text-2xl font-bold uppercase tracking-widest">{t('buyer.productDetail.stock.outOfStock')}</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                    selectedImageIndex === index ? 'border-success' : 'border-border hover:border-success/50'
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
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center justify-between gap-4">
                <span className="text-lg font-semibold">{t('buyer.productDetail.title')}</span>
                <div className="text-xl sm:text-2xl font-bold text-success flex items-baseline">
                  {formatPrice(product.unitPrice)}
                  <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-1">/{product.measurementUnit}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Package className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.productDetail.category')}</span>
                    <span className="font-medium text-sm sm:text-base capitalize">{product.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.productDetail.price')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatPrice(product.unitPrice)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.productDetail.location')}</span>
                    <span className="font-medium text-sm sm:text-base">{product.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('buyer.productDetail.harvested')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatDate(product.harvestDate)}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-border/50" />
              
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">{t('buyer.productDetail.certification')}:</span>
                <Badge variant={product.certification === 'COOPERATIVE_CERT' ? 'default' : 'secondary'} className="font-medium tracking-wide">
                  {product.certification}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="shadow-sm border-border overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-semibold">
                {productType === 'farmer' ? t('buyer.productDetail.farmerInfo') : t('buyer.productDetail.supplierInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                  <span className="text-lg font-bold text-success">
                    {product.owner.names.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{product.owner.names}</h3>
                  <p className="text-sm text-muted-foreground">
                    {productType === 'farmer' ? t('sidebar.roles.farmer') : t('sidebar.roles.supplier')} • {product.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {showActions && (
            <div className="space-y-4">
              {!isOwner && (
                <Button
                  onClick={() => onPurchaseProduct?.(product)}
                  disabled={isOutOfStock}
                  className="w-full text-lg h-12 sm:h-14 font-bold shadow-lg shadow-success/20 hover:shadow-success/40 transition-all"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  {isOutOfStock ? t('buyer.productDetail.stock.outOfStock') : t('buyer.productDetail.actions.purchase')}
                </Button>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onSaveProduct?.(product.id)}
                  className="flex-1 h-12 shadow-sm border-border hover:border-success/50 transition-colors"
                >
                  <Heart className={cn('w-4 h-4 mr-2', isSaved && 'fill-destructive text-destructive')} />
                  {isSaved ? t('buyer.productDetail.actions.saved') : t('buyer.productDetail.actions.save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onShareProduct?.(product)}
                  className="flex-1 h-12 shadow-sm border-border hover:border-success/50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2 text-info" />
                  {t('buyer.productDetail.actions.share')}
                </Button>
              </div>

              {isOwner ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onEditProduct?.(product)}
                    className="flex-1 h-11 border-border shadow-sm"
                  >
                    <Edit className="w-4 h-4 mr-2 text-info" />
                    {t('buyer.productDetail.actions.edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDeleteProduct?.(product.id)}
                    className="flex-1 h-11 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('buyer.productDetail.actions.delete')}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleChatWithOwner}
                  className="w-full h-12 border-success/30 hover:border-success/60 text-success hover:bg-success/10 transition-all font-medium"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('buyer.productDetail.actions.chat')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

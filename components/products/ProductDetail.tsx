'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, MapPin, Calendar, Award, Info, Edit, Trash2, Package, DollarSign, TrendingUp, MessageSquare, Star, Minus, Plus, Home, ChevronRight, User, Clock, Truck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface ProductDetailProps {
  product: Product;
  onSaveProduct?: (productId: string) => void;
  onShareProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onPurchaseProduct?: (product: Product, quantity: number) => void;
  isSaved?: boolean;
  showActions?: boolean;
  className?: string;
}

import { useI18n } from '@/contexts/I18nContext';
import Footer from '../Footer';

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
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
  const [quantity, setQuantity] = useState(1);
  const images = (product as any).images || (product.image ? [product.image] : ['/placeholder.png']);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isOwner = user?.id === product.owner.id;

  // Chat with Product Owner — start via product purchase/negotiation flow
  const handleChatWithOwner = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (isOwner) return;

    notify.info(
      product.isNegotiable
        ? 'Use Buy to make an offer — you can chat once a negotiation starts.'
        : 'Purchase this product to communicate with the seller.',
      'Contact seller'
    );
    router.push(`/products/${product.id}${product.isNegotiable ? '?negotiate=1' : ''}`);
  };

  const getStockStatus = () => {
    if (isOutOfStock) {
      return { text: t('buyer.productDetail.stock.outOfStock'), color: 'text-red-600', bgColor: 'bg-red-100' };
    }
    if (isLowStock) {
      return { text: t('buyer.productDetail.stock.lowStock', { count: product.stockQuantity }), color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
    return { text: t('buyer.productDetail.stock.available', { count: product.stockQuantity }), color: 'text-green-600', bgColor: 'bg-green-100' };
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



        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                {t('buyer.productDetail.badges.freshHarvest')}
              </Badge>
              <Badge variant="outline" className="border-green-200 text-green-700">
                {product.category}
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {product.district}
              </Badge>
            </div>

            {/* Rating and Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn('w-4 h-4', i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                  ))}
                </div>
                <span className="font-semibold">{t('buyer.productDetail.overallRating')}</span>
                <span className="text-muted-foreground">{t('buyer.productDetail.reviews')}</span>
              </div>
              <div className={cn('px-3 py-1 rounded-full text-sm font-medium', stockStatus.bgColor, stockStatus.color)}>
                In stock - {product.stockQuantity} {product.measurementUnit} available
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(product.unitPrice)} per {product.measurementUnit}
            </div>
          </div>
          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('buyer.productDetail.description')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('buyer.productDetail.productDetails')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.weight')}</span>
                  <span className="font-medium">{product.stockQuantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.harvestDate')}</span>
                  <span className="font-medium">
                    {formatDate(product.createdAt)}  
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.location')}</span>
                  <span className="font-medium">{product.district}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.variety')}</span>
                  <span className="font-medium">PAN 691 white</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.storage')}</span>
                  <span className="font-medium">Dry warehouse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('buyer.productDetail.details.delivery')}</span>
                  <span className="font-medium">2-4 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">{t('buyer.productDetail.quantity')}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                  max={product.stockQuantity}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-muted-foreground">bag</span>
              </div>
            </div>

            {showActions && (
              <div className="space-y-3">
                <Button
                  onClick={() => onPurchaseProduct?.(product, quantity)}
                  disabled={isOutOfStock}
                  className="w-full h-12 font-semibold shadow-lg shadow-success/20 hover:shadow-success/40 transition-all"
                  size="lg"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {t('productCard.buy')} - {formatPrice(product.unitPrice * quantity)}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => onSaveProduct?.(product.id)}
                  className="w-full h-12 shadow-sm border-border hover:border-success/50 transition-colors"
                >
                  <Heart className={cn('w-4 h-4 mr-2', isSaved && 'fill-destructive text-destructive')} />
                  {isSaved ? t('buyer.productDetail.actions.saved') : t('buyer.productDetail.saveToWishlist')}
                </Button>
              </div>
            )}
          </div>
          {/* Sold By Section */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('buyer.productDetail.soldBy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                  <User className="w-8 h-8 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{product.owner.firstName} {product.owner.lastName}</h3>
                  <p className="text-muted-foreground mb-3">
                    {product.district}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.9</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('buyer.productDetail.sellerRating')}</p>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold mb-1">243</div>
                      <p className="text-xs text-muted-foreground">{t('buyer.productDetail.sales')}</p>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold mb-1">98%</div>
                      <p className="text-xs text-muted-foreground">{t('buyer.productDetail.onTimeDelivery')}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleChatWithOwner}
                    className="w-full border-success/30 hover:border-success/60 text-success hover:bg-success/10 transition-all font-medium"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('buyer.productDetail.messageSeller')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Customer Reviews */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('buyer.productDetail.customerReviews')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">4.8</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn('w-5 h-5', i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground">(124 reviews)</span>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full"
                      style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <div className="border-b border-border/50 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Mukamana</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Nov 2025</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Very good quality maize. Delivered on time to Kigali. Will order again next season.
              </p>
            </div>

            <div className="border-b border-border/50 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Niyonzima</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Oct 2025</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Exactly as described. Well dried, no mold. Seller responded quickly to my questions.
              </p>
            </div>

            <div className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Uwera</span>
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
                <span className="text-sm text-muted-foreground">Oct 2025</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Good product. Packaging could be tighter but the maize quality is excellent for milling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('buyer.productDetail.relatedProducts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Yellow maize 50kg', seller: 'Karangwa - Musange', price: 11000 },
            { name: 'Sorghum 50kg bag', seller: 'Bizimana - Ruhengeri', price: 9500 },
            { name: 'Rice paddy 25kg', seller: 'Nkurunziza - Bugesera', price: 14000 },
            { name: 'Beans 25kg bag', seller: 'Uwimana - Musanze', price: 18500 },
          ].map((relatedProduct, index) => (
            <Card key={index} className="shadow-sm border-border hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div className="aspect-square bg-muted rounded-lg mb-3" />
                <h3 className="font-semibold text-sm mb-1">{relatedProduct.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{relatedProduct.seller}</p>
                <p className="font-bold text-sm">{formatPrice(relatedProduct.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;

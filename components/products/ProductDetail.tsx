'use client';

import React, { useState } from 'react';
import {
  Heart, Share2, MapPin, Package, MessageSquare,
  Minus, Plus, User, Edit, Trash2, Sprout,
} from '@/lib/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, UserRole } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { INTL_LOCALE, formatCurrency as fmtCurrency, formatDate as fmtDate } from '@/lib/localeFormat';
import { notify } from '@/lib/notify';
import BuyModal from './BuyModal';

interface ProductDetailProps {
  product: Product;
  onSaveProduct?: (productId: string) => void;
  onShareProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  isSaved?: boolean;
  showActions?: boolean;
  openBuyOnMount?: boolean;
  className?: string;
}

function formatCategory(category: string) {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDistrict(district: string) {
  return district.charAt(0) + district.slice(1).toLowerCase();
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onSaveProduct,
  onShareProduct,
  onEditProduct,
  onDeleteProduct,
  isSaved,
  showActions = true,
  openBuyOnMount = false,
  className,
}) => {
  const { t, locale } = useI18n();
  const { user, toggleSavedProduct, isProductSaved } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [buyOpen, setBuyOpen] = useState(openBuyOnMount);
  const [savingWishlist, setSavingWishlist] = useState(false);

  const saved = isSaved ?? isProductSaved(product.id);

  const handleSaveClick = async () => {
    if (onSaveProduct) {
      onSaveProduct(product.id);
      return;
    }
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (savingWishlist) return;

    setSavingWishlist(true);
    const wasSaved = saved;
    const ok = await toggleSavedProduct(product.id);
    if (ok) {
      notify.success(wasSaved ? 'Removed from saved' : `${product.name} saved`);
    }
    setSavingWishlist(false);
  };

  const isOutOfStock = product.stockQuantity === 0 || product.status === 'OUT_OF_STOCK';
  const isLowStock = product.status === 'LOW_STOCK';
  const isOwner = user?.id === product.owner?.id;
  const isAdmin = user?.role === UserRole.ADMIN;
  const canParticipate = Boolean(user) && !isAdmin;
  const showParticipantActions = showActions && canParticipate && !isOwner;

  const formatPrice = (price: number) => fmtCurrency(price, locale);

  const formatDate = (dateString: string) => fmtDate(dateString, locale);

  const handleChatWithOwner = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (isOwner) return;
    router.push(`/negotiations?seller=${product.owner.id}&product=${product.id}`);
  };

  const stockLabel = isOutOfStock
    ? t('buyer.productDetail.stock.outOfStock')
    : isLowStock
      ? t('buyer.productDetail.stock.lowStock', { count: product.stockQuantity })
      : t('buyer.productDetail.stock.available', { count: product.stockQuantity });

  const stockCls = isOutOfStock
    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
    : isLowStock
      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
      : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400';

  return (
    <>
      <div className={cn('space-y-5', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-border shadow-sm">
            <Image
              src={imageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-sm font-bold uppercase tracking-widest text-white bg-red-600/90 px-4 py-2 rounded-xl">
                  {t('buyer.productDetail.stock.outOfStock')}
                </span>
              </div>
            )}
            {product.isNegotiable && !isOutOfStock && (
              <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-green-600 px-2.5 py-1 rounded-full">
                Negotiable
              </span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                  {formatCategory(String(product.category))}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground flex items-center gap-1">
                  <MapPin size={11} />
                  {formatDistrict(String(product.district))}
                </span>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', stockCls)}>
                  {stockLabel}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 shadow-sm">
              <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                {formatPrice(product.unitPrice)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                per {String(product.measurementUnit).toLowerCase()}
              </p>
            </div>

            {product.description && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-2">
                  {t('buyer.productDetail.description')}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Package size={15} className="text-green-600" />
                {t('buyer.productDetail.productDetails')}
              </h2>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t('buyer.productDetail.details.location')}</dt>
                  <dd className="font-medium text-foreground">{formatDistrict(String(product.district))}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Available stock</dt>
                  <dd className="font-medium text-foreground">
                    {product.stockQuantity} {String(product.measurementUnit).toLowerCase()}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t('buyer.productDetail.details.harvestDate')}</dt>
                  <dd className="font-medium text-foreground">{formatDate(product.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Views</dt>
                  <dd className="font-medium text-foreground">{product.viewCount ?? 0}</dd>
                </div>
              </dl>
            </div>

            {showParticipantActions && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground shrink-0">
                    {t('buyer.productDetail.quantity')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white dark:bg-gray-900 text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            product.stockQuantity,
                            Math.max(1, parseInt(e.target.value, 10) || 1),
                          ),
                        )
                      }
                      className="w-16 h-9 text-center text-sm font-semibold rounded-xl border border-border bg-white dark:bg-gray-900 text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                      min={1}
                      max={product.stockQuantity}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                      }
                      disabled={quantity >= product.stockQuantity}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white dark:bg-gray-900 text-foreground disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {String(product.measurementUnit).toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBuyOpen(true)}
                  disabled={isOutOfStock}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {product.isNegotiable ? 'Negotiate or buy' : t('productCard.buy')}
                  <span className="text-green-100">· {formatPrice(product.unitPrice * quantity)}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    disabled={savingWishlist}
                    className="flex-1 h-10 flex items-center justify-center gap-2 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <Heart
                      size={15}
                      className={cn(saved && 'fill-red-500 text-red-500')}
                    />
                    {saved ? t('buyer.productDetail.actions.saved') : t('buyer.productDetail.saveToWishlist')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onShareProduct?.(product)}
                    className="h-10 w-10 flex items-center justify-center border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleChatWithOwner}
                    className="h-10 w-10 flex items-center justify-center border border-border rounded-xl text-muted-foreground hover:text-green-600 hover:border-green-300 transition-colors"
                    aria-label="Message seller"
                  >
                    <MessageSquare size={15} />
                  </button>
                </div>
              </div>
            )}

            {showActions && isOwner && !isAdmin && (
              <div className="flex gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Edit size={15} />
                  Edit listing
                </Link>
                <button
                  type="button"
                  onClick={() => onDeleteProduct?.(product.id)}
                  className="h-10 px-4 flex items-center justify-center gap-2 border border-red-200 dark:border-red-900 text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seller card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <User size={15} className="text-green-600" />
            {t('buyer.productDetail.soldBy')}
          </h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center shrink-0">
              <User size={22} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {product.owner.firstName} {product.owner.lastName}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin size={12} />
                {formatDistrict(String(product.district))}
              </p>
              {!isOwner && user && (
                <button
                  type="button"
                  onClick={handleChatWithOwner}
                  className="mt-3 h-9 px-4 flex items-center gap-2 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-xs font-semibold hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                >
                  <MessageSquare size={13} />
                  {t('buyer.productDetail.messageSeller')}
                </button>
              )}
              {!user && (
                <Link
                  href="/auth/signin"
                  className="mt-3 inline-flex h-9 px-4 items-center gap-2 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign in to contact seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {buyOpen && (
        <BuyModal product={product} onClose={() => setBuyOpen(false)} />
      )}
    </>
  );
};

export default ProductDetail;

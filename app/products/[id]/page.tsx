'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Sprout, Share2 } from '@/lib/icons';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';
import DetailPageShell from '@/components/layout/DetailPageShell';
import PageLoading from '@/components/layout/PageLoading';
import { Product } from '@/types';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';
import { useProductAction } from '@/hooks/useProductAction';
import { useI18n } from '@/contexts/I18nContext';

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

function ProductError({ message, onBack }: { message: string; onBack: () => void }) {
  const { t } = useI18n();
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <Sprout size={28} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">{t('products.detail.notFound')}</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t('common.goBack')}
          </button>
          <Link
            href="/products"
            className="h-10 px-5 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t('products.detail.browseProducts')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const openNegotiate = searchParams.get('negotiate') === '1';
  const { fetchProductById } = useProduct();
  const { deleteProduct } = useProductAction();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProductById(productId);
        setProduct(res);
        if (!res) setError(t('products.detail.notFoundMessage'));
      } catch {
        setError(t('products.detail.notFoundMessage'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId, fetchProductById, t]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url,
      }).catch(() => null);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        notify.success(t('products.detail.linkCopied'));
      }).catch(() => {
        notify.error(t('products.detail.linkCopyFailed'));
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('products.detail.deleteConfirm'))) return;
    await deleteProduct(id);
  };

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Products', href: ROUTES.products },
    ...(product ? [{ label: product.name }] : []),
  ];

  return (
    <DetailPageShell
      breadcrumbs={breadcrumbs}
      onBack={() => router.back()}
      actions={
        product ? (
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={t('products.detail.shareAria')}
          >
            <Share2 size={14} />
          </button>
        ) : null
      }
    >
      {loading ? (
        <ProductSkeleton />
      ) : error || !product ? (
        <ProductError message={error ?? t('products.detail.notFound')} onBack={() => router.back()} />
      ) : (
        <ProductDetail
          product={product}
          onShareProduct={handleShare}
          onDeleteProduct={handleDelete}
          showActions={true}
          openBuyOnMount={openNegotiate}
          className="!p-0"
        />
      )}
    </DetailPageShell>
  );
}

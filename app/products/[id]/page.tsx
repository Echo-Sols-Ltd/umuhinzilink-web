'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Sprout, Share2 } from 'lucide-react';
import Link from 'next/link';
import ProductDetail from '@/components/products/ProductDetail';
import DetailPageShell from '@/components/layout/DetailPageShell';
import PageLoading from '@/components/layout/PageLoading';
import { Product } from '@/types';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 rounded-lg bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
          <div className="h-12 rounded-xl bg-gray-200 dark:bg-gray-800 mt-6" />
        </div>
      </div>
    </div>
  );
}

function ProductError({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <Sprout size={28} className="text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Go back
          </button>
          <Link
            href="/products"
            className="h-10 px-5 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const openNegotiate = searchParams.get('negotiate') === '1';
  const { fetchProductById } = useProduct();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedProducts');
      if (raw) setSavedIds(new Set(JSON.parse(raw)));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProductById(productId);
        setProduct(res);
        if (!res) setError('This product could not be found or may have been removed.');
      } catch {
        setError('This product could not be found or may have been removed.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId, fetchProductById]);

  const handleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        notify.success('Removed from saved');
      } else {
        next.add(id);
        notify.success(`${product?.name} saved`);
      }
      try {
        localStorage.setItem('savedProducts', JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  };

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
        notify.success('Link copied to clipboard');
      }).catch(() => {
        notify.error('Could not copy link');
      });
    }
  };

  const breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Products', href: '/products' },
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
            aria-label="Share product"
          >
            <Share2 size={14} />
          </button>
        ) : null
      }
    >
      {loading ? (
        <ProductSkeleton />
      ) : error || !product ? (
        <ProductError message={error ?? 'Product not found'} onBack={() => router.back()} />
      ) : (
        <ProductDetail
          product={product}
          onSaveProduct={handleSave}
          onShareProduct={handleShare}
          isSaved={savedIds.has(product.id)}
          showActions={true}
          openBuyOnMount={openNegotiate}
          className="!p-0"
        />
      )}
    </DetailPageShell>
  );
}

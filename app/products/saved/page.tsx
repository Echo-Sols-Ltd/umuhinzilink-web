'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { Product } from '@/types';
import { productService } from '@/services/products';
import ProductCard from '@/components/products/ProductCard';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';

export default function SavedProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const { products: marketplaceProducts } = useProduct();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const savedIdsKey = user?.savedProducts?.join(',') ?? '';

  const loadSaved = useCallback(async () => {
    const ids = savedIdsKey ? savedIdsKey.split(',') : [];
    if (!ids.length) {
      setSavedProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const fromMarketplace = marketplaceProducts.filter((p) => ids.includes(p.id));
      const missingIds = ids.filter((id) => !fromMarketplace.some((p) => p.id === id));

      const fetched =
        missingIds.length > 0
          ? (
              await Promise.all(
                missingIds.map(async (id) => {
                  const res = await productService.getProductById(id);
                  return res.success && res.data ? res.data : null;
                }),
              )
            ).filter((p): p is Product => p !== null)
          : [];

      const merged = [...fromMarketplace];
      fetched.forEach((p) => {
        if (!merged.some((m) => m.id === p.id)) merged.push(p);
      });

      setSavedProducts(merged.filter((p) => ids.includes(p.id)));
    } finally {
      setLoading(false);
    }
  }, [savedIdsKey, marketplaceProducts]);

  useEffect(() => {
    if (!authLoading && user) {
      loadSaved();
    }
  }, [authLoading, user, loadSaved]);

  // Refresh list when saved IDs change (e.g. heart removed on card)
  useEffect(() => {
    if (!authLoading && user) {
      const ids = user.savedProducts ?? [];
      setSavedProducts((prev) => prev.filter((p) => ids.includes(p.id)));
    }
  }, [user?.savedProducts, authLoading, user]);

  if (authLoading || !user) {
    return (
      <AppLayout maxWidth="max-w-6xl">
        <PageLoading fullScreen={false} label="Loading saved products" description="Fetching your wishlist…" />
      </AppLayout>
    );
  }

  return (
    <AppLayout maxWidth="max-w-6xl">
      <PageHeader
        title="Saved products"
        description="Products you saved for later."
        backHref="/profile"
        backLabel="Profile"
      />

      {loading ? (
        <PageLoading fullScreen={false} label="Loading saved products" description="Fetching your wishlist…" />
      ) : savedProducts.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center bg-white dark:bg-gray-900 rounded-2xl border border-border">
          <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
            <Heart size={28} className="text-green-400" />
          </div>
          <h3 className="text-base font-bold text-foreground">No saved products yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Tap the heart on a product to save it here.
          </p>
          <Link
            href="/products"
            className="mt-5 h-10 px-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Package size={15} />
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}

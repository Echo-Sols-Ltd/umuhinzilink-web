'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import { UserType, ProductType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import ProductDetail from '@/components/products/ProductDetail';
import { useToast } from '@/components/ui/use-toast';

import { useI18n } from '@/contexts/I18nContext';
import Navbar from '@/components/Navbar';
import { useCartAction } from '@/hooks/useCartAction';

export default function BuyerProductDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const {
    marketplaceProducts,
    currentProduct: contextProduct,
    setCurrentProduct,
    fetchMarketplaceProducts,
    loading: contextLoading,
    showOrderModal
  } = useProduct();
  const { addProductToCart } = useCartAction()
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState<'farmer' | 'supplier'>('farmer');
  const [error, setError] = useState<string | null>(null);
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());
  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        let foundProduct = marketplaceProducts?.find((p: Product) => p.id === productId);

        if (!foundProduct && contextProduct?.id === productId) {
          foundProduct = contextProduct;
        }

        if (foundProduct) {
          setCurrentProduct(foundProduct);
          setProductType(foundProduct.productType === ProductType.FARMER_PRODUCT ? 'farmer' : 'supplier');
          setLoading(false);
        } else {
          const { productService } = await import('@/services/products');
          const response = await productService.getProductById(productId);

          if (response.success && response.data) {
            const data = response.data;
            setCurrentProduct(data);
            setProductType(data.productType === ProductType.FARMER_PRODUCT ? 'farmer' : 'supplier');
            fetchMarketplaceProducts();
          } else {
            throw new Error('Product not found');
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(t('buyer.productDetail.notFoundDesc'));
        showToast({
          title: t('common.error'),
          description: t('buyer.productDetail.notFoundDesc'),
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, marketplaceProducts, contextProduct, setCurrentProduct, fetchMarketplaceProducts, showToast, t]);


  useEffect(() => {
    // Load saved products
    const saved = localStorage.getItem('savedProducts');
    if (saved) {
      setSavedProducts(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleSaveProduct = (productId: string) => {
    const newSaved = new Set(savedProducts);
    if (newSaved.has(productId)) {
      newSaved.delete(productId);
      showToast({
        description: t('buyer.productDetail.toasts.removedFromFavorites'),
        variant: 'default',
      });
    } else {
      newSaved.add(productId);
      showToast({
        description: t('buyer.productDetail.toasts.addedToFavorites'),
        variant: 'default',
      });
    }
    setSavedProducts(newSaved);
    localStorage.setItem('savedProducts', JSON.stringify([...newSaved]));
  };

  const handleShareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast({
        description: t('buyer.productDetail.toasts.linkCopied'),
        variant: 'default',
      });
    }
  };

  const handlePurchaseProduct = (product: Product, quantity: number) => {
    addProductToCart(product.id, quantity)
  };

  const currentProduct = contextProduct;

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('buyer.productDetail.loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="flex h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('buyer.productDetail.notFound')}</h1>
            <p className="text-muted-foreground mb-6">{error || t('buyer.productDetail.notFoundDesc')}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-success text-primary-foreground rounded-lg hover:bg-success/90 transition-colors font-medium"
            >
              {t('buyer.productDetail.goBack')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Navbar />

      <main className="flex-1 overflow-auto mt-20">
        <ProductDetail
          product={currentProduct}
          productType={productType}
          onSaveProduct={handleSaveProduct}
          onShareProduct={handleShareProduct}
          onPurchaseProduct={handlePurchaseProduct}
          isSaved={savedProducts.has(currentProduct.id)}
          showActions={true}
        />
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import ProductDetail from '@/components/products/ProductDetail';
import { useToast } from '@/components/ui/use-toast';
import { useI18n } from '@/contexts/I18nContext';

export default function FarmerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { t } = useI18n();
  const { 
    farmerProducts, 
    currentFarmerProduct, 
    setCurrentFarmerProduct,
    fetchFarmerProducts,
    loading: contextLoading
  } = useProduct();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: Check if product is already in context lists
        let foundProduct = farmerProducts?.find(p => p.id === productId);
        
        // Step 2: Check if it's the current context product
        if (!foundProduct && currentFarmerProduct?.id === productId) {
          foundProduct = currentFarmerProduct;
        }
        
        if (foundProduct) {
          // ✅ Found in context - use immediately
          setCurrentFarmerProduct(foundProduct);
          setLoading(false);
        } else {
          // ❌ Not in context - fetch from server
          const { productService } = await import('@/services/products');
          const response = await productService.getFarmerProduct(productId);
          
          if (response.success && response.data) {
            // Store in context for future use and real-time updates
            setCurrentFarmerProduct(response.data);
            
            // Refresh the list to include this product for future navigation
            fetchFarmerProducts();
          } else {
            setError(t('common.productDetailMsg.productNotFoundTitle'));
            showToast({
              title: t('common.error'),
              description: t('common.productDetailMsg.failedToLoadProduct'),
              variant: "default"
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(t('common.productDetailMsg.failedToLoadProduct'));
        showToast({
          title: t('common.error'), 
          description: t('common.productDetailMsg.failedToLoadProduct'),
          variant: "default"
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, farmerProducts, currentFarmerProduct, setCurrentFarmerProduct, fetchFarmerProducts, showToast]);

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
        description: t('common.productDetailMsg.linkCopied'),
        variant: 'default',
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to edit page
    router.push(`/farmer/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('common.productDetailMsg.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/products/farmer/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          description: t('common.productDetailMsg.deleteSuccess'),
          variant: 'default',
        });
        router.push('/farmer/products');
      } else {
        const data = await response.json();
        showToast({
          description: data.message || t('common.productDetailMsg.deleteFailed'),
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({
        description: t('common.productDetailMsg.deleteFailed'),
        variant: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem="My Products" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.productDetailMsg.loadingProduct')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !currentFarmerProduct) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.FARMER} activeItem="My Products" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">{t('common.productDetailMsg.productNotFoundTitle')}</h1>
            <p className="text-muted-foreground mb-4">{error || t('common.productDetailMsg.productNotFoundDesc')}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('common.productDetailMsg.goBack')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.FARMER} activeItem="My Products" />
      
      <main className="flex-1 overflow-auto">
        <ProductDetail
          product={currentFarmerProduct}
          productType="farmer"
          onShareProduct={handleShareProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          showActions={true}
        />
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FarmerProduct, SupplierProduct } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import ProductDetail from '@/components/products/ProductDetail';
import { useToast } from '@/components/ui/use-toast';

export default function BuyerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { fetchProductById, loading, showOrderModal } = useProduct();
  const [product, setProduct] = useState<FarmerProduct | SupplierProduct | null>(null);
  const [productType, setProductType] = useState<'farmer' | 'supplier'>('farmer');
  const [error, setError] = useState<string | null>(null);
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        const result = await fetchProductById(params.id as string);
        if (result.product && result.type) {
          setProduct(result.product);
          setProductType(result.type);
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      }
    };

    fetchProduct();
  }, [params.id]);

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
        description: 'Product removed from favorites',
        variant: 'default',
      });
    } else {
      newSaved.add(productId);
      showToast({
        description: 'Product added to favorites',
        variant: 'default',
      });
    }
    setSavedProducts(newSaved);
    localStorage.setItem('savedProducts', JSON.stringify([...newSaved]));
  };

  const handleShareProduct = (product: FarmerProduct | SupplierProduct) => {
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
        description: 'Product link copied to clipboard',
        variant: 'default',
      });
    }
  };

  const handlePurchaseProduct = (product: FarmerProduct | SupplierProduct) => {
    showOrderModal(product, productType);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.BUYER} activeItem="Marketplace" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.BUYER} activeItem="Marketplace" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'This product could not be found.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-success text-primary-foreground rounded-lg hover:bg-success/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userType={UserType.BUYER} activeItem="Marketplace" />
      
      <main className="flex-1 overflow-auto">
        <ProductDetail
          product={product}
          productType={productType}
          onSaveProduct={handleSaveProduct}
          onShareProduct={handleShareProduct}
          onPurchaseProduct={handlePurchaseProduct}
          isSaved={savedProducts.has(product.id)}
          showActions={true}
        />
      </main>
    </div>
  );
}

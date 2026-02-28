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

export default function SupplierProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { fetchSupplierProductById, loading } = useProduct();
  const [product, setProduct] = useState<SupplierProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        const result = await fetchSupplierProductById(params.id as string);
        if (result.product) {
          setProduct(result.product);
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      }
    };

    fetchProduct();
  }, [params.id, fetchSupplierProductById]);

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

  const handleEditProduct = (product: FarmerProduct | SupplierProduct) => {
    // Navigate to edit page
    router.push(`/supplier/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/supplier/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          description: 'Product deleted successfully',
          variant: 'default',
        });
        router.push('/supplier/products');
      } else {
        const data = await response.json();
        showToast({
          description: data.message || 'Failed to delete product',
          variant: 'error',
        });
      }
    } catch (err) {
      showToast({
        description: 'Failed to delete product',
        variant: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.SUPPLIER} activeItem="My Products" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.SUPPLIER} activeItem="My Products" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'This product could not be found.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.SUPPLIER} activeItem="My Products" />
      
      <main className="flex-1 overflow-auto">
        <ProductDetail
          product={product}
          productType="supplier"
          onShareProduct={handleShareProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          showActions={true}
        />
      </main>
    </div>
  );
}

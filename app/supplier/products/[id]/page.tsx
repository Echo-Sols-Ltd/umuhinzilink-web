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
  const { 
    supplierProducts, 
    currentSupplierProduct, 
    setCurrentSupplierProduct,
    fetchSupplierProducts,
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
        let foundProduct = supplierProducts?.find(p => p.id === productId);
        
        // Step 2: Check if it's the current context product
        if (!foundProduct && currentSupplierProduct?.id === productId) {
          foundProduct = currentSupplierProduct;
        }
        
        if (foundProduct) {
          // ✅ Found in context - use immediately
          setCurrentSupplierProduct(foundProduct);
          setLoading(false);
        } else {
          // ❌ Not in context - fetch from server
          const { productService } = await import('@/services/products');
          const response = await productService.getSupplierProduct(productId);
          
          if (response.success && response.data) {
            // Store in context for future use and real-time updates
            setCurrentSupplierProduct(response.data);
            
            // Refresh the list to include this product for future navigation
            fetchSupplierProducts();
          } else {
            setError('Product not found');
            showToast({
              title: "Error",
              description: "Failed to load product details",
              variant: "default"
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
        showToast({
          title: "Error", 
          description: "Failed to load product details",
          variant: "default"
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, supplierProducts, currentSupplierProduct, setCurrentSupplierProduct, fetchSupplierProducts, showToast]);

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

  if (error || !currentSupplierProduct) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserType.SUPPLIER} activeItem="My Inputs" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'This product could not be found.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
      <Sidebar userType={UserType.SUPPLIER} activeItem="My Inputs" />
      
      <main className="flex-1 overflow-auto">
        <ProductDetail
          product={currentSupplierProduct}
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

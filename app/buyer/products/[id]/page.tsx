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
  const { 
    farmerProducts,
    supplierProducts,
    buyerProducts,
    currentFarmerProduct,
    currentSupplierProduct,
    currentBuyerProduct,
    setCurrentFarmerProduct,
    setCurrentSupplierProduct,
    setCurrentBuyerProduct,
    fetchFarmerProducts,
    fetchSupplierProducts,
    fetchBuyerProducts,
    loading: contextLoading,
    showOrderModal
  } = useProduct();
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
        // Step 1: Check all product types in context
        let foundProduct = null;
        let foundType = null;

        // Check farmer products
        foundProduct = farmerProducts?.find(p => p.id === productId);
        if (foundProduct) {
          foundType = 'farmer';
          setCurrentFarmerProduct(foundProduct);
        }

        // Check supplier products
        if (!foundProduct) {
          foundProduct = supplierProducts?.find(p => p.id === productId);
          if (foundProduct) {
            foundType = 'supplier';
            setCurrentSupplierProduct(foundProduct);
          }
        }

        // Check buyer products
        if (!foundProduct) {
          foundProduct = buyerProducts?.find(p => p.id === productId);
          if (foundProduct) {
            foundType = 'farmer'; // Buyer products are FarmerProduct type
            setCurrentBuyerProduct(foundProduct);
          }
        }

        // Check current context products
        if (!foundProduct) {
          if (currentFarmerProduct?.id === productId) {
            foundProduct = currentFarmerProduct;
            foundType = 'farmer';
          } else if (currentSupplierProduct?.id === productId) {
            foundProduct = currentSupplierProduct;
            foundType = 'supplier';
          } else if (currentBuyerProduct?.id === productId) {
            foundProduct = currentBuyerProduct;
            foundType = 'farmer';
          }
        }

        if (foundProduct) {
          // ✅ Found in context - use immediately
          setProductType(foundType as 'farmer' | 'supplier');
          setLoading(false);
        } else {
          // ❌ Not in context - fetch from server
          const { productService } = await import('@/services/products');
          
          try {
            const response = await productService.getFarmerProduct(productId);
            if (response.success && response.data) {
              setCurrentFarmerProduct(response.data);
              setProductType('farmer');
              fetchFarmerProducts();
            }
          } catch (e) {
            try {
              const response = await productService.getSupplierProduct(productId);
              if (response.success && response.data) {
                setCurrentSupplierProduct(response.data);
                setProductType('supplier');
                fetchSupplierProducts();
              }
            } catch (e2) {
              throw new Error('Product not found');
            }
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
  }, [productId, farmerProducts, supplierProducts, buyerProducts, currentFarmerProduct, currentSupplierProduct, currentBuyerProduct, setCurrentFarmerProduct, setCurrentSupplierProduct, setCurrentBuyerProduct, fetchFarmerProducts, fetchSupplierProducts, fetchBuyerProducts, showToast]);

  // Get current product based on type
  const getCurrentProduct = () => {
    switch (productType) {
      case 'farmer':
        return currentFarmerProduct || currentBuyerProduct;
      case 'supplier':
        return currentSupplierProduct;
      default:
        return null;
    }
  };

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

  const currentProduct = getCurrentProduct();

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

  if (error || !currentProduct) {
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
    <div className="flex h-screen bg-background">
      <Sidebar userType={UserType.BUYER} activeItem="Marketplace" />
      
      <main className="flex-1 overflow-auto">
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

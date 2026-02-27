'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FarmerProduct, SupplierProduct, ProductStatus } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import ProductDetail from '@/components/products/ProductDetail';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { fetchProductById, loading } = useProduct();
  const [product, setProduct] = useState<FarmerProduct | SupplierProduct | null>(null);
  const [productType, setProductType] = useState<'farmer' | 'supplier'>('farmer');
  const [error, setError] = useState<string | null>(null);

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
  }, [params.id, fetchProductById]);

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

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const endpoint = productType === 'farmer' 
        ? `/api/admin/products/farmer/${product.id}`
        : `/api/admin/products/supplier/${product.id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          description: 'Product deleted successfully',
          variant: 'default',
        });
        router.push(`/admin/products/${productType}`);
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
      <div className="flex h-screen bg-white">
        <Sidebar userType={UserType.ADMIN} activeItem="Product Management" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar userType={UserType.ADMIN} activeItem="Product Management" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'This product could not be found.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (product.productStatus) {
      case ProductStatus.IN_STOCK:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        );
      case ProductStatus.LOW_STOCK:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock
          </Badge>
        );
      case ProductStatus.OUT_OF_STOCK:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Out of Stock
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Eye className="w-3 h-3 mr-1" />
            {product.productStatus}
          </Badge>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userType={UserType.ADMIN} activeItem="Product Management" />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Admin Actions</span>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <Badge variant="outline">{productType === 'farmer' ? 'Farmer Product' : 'Supplier Product'}</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Manage this product's approval status and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                {/* Admin actions for product management */}
                <Button onClick={handleDeleteProduct} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Delete Product
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product ID:</span>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Owner ID:</span>
                  <p className="font-medium">{product.owner.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">{new Date((product as any).createdAt || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">{new Date((product as any).updatedAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <ProductDetail
            product={product}
            productType={productType}
            onShareProduct={handleShareProduct}
            showActions={false} // Admin doesn't need purchase/edit actions
          />
        </div>
      </main>
    </div>
  );
}

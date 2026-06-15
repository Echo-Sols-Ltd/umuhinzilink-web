'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, ProductStatus } from '@/types';
import Sidebar from '@/components/shared/Sidebar';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { UserRole } from '@/types';
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
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        const result = await fetchProductById(params.id as string);
        if (result) {
          setProduct(result);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      }
    };

    fetchProduct();
  }, [params.id]);

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
      showToast({
        description: 'Product deleted successfully',
        variant: 'default',
      });
      router.push('/admin/products');
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
        <Sidebar userType={UserRole.ADMIN} activeItem="Product Management" />
        <main className="flex-1 flex items-center justify-center">
          <PageLoading
            variant="section"
            label="Loading product"
            description="Fetching listing details…"
            className="bg-transparent dark:bg-transparent"
          />
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userType={UserRole.ADMIN} activeItem="Product Management" />
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

  const getStatusBadge = () => {
    switch (product.status) {
      case ProductStatus.IN_STOCK:
        return (
          <Badge variant="default" className="bg-success/10 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        );
      case ProductStatus.LOW_STOCK:
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
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
            {product.status}
          </Badge>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserRole.ADMIN} activeItem="Product Management" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminPageHeader
          title={product.name}
          description={`Product • ${product.category}`}
          backHref="/admin/products"
          backLabel="Back to Products"
          actions={
            <Button onClick={handleDeleteProduct} variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              Delete Product
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Admin Actions</span>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <Badge variant="outline">Product</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Manage this product's approval status and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Product ID:</span>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner ID:</span>
                  <p className="font-medium">{product.owner.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">{new Date((product as any).createdAt || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <p className="font-medium">{new Date((product as any).updatedAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <ProductDetail
            product={product}
            onShareProduct={handleShareProduct}
            showActions={false} // Admin doesn't need purchase/edit actions
          />
          </div>
        </main>
      </div>
    </div>
  );
}

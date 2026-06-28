'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, ProductStatus } from '@/types';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import PageLoading from '@/components/layout/PageLoading';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useI18n } from '@/contexts/I18nContext';
import ProductDetail from '@/components/products/ProductDetail';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, XCircle, Eye } from '@/lib/icons';

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast: showToast } = useToast();
  const { fetchProductById } = useProduct();
  const { t } = useI18n();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      setPageLoading(true);
      try {
        const result = await fetchProductById(params.id as string);
        if (result) {
          setProduct(result);
        } else {
          setError(t('admin.productsDetail.notFoundDesc'));
        }
      } catch {
        setError(t('admin.productsDetail.notFoundDesc'));
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, fetchProductById]);

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
        description: t('admin.productsDetail.toasts.linkCopied'),
        variant: 'default',
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    if (!confirm(t('admin.productsDetail.confirmDelete'))) {
      return;
    }

    try {
      showToast({
        description: t('admin.productsDetail.toasts.deleteSuccess'),
        variant: 'default',
      });
      router.push('/admin/products');
    } catch (err) {
      showToast({
        description: t('admin.productsDetail.toasts.deleteFailed'),
        variant: 'error',
      });
    }
  };

  if (pageLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <PageLoading
          variant="section"
          label="Loading product"
          description="Fetching listing details…"
          className="bg-transparent dark:bg-transparent"
        />
      </main>
    );
  }

  if (error || !product) {
    return (
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
    );
  }

  const getStatusBadge = () => {
    switch (product.status) {
      case ProductStatus.IN_STOCK:
        return (
          <Badge variant="default" className="bg-success/10 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('productCard.inStock')}
          </Badge>
        );
      case ProductStatus.LOW_STOCK:
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t('productCard.lowStock')}
          </Badge>
        );
      case ProductStatus.OUT_OF_STOCK:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            {t('productCard.outOfStock')}
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
    <>
      <AdminPageHeader
          title={product.name}
          description={`Product • ${product.category}`}
          backHref="/admin/products"
          backLabel={t('admin.productsDetail.backToProducts')}
          actions={
            <Button onClick={handleDeleteProduct} variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              {t('admin.productsDetail.deleteProduct')}
            </Button>
          }
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('admin.productsDetail.adminActions')}</span>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <Badge variant="outline">{t('admin.productsDetail.productLabel')}</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                {t('admin.productsDetail.adminActionsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('admin.productsDetail.productId')}</span>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('admin.productsDetail.ownerId')}</span>
                  <p className="font-medium">{product.owner.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('admin.productsDetail.created')}</span>
                  <p className="font-medium">{new Date((product as any).createdAt || '').toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('admin.productsDetail.lastUpdated')}</span>
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
    </>
  );
}


import { useState, useEffect } from 'react';
import { Product, ProductRequest } from '@/types';
import { productService } from '@/services/products';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';
import { useRouter } from 'next/navigation';

export function useProductAction() {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addMyProduct, updateProductState, removeMyProduct } = useProduct()

  const router = useRouter()


  const createProduct = async (payload: ProductRequest, image: File) => {
    try {
      setLoading(true);
      const imgRes = await productService.uploadProductPhoto(image);
      if (!imgRes?.data) return;
      payload.image = imgRes.data;
      const res = await productService.createProduct(payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Create product');
        return;
      }
      addMyProduct(res.data);
      router.push('/');
      notify.success('Product created successfully', 'Product created');
    } catch {
      notify.error('Try again later', 'Failed to Create product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, payload: ProductRequest, image?: File) => {
    try {
      setLoading(true);
      if (image) {
        const imgRes = await productService.uploadProductPhoto(image);
        if (!imgRes?.data) return;
        payload.image = imgRes.data;
      }
      const res = await productService.updateProduct(id, payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Edit product');
        return;
      }
      updateProductState(res.data.id, res.data);
      notify.success('The product was updated successfully', 'Product edited');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to Edit product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const res = await productService.deleteProduct(id);
      if (!res?.success) {
        notify.error('Try again later', 'Failed to delete product');
        return;
      }
      removeMyProduct(id);
      notify.success('Product was deleted', 'Product Deleted Successfully');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };
  return {
    createProduct,
    loading,
    error,
    updateProduct,
    deleteProduct
  };
}

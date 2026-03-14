import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/products';
import { useAuth } from '@/contexts/AuthContext';
import { ProductRef, UserType } from '@/types';

export function useProductById(productRef: ProductRef | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!productRef) {
      setProduct(null);
      setError(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use different endpoint based on user role
        const response = await productService.getProductById(productRef.productId);
        if (response.success && response.data) {
          setProduct(response.data);
          return;
        }

        setError('Product not found');
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productRef, user?.role]);

  return { product, loading, error };
}

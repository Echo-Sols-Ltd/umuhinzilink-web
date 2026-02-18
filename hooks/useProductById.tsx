import { useState, useEffect } from 'react';
import { FarmerProduct, SupplierProduct } from '@/types/product';
import { productService } from '@/services/products';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';

export function useProductById(productId: string | null) {
  const [product, setProduct] = useState<FarmerProduct | SupplierProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setError(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use different endpoint based on user role
        if (user?.role === UserType.FARMER) {
          // Farmer uses farmer-specific endpoint
          const farmerResponse = await productService.getFarmerProduct(productId);
          if (farmerResponse.success && farmerResponse.data) {
            setProduct(farmerResponse.data);
            return;
          }
        } else if (user?.role === UserType.SUPPLIER) {
          // Supplier uses supplier-specific endpoint
          const supplierResponse = await productService.getSupplierProduct(productId);
          if (supplierResponse.success && supplierResponse.data) {
            setProduct(supplierResponse.data);
            return;
          }
        } else {
          // Buyer or other roles - try both endpoints
          const farmerResponse = await productService.getFarmerProduct(productId);
          if (farmerResponse.success && farmerResponse.data) {
            setProduct(farmerResponse.data);
            return;
          }

          const supplierResponse = await productService.getSupplierProduct(productId);
          if (supplierResponse.success && supplierResponse.data) {
            setProduct(supplierResponse.data);
            return;
          }
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
  }, [productId, user?.role]);

  return { product, loading, error };
}

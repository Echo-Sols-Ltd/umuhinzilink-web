import { useState } from 'react';
import { productService } from '@/services/products';
import { orderService } from '@/services/orders';
import { dashboardService } from '@/services/dashboardService';
import { Product, Order, ProductRequest } from '@/types';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';

export const useSellerAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMyProduct: addSupplierProduct, updateProductState: updateSupplierProduct, removeMyProduct: removeSupplierProduct } = useProduct();
  const { updateOrder } = useOrder();

  // Product Management Actions (sync with ProductContext)
  const createProduct = async (productData: ProductRequest): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      if (response.success && response.data) {
        addSupplierProduct(response.data);
        notify.success('Product created successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMyProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getSellerProducts();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(params?.page, params?.size);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (params: {
    name?: string;
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    page?: number;
    size?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.searchProducts(params);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to search products');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<ProductRequest>): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData as any);
      if (response.success && response.data) {
        updateSupplierProduct(response.data.id, response.data);
        notify.success('Product updated successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        removeSupplierProduct(id);
        notify.success('Product deleted successfully', 'Success');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Order Management Actions
  const getMyOrders = async (): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getSellerOrders();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (_id: string): Promise<Order | null> => {
    notify.error('Orders are paid automatically when the buyer checks out. No manual approval is needed.', 'Not available');
    return null;
  };

  const rejectOrder = async (id: string): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.cancelOrder(id);
      if (response.success && response.data) {
        updateOrder(response.data);
        notify.success('Order cancelled successfully', 'Order cancelled');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reject order');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (_id: string, _status: string): Promise<Order | null> => {
    notify.error('Order status is managed automatically after payment.', 'Not available');
    return null;
  };

  // Dashboard Actions
  const getDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getSellerDashboard();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProductStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getSellerStats();
      if (response.success) {
        return response.data ?? {};
      } else {
        throw new Error(response.message || 'Failed to fetch product stats');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product stats';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return {};
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Product actions
    createProduct,
    getMyProducts,
    getAllProducts,
    searchProducts,
    updateProduct,
    deleteProduct,
    // Order actions
    getMyOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    // Dashboard actions
    getDashboardStats,
    getProductStats,
  };
};
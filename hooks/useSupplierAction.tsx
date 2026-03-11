import { useState } from 'react';
import { supplierService, SupplierProductRequest } from '@/services/suppliers';
import { Product, Order } from '@/types';
import { notify } from '@/lib/notify';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';

export const useSupplierAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addSupplierProduct, updateSupplierProduct, removeSupplierProduct } = useProduct();
  const { editSupplierOrder } = useOrder();

  // Product Management Actions (sync with ProductContext)
  const createProduct = async (productData: SupplierProductRequest): Promise<SupplierProduct | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.createProduct(productData);
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

  const getMyProducts = async (): Promise<SupplierProduct[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getMyProducts();
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
      const response = await supplierService.getAllProducts(params);
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
      const response = await supplierService.searchProducts(params);
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

  const updateProduct = async (id: string, productData: Partial<SupplierProductRequest>): Promise<SupplierProduct | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.updateProduct(id, productData);
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
      const response = await supplierService.deleteProduct(id);
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
  const getMyOrders = async (): Promise<SupplierOrder[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getMyOrders();
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

  const acceptOrder = async (id: string): Promise<SupplierOrder | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.acceptOrder(id);
      if (response.success && response.data) {
        editSupplierOrder(response.data);
        notify.success('Order accepted successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to accept order');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (id: string): Promise<SupplierOrder | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.rejectOrder(id);
      if (response.success && response.data) {
        editSupplierOrder(response.data);
        notify.success('Order rejected successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reject order');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject order';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string): Promise<SupplierOrder | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.updateOrderStatus(id, status);
      if (response.success && response.data) {
        editSupplierOrder(response.data);
        notify.success('Order status updated successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Actions
  const getDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getDashboardStats();
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
      const response = await supplierService.getProductStats();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch product stats');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product stats';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return [];
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
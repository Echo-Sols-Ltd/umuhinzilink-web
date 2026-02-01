import { FarmerOrder, FarmerProduct, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export const adminService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>(API_ENDPOINTS.ADMIN.USERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.ADMIN.USERS_BY_ID(userId));
      return response.data!;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Suspend/Activate user
  toggleUserStatus: async (userId: string, suspend: boolean) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.USERS_BY_ID(userId)}/status`, {
        suspended: suspend
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId: string, role: string) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.USERS_BY_ID(userId)}/role`, {
        role
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async (): Promise<FarmerProduct[]> => {
    try {
      const response = await apiClient.get<FarmerProduct[]>(API_ENDPOINTS.ADMIN.PRODUCTS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Approve/Reject product
  moderateProduct: async (productId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.PRODUCTS_BY_ID(productId)}/moderate`, {
        action,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error moderating product:', error);
      throw error;
    }
  },

  // Get all orders
  getAllOrders: async (): Promise<FarmerOrder[]> => {
    try {
      const response = await apiClient.get<FarmerOrder[]>(API_ENDPOINTS.ADMIN.ORDERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Resolve order dispute
  resolveDispute: async (orderId: string, resolution: string, refundAmount?: number) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ADMIN.ORDERS_BY_ID(orderId)}/dispute`, {
        resolution,
        refundAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN.USERS_BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCTS_BY_ID(productId));
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId: string) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN.ORDERS_BY_ID(orderId));
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get system analytics
  getSystemAnalytics: async () => {
    try {
      const response = await apiClient.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Get transaction monitoring data
  getTransactionMonitoring: async () => {
    try {
      const response = await apiClient.get('/admin/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Update system configuration
  updateSystemConfig: async (config: Record<string, any>) => {
    try {
      const response = await apiClient.put('/admin/config', config);
      return response.data;
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  },

  // Get all supplier products
  getAllSupplierProducts: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(API_ENDPOINTS.PRODUCT.SUPPLIER_ALL);
      return response.data!;
    } catch (error) {
      console.error('Error fetching supplier products:', error);
      throw error;
    }
  },

  // Get all supplier orders
  getAllSupplierOrders: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(API_ENDPOINTS.ORDER.SUPPLIER_ALL);
      return response.data!;
    } catch (error) {
      console.error('Error fetching supplier orders:', error);
      throw error;
    }
  },
};

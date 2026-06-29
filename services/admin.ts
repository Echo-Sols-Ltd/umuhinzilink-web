import { ApiResponse, PaginatedResponse, Order, Product, User, Wallet, Transaction } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export const adminService = {
  // Get all users
  getAllUsers: async (page: number, size: number): Promise<PaginatedResponse<User[]>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<User[]>>(`${API_ENDPOINTS.ADMIN.USERS}?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },



  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.ADMIN.USERS_BY_ID(userId));
      return response.data!;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Suspend/Activate user
  toggleUserStatus: async (userId: string, suspend: boolean) => {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`${API_ENDPOINTS.ADMIN.USERS_BY_ID(userId)}/status`, {
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
      const response = await apiClient.put<ApiResponse<User>>(`${API_ENDPOINTS.ADMIN.USERS_BY_ID(userId)}/role`, {
        role
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get all farmer products (paginated)
  getAllProducts: async (page = 0, size = 10): Promise<PaginatedResponse<Product[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Product[]>>(
        `${API_ENDPOINTS.ADMIN.PRODUCTS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Approve/Reject product
  moderateProduct: async (productId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`${API_ENDPOINTS.ADMIN.PRODUCTS_BY_ID(productId)}/moderate`, {
        action,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error moderating product:', error);
      throw error;
    }
  },

  // Get all farmer orders (paginated)
  getAllOrders: async (page = 0, size = 10): Promise<PaginatedResponse<Order[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Order[]>>(
        `${API_ENDPOINTS.ADMIN.ORDERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Resolve order dispute
  resolveDispute: async (orderId: string, resolution: string, refundAmount?: number) => {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`${API_ENDPOINTS.ADMIN.ORDERS_BY_ID(orderId)}/dispute`, {
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
      const response = await apiClient.delete<ApiResponse<User>>(API_ENDPOINTS.ADMIN.USERS_BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<Product>>(API_ENDPOINTS.ADMIN.PRODUCTS_BY_ID(productId));
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<Order>>(API_ENDPOINTS.ADMIN.ORDERS_BY_ID(orderId));
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get system analytics
  getSystemAnalytics: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    try {
      return await apiClient.get<ApiResponse<Record<string, unknown>>>(API_ENDPOINTS.ADMIN.ANALYTICS);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Get transaction monitoring data (paginated)
  getTransactionMonitoring: async (page = 0, size = 20): Promise<PaginatedResponse<Transaction[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Transaction[]>>(
        `${API_ENDPOINTS.WALLET.ADMIN_ALL_TRANSACTIONS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Update system configuration
  updateSystemConfig: async (config: Record<string, any>) => {
    try {
      const response = await apiClient.put<ApiResponse<any>>(API_ENDPOINTS.ADMIN.CONFIG, config);
      return response.data;
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  },




  getBuyerById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.ADMIN.BUYERS_BY_ID(userId));
    return response.data!;
  },

  getSellerById: async (userId: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.ADMIN.SELLERS_BY_ID(userId));
    return response.data!;
  },

  getSystemWallet: async (): Promise<Wallet> => {
    try {
      const response = await apiClient.get<ApiResponse<Wallet>>(API_ENDPOINTS.WALLET.SYSTEM_WALLET);
      return response.data!;
    } catch (error) {
      console.error('Error fetching system wallet:', error);
      throw error;
    }
  },
};

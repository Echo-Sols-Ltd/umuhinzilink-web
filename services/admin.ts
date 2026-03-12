import { ApiResponse, PaginatedResponse, Order, Product, User, WalletDTO, WalletTransactionDTO } from '@/types';
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
  getAllFarmerProducts: async (page = 0, size = 10): Promise<PaginatedResponse<Product[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Product[]>>(
        `${API_ENDPOINTS.ADMIN.FARMER_PRODUCTS}?page=${page}&size=${size}`
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
  getAllFarmerOrders: async (page = 0, size = 10): Promise<PaginatedResponse<Order[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Order[]>>(
        `${API_ENDPOINTS.ADMIN.FARMER_ORDERS}?page=${page}&size=${size}`
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
  getSystemAnalytics: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Get transaction monitoring data (paginated)
  getTransactionMonitoring: async (page = 0, size = 20): Promise<PaginatedResponse<WalletTransactionDTO[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<WalletTransactionDTO[]>>(
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
      const response = await apiClient.put<ApiResponse<any>>('/admin/config', config);
      return response.data;
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  },

  // Get all supplier products (paginated)
  getAllSupplierProducts: async (page = 0, size = 10): Promise<PaginatedResponse<Product[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Product[]>>(
        `${API_ENDPOINTS.ADMIN.SUPPLIER_PRODUCTS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching supplier products:', error);
      throw error;
    }
  },

  // Get all supplier orders (paginated)
  getAllSupplierOrders: async (page = 0, size = 10): Promise<PaginatedResponse<Order[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<Order[]>>(
        `${API_ENDPOINTS.ADMIN.SUPPLIER_ORDERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching supplier orders:', error);
      throw error;
    }
  },


  getSystemWallet: async (): Promise<WalletDTO> => {
    try {
      const response = await apiClient.get<ApiResponse<WalletDTO>>(API_ENDPOINTS.WALLET.SYSTEM_WALLET);
      return response.data!;
    } catch (error) {
      console.error('Error fetching system wallet:', error);
      throw error;
    }
  },
};

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
};

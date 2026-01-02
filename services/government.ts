import { FarmerOrder, FarmerProduct, SupplierProduct, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export const governmentService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>(API_ENDPOINTS.GOVERNMENT.USERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get all products
  getAllSuppliersProducts: async (): Promise<SupplierProduct[]> => {
    try {
      const response = await apiClient.get<SupplierProduct[]>(API_ENDPOINTS.GOVERNMENT.PRODUCTS_SUPPLIERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllFarmersProducts: async (): Promise<FarmerProduct[]> => {
    try {
      const response = await apiClient.get<FarmerProduct[]>(API_ENDPOINTS.GOVERNMENT.PRODUCTS_FARMERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get all orders
  getAllFarmersOrders: async (): Promise<FarmerOrder[]> => {
    try {
      const response = await apiClient.get<FarmerOrder[]>(API_ENDPOINTS.GOVERNMENT.ORDERS_FARMERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getAllSuppliersOrders: async (): Promise<FarmerOrder[]> => {
    try {
      const response = await apiClient.get<FarmerOrder[]>(API_ENDPOINTS.GOVERNMENT.ORDERS_SUPPLIERS);
      return response.data!;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};

import { Product, PaginatedResponse, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export const governmentService = {
  getAllUsers: async (page = 0, size = 10): Promise<PaginatedResponse<User[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<User[]>>(
        `${API_ENDPOINTS.GOVERNMENT.USERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getAllSuppliersProducts: async (page = 0, size = 10): Promise<PaginatedResponse<SupplierProduct[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(
        `${API_ENDPOINTS.GOVERNMENT.PRODUCTS_SUPPLIERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllFarmersProducts: async (page = 0, size = 10): Promise<PaginatedResponse<FarmerProduct[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(
        `${API_ENDPOINTS.GOVERNMENT.PRODUCTS_FARMERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllFarmersOrders: async (page = 0, size = 10): Promise<PaginatedResponse<FarmerOrder[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerOrder[]>>(
        `${API_ENDPOINTS.GOVERNMENT.ORDERS_FARMERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getAllSuppliersOrders: async (page = 0, size = 10): Promise<PaginatedResponse<FarmerOrder[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerOrder[]>>(
        `${API_ENDPOINTS.GOVERNMENT.ORDERS_SUPPLIERS}?page=${page}&size=${size}`
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};

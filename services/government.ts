import { FarmerOrder, FarmerProduct, PaginatedResponse, SupplierProduct, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export const governmentService = {
  // Get all users
  getAllUsers: async (): Promise<PaginatedResponse<User[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<User[]>>(API_ENDPOINTS.GOVERNMENT.USERS);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get all products
  getAllSuppliersProducts: async (): Promise<PaginatedResponse<SupplierProduct[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(API_ENDPOINTS.GOVERNMENT.PRODUCTS_SUPPLIERS);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getAllFarmersProducts: async (): Promise<PaginatedResponse<FarmerProduct[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(API_ENDPOINTS.GOVERNMENT.PRODUCTS_FARMERS);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get all orders
  getAllFarmersOrders: async (): Promise<PaginatedResponse<FarmerOrder[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerOrder[]>>(API_ENDPOINTS.GOVERNMENT.ORDERS_FARMERS);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getAllSuppliersOrders: async (): Promise<PaginatedResponse<FarmerOrder[]>> => {
    try {
      return await apiClient.get<PaginatedResponse<FarmerOrder[]>>(API_ENDPOINTS.GOVERNMENT.ORDERS_SUPPLIERS);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};

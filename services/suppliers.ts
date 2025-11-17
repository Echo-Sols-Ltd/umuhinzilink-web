import { ApiResponse, Supplier } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export class SupplierService {
  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<Supplier>(API_ENDPOINTS.SUPPLIER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<Supplier>(API_ENDPOINTS.SUPPLIER.ME);
  }
}

export const supplierService = new SupplierService();

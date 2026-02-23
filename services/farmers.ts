import { ApiResponse, Farmer } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export class FarmerService {
  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<Farmer>> {
    return await apiClient.get<ApiResponse<Farmer>>(API_ENDPOINTS.FARMER.BY_ID(id));
  }

  async getFarmerById(id: string): Promise<ApiResponse<Farmer>> {
    return await apiClient.get<ApiResponse<Farmer>>(API_ENDPOINTS.FARMER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Farmer>> {
    return await apiClient.get<ApiResponse<Farmer>>(API_ENDPOINTS.FARMER.ME);
  }

  async updateFarmer(id: string, data: Partial<Farmer>): Promise<ApiResponse<Farmer>> {
    return await apiClient.put<ApiResponse<Farmer>>(API_ENDPOINTS.FARMER.BY_ID(id), data);
  }
}

export const farmerService = new FarmerService();

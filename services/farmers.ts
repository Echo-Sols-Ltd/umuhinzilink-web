import { ApiResponse, Farmer } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export class FarmerService {
  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<Farmer>> {
    return await apiClient.get<Farmer>(API_ENDPOINTS.FARMER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Farmer>> {
    return await apiClient.get<Farmer>(API_ENDPOINTS.FARMER.ME);
  }
}

export const farmerService = new FarmerService();

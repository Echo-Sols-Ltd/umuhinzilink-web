import { ApiResponse, Buyer } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export class BuyerService {
  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<Buyer>> {
    return await apiClient.get<ApiResponse<Buyer>>(API_ENDPOINTS.BUYER.BY_ID(id));
  }

  async getBuyerById(id: string): Promise<ApiResponse<Buyer>> {
    return await apiClient.get<ApiResponse<Buyer>>(API_ENDPOINTS.BUYER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Buyer>> {
    return await apiClient.get<ApiResponse<Buyer>>(API_ENDPOINTS.BUYER.ME);
  }

  async saveProduct(id: string): Promise<ApiResponse<Buyer>> {
    return await apiClient.post<ApiResponse<Buyer>>(API_ENDPOINTS.BUYER.SAVE_PRODUCT(id));
  }

  async updateBuyer(id: string, data: Partial<Buyer>): Promise<ApiResponse<Buyer>> {
    return await apiClient.put<ApiResponse<Buyer>>(API_ENDPOINTS.BUYER.BY_ID(id), data);
  }
}

export const buyerService = new BuyerService();

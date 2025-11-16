import { ApiResponse, Buyer} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export class BuyerService {

  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<Buyer>> {
    return await apiClient.get<Buyer>(API_ENDPOINTS.BUYER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Buyer>> {
    return await apiClient.get<Buyer>(API_ENDPOINTS.BUYER.ME);
  }

  async saveProduct(id: string): Promise<ApiResponse<Buyer>> {
    return await apiClient.post<Buyer>(API_ENDPOINTS.BUYER.SAVE_PRODUCT(id));
  }

}

export const buyerService = new BuyerService();

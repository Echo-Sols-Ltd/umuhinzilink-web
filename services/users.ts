import { ApiResponse, PaginatedResponse, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';
import { AxiosProgressEvent, CancelToken } from 'axios';

class UserService {
  /**
   * Fetch all users (paginated). Each user may now include:
   * - latestMessage: Message | null
   * - online: boolean (if privacy allows)
   */
  async getAllUsers(page = 0, size = 10): Promise<PaginatedResponse<User[]>> {
    return await apiClient.get<PaginatedResponse<User[]>>(
      `${API_ENDPOINTS.USER.ALL}?page=${page}&size=${size}`
    );
  }

  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.BY_ID(id));
  }

  async getFarmerById(id: string): Promise<ApiResponse<any>> {
    return await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.FARMER.BY_ID(id));
  }

  async getSupplierById(id: string): Promise<ApiResponse<any>> {
    return await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.SUPPLIER.BY_ID(id));
  }

  async getFarmerMe(): Promise<ApiResponse<any>> {
    return await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.FARMER.ME);
  }

  async getSupplierMe(): Promise<ApiResponse<any>> {
    return await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.SUPPLIER.ME);
  }

  async uploadAvatar(
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout: number = 60000
  ): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<ApiResponse<string>>(
      API_ENDPOINTS.FILES.UPLOAD_AVATAR,
      file,
      onUploadProgress,
      cancelToken,
      timeout
    );
  }

  async updateProfile(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return await apiClient.put<ApiResponse<User>>(API_ENDPOINTS.USER.BY_ID(id), data);
  }

  async updateFarmerProfile(id: string, data: Partial<any>): Promise<ApiResponse<any>> {
    return await apiClient.put<ApiResponse<any>>(API_ENDPOINTS.FARMER.BY_ID(id), data);
  }

  async updateSupplierProfile(id: string, data: Partial<any>): Promise<ApiResponse<any>> {
    return await apiClient.put<ApiResponse<any>>(API_ENDPOINTS.SUPPLIER.BY_ID(id), data);
  }
}

export const userService = new UserService();

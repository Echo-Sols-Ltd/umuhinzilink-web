import { ApiResponse, User } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';
import { AxiosProgressEvent, CancelToken } from 'axios';

export class UserService {
  /**
   * Fetch all users. Each user may now include:
   * - latestMessage: Message | null
   * - online: boolean (if privacy allows)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USER.ALL);
  }

  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USER.BY_ID(id));
  }

  async uploadAvatar(
    file: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout: number = 60000
  ): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<string>(
      API_ENDPOINTS.FILES.UPLOAD_AVATAR,
      file,
      onUploadProgress,
      cancelToken,
      timeout
    );
  }
}

export const userService = new UserService();

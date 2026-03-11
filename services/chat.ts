import { ApiResponse } from '@/types';
import { ChatUser } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class ChatService {
  // Get all chat users with conversation data
  async getAllChatUsers(): Promise<ApiResponse<ChatUser[]>> {
    return await apiClient.get<ApiResponse<ChatUser[]>>(API_ENDPOINTS.CHAT.ALL);
  }

  // Get specific chat user data
  async getChatUser(userId: string): Promise<ApiResponse<ChatUser>> {
    return await apiClient.get<ApiResponse<ChatUser>>(API_ENDPOINTS.CHAT.BY_USER(userId));
  }
}

export const chatService = new ChatService();

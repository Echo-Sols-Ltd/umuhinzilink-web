import { ApiResponse, Message, PaginatedResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';
import { AxiosProgressEvent, CancelToken } from 'axios';

export interface ChatMessageReply {
  messageId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

export interface ChatMessageEdit {
  messageId: string;
  newContent: string;
}

export class MessageService {
  // Get conversation messages between two users
  async getConversation(senderId: string, receiverId: string): Promise<PaginatedResponse<Message[]>> {
    return await apiClient.get<PaginatedResponse<Message[]>>(API_ENDPOINTS.MESSAGES.CONVERSATION(senderId, receiverId));
  }

  // Get message by ID
  async getMessageById(conversationId: string): Promise<ApiResponse<Message>> {
    return await apiClient.get<ApiResponse<Message>>(API_ENDPOINTS.MESSAGES.BY_ID(conversationId));
  }

  async uploadFile(
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
    timeout: number = 60000
  ): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<ApiResponse<string>>(
      API_ENDPOINTS.FILES.UPLOAD_MESSAGE,
      file,
      onUploadProgress,
      cancelToken,
      timeout
    );
  }
}

export const messageService = new MessageService();
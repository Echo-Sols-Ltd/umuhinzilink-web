import { ApiResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

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
  async getConversation(senderId: string, receiverId: string): Promise<ApiResponse<ChatMessage[]>> {
    return await apiClient.get<ChatMessage[]>(API_ENDPOINTS.MESSAGES.CONVERSATION(senderId, receiverId));
  }

  // Get message by ID
  async getMessageById(conversationId: string): Promise<ApiResponse<ChatMessage>> {
    return await apiClient.get<ChatMessage>(API_ENDPOINTS.MESSAGES.BY_ID(conversationId));
  }
}

export const messageService = new MessageService();
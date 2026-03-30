import { ApiResponse, Negotiation, SetAgreedPriceRequest, PaginatedResponse, Message } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class NegotiationService {
  // Get negotiation details for a specific order
  async getNegotiation(orderId: string): Promise<ApiResponse<Negotiation>> {
    return await apiClient.get<ApiResponse<Negotiation>>(
      `${API_ENDPOINTS.NEGOTIATION.BY_ID(orderId)}`
    );
  }

  // Accept negotiation (seller action)
  async acceptNegotiation(orderId: string): Promise<ApiResponse<Negotiation>> {
    return await apiClient.put<ApiResponse<Negotiation>>(
      `${API_ENDPOINTS.NEGOTIATION.BY_ID(orderId)}/accept`
    );
  }

  // Reject negotiation (seller action)
  async rejectNegotiation(orderId: string, message?: string): Promise<ApiResponse<Negotiation>> {
    return await apiClient.put<ApiResponse<Negotiation>>(
      `${API_ENDPOINTS.ORDER.BY_ID(orderId)}/negotiation/reject`,
      message
    );
  }

  // Make counter offer (seller action)
  async setAgreedPrice(negotiationId: string, request: SetAgreedPriceRequest): Promise<ApiResponse<Negotiation>> {
    return await apiClient.put<ApiResponse<Negotiation>>(
      `${API_ENDPOINTS.NEGOTIATION.SET_AGREED_PRICE(negotiationId)}`,
      request
    );
  }

  // Get all negotiations for authenticated buyer
  async getBuyerNegotiations(page = 0, size = 10): Promise<PaginatedResponse<Negotiation[]>> {
    return await apiClient.get<PaginatedResponse<Negotiation[]>>(
      `${API_ENDPOINTS.NEGOTIATION.BUYER}?page=${page}&size=${size}`
    );
  }

  // Get all negotiations for authenticated seller
  async getSellerNegotiations(page = 0, size = 10): Promise<PaginatedResponse<Negotiation[]>> {
    return await apiClient.get<PaginatedResponse<Negotiation[]>>(
      `${API_ENDPOINTS.NEGOTIATION.SELLER}?page=${page}&size=${size}`
    );
  }

  async getNegotiationMessages(id: string, page = 0, size = 10): Promise<PaginatedResponse<Message[]>> {
    return await apiClient.get<PaginatedResponse<Message[]>>(
      `${API_ENDPOINTS.NEGOTIATION.BY_ID(id)}/messages?page=${page}&size=${size}`)
  }
}


export const negotiationService = new NegotiationService();

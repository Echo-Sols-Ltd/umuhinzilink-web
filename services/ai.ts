import {
  ApiResponse,
  AiChatRequest,
  AiChatResponse,
  AiCropDiseaseResponse,
  AiNegotiationHintRequest,
  AiPriceAdviceRequest,
  AiSmartSearchRequest,
  AiSmartSearchResponse,
  AiStatus,
} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class AiService {
  async getStatus() {
    return apiClient.get<ApiResponse<AiStatus>>(API_ENDPOINTS.AI.STATUS);
  }

  async chat(request: AiChatRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.CHAT, request);
  }

  async farmingTips(request: AiChatRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.FARMING_TIPS, request);
  }

  async priceAdvice(request: AiPriceAdviceRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.PRICE_ADVICE, request);
  }

  async smartSearch(request: AiSmartSearchRequest) {
    return apiClient.post<ApiResponse<AiSmartSearchResponse>>(API_ENDPOINTS.AI.SMART_SEARCH, request);
  }

  async negotiationHint(request: AiNegotiationHintRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.NEGOTIATION_HINT, request);
  }

  async analyzeCropDisease(file: File, cropHint?: string, locale = 'en') {
    const formData = new FormData();
    formData.append('image', file);
    if (cropHint) formData.append('cropHint', cropHint);
    formData.append('locale', locale);
    return apiClient.postMultipart<ApiResponse<AiCropDiseaseResponse>>(
      API_ENDPOINTS.AI.CROP_DISEASE,
      formData,
    );
  }
}

export const aiService = new AiService();

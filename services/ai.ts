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
import { timeoutConfigs } from '@/lib/timeout';

/** Gemini often needs 20–60s; default API timeout is only 10s. */
const AI_TIMEOUT = timeoutConfigs.ai;

class AiService {
  async getStatus() {
    return apiClient.get<ApiResponse<AiStatus>>(API_ENDPOINTS.AI.STATUS);
  }

  async chat(request: AiChatRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.CHAT, request, {
      timeout: AI_TIMEOUT,
    });
  }

  async farmingTips(request: AiChatRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.FARMING_TIPS, request, {
      timeout: AI_TIMEOUT,
    });
  }

  async priceAdvice(request: AiPriceAdviceRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.PRICE_ADVICE, request, {
      timeout: AI_TIMEOUT,
    });
  }

  async smartSearch(request: AiSmartSearchRequest) {
    return apiClient.post<ApiResponse<AiSmartSearchResponse>>(API_ENDPOINTS.AI.SMART_SEARCH, request, {
      timeout: AI_TIMEOUT,
    });
  }

  async negotiationHint(request: AiNegotiationHintRequest) {
    return apiClient.post<ApiResponse<AiChatResponse>>(API_ENDPOINTS.AI.NEGOTIATION_HINT, request, {
      timeout: AI_TIMEOUT,
    });
  }

  async analyzeCropDisease(file: File, cropHint?: string, locale = 'en') {
    const formData = new FormData();
    formData.append('image', file);
    if (cropHint) formData.append('cropHint', cropHint);
    formData.append('locale', locale);
    return apiClient.postMultipart<ApiResponse<AiCropDiseaseResponse>>(
      API_ENDPOINTS.AI.CROP_DISEASE,
      formData,
      AI_TIMEOUT,
    );
  }
}

export const aiService = new AiService();

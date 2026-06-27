import { Product } from './product';

export type AiCapability =
  | 'CHAT'
  | 'CROP_DISEASE'
  | 'PRICE_ADVICE'
  | 'SMART_SEARCH'
  | 'NEGOTIATION_HINT'
  | 'FARMING_TIPS';

export interface AiChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiStatus {
  enabled: boolean;
  configured: boolean;
  provider: string;
  capabilities: AiCapability[];
}

export interface AiChatResponse {
  reply: string;
  capability: string;
  provider: string;
  locale: string;
}

export interface AiCropDiseaseResponse {
  diagnosis: string;
  treatment: string;
  prevention: string;
  confidenceNote: string;
  provider: string;
}

export interface AiSearchFilters {
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AiSmartSearchResponse {
  interpretation: string;
  reply: string;
  products: Product[];
  parsedFilters: AiSearchFilters;
}

export interface AiChatRequest {
  message: string;
  locale?: string;
  history?: AiChatTurn[];
}

export interface AiPriceAdviceRequest {
  cropName: string;
  district?: string;
  quantity?: number;
  measurementUnit?: string;
  locale?: string;
}

export interface AiSmartSearchRequest {
  query: string;
  locale?: string;
}

export interface AiNegotiationHintRequest {
  productId?: string;
  productName?: string;
  listPrice?: number;
  buyerOffer?: number;
  sellerCounter?: number;
  locale?: string;
}

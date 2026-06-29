export interface AiUserContext {
  firstName?: string;
  role?: string;
  language?: string;
  location?: string;
  district?: string;
  province?: string;
  crops?: string[];
  /** Active listing names from DB (buyers) */
  availableProducts?: string[];
  welcomeMessage?: string;
}

export interface AiProductSummary {
  id: string;
  name: string;
  unitPrice: number;
  district?: string;
  measurementUnit?: string;
  image?: string;
}

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
  isError?: boolean;
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
  /** Real marketplace listings when reply comes from the database */
  products?: AiProductSummary[];
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
  products: AiProductSummary[];
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

/** Max chars sent per history turn / message — must match backend AiLimits. */
export const AI_CLIENT_LIMITS = {
  maxMessageChars: 500,
  maxHistoryTurns: 4,
  maxHistoryCharsPerTurn: 300,
} as const;

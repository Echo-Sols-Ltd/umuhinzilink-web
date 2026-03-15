import { Product, PaymentMethod } from ".";

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT'
}

export enum CartItemType {
  NORMAL = 'NORMAL',
  NEGOTIATION = 'NEGOTIATION',
  NEGOTIATION_ACCEPTED = 'NEGOTIATION_ACCEPTED'
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  type: CartItemType;
  proposedPrice?: number;
  negotiationId?: string;
  negotiationExpiresAt?: string;
  totalPrice: number;
  readyForCheckout: boolean;
  expired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  status: CartStatus;
  items: CartItem[];
  totalValue: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
  proposedPrice?: number;
  type?: CartItemType;
  message?: string
}

export interface CartUpdateRequest {
  quantity: number;
  proposedPrice?: number;
}

export interface NegotiationItemRequest {
  cartItemId: string;
  proposedPrice: number;
  message: string;
}

export interface CartNegotiateRequest {
  paymentMethod: PaymentMethod;
  itemIds: string[];
  negotiationItemIds: string[];
  negotiationItems: NegotiationItemRequest[];
}

export interface CartCheckoutRequest {
  paymentMethod: PaymentMethod;
  itemIds: string[];
  negotiationItemIds: string[];
  negotiationItems: NegotiationItemRequest[];
}

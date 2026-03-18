import { Product, PaymentMethod } from ".";

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  ABANDONED = 'ABANDONED'
}

export enum CartItemType {
  NORMAL = 'NORMAL',
  NEGOTIATION_PENDING = 'NEGOTIATION_PENDING',
  NEGOTIATION_ACCEPTED = 'NEGOTIATION_ACCEPTED'
}

export interface CartItem {
  id: string;
  product: Product;
  cart: Cart;
  quantity: number;
  unitPrice: number;
  proposedPrice: number;
  negotiationId: string;
  type: CartItemType;
  negotiationExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  status: CartStatus;
  items: CartItem[];
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
  stockQuantity: number;
}

export interface NegotiationItemRequest {
  cartItemId: string;
  proposedPrice: number;
  message: string;
}

export interface CartCheckoutRequest {
  paymentMethod: PaymentMethod;
  itemIds: string[];
  negotiationItemIds: string[];
  negotiationItems: NegotiationItemRequest[];
}

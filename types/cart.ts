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
  unitPrice?: number;
  proposedPrice?: number;
  type?: CartItemType;
}

export interface CartUpdateRequest {
  quantity: number;
  proposedPrice?: number;
}

export interface CartNegotiateRequest {
  itemIds: string[];
}

export interface CartCheckoutRequest {
  paymentMethod: PaymentMethod;
}

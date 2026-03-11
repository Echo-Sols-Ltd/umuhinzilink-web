import { Product } from ".";

export enum CartStatus {
    ACTIVE,
    CHECKED_OUT,
    ABANDONED
}
export enum CartItemType {
    NORMAL,
    NEGOTIATION,
    NEGOTIATION_ACCEPTED
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    unitPrice: number;
    type: CartItemType;
    proposedPrice: number;
    negotiationId: string;
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


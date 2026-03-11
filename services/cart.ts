import { Product } from "@/types";
export enum CartItemType {
    NORMAL,
    NEGOTIATION,
    NEGOTIATION_ACCEPTED
}

export interface Cart {
    id: string;
    userId: string;
    status: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
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
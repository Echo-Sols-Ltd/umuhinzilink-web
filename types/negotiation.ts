import { Order } from ".";

export enum NegotiationStatus {
    PENDING = 'PENDING',
    COUNTERED = 'COUNTERED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}


export interface Negotiation {
    id: string;
    order: Order;
    buyerProposedPrice: number;
    sellerResponsePrice?: number;
    lastMessage?: string;
    status: NegotiationStatus;
    expiresAt: string;
    expired: boolean;
    timeRemaining: string;
    canBuyerRespond: boolean;
    canSellerRespond: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CounterOfferRequest {
    counterPrice: number;
    message: string;
}

export interface NegotiationMessage {
    type: string;
    content: string;
    proposedPrice?: number;
    timestamp: number;
}

export interface NegotiationStatusUpdate {
    action: string;
    message: string;
    counterPrice?: number;
}

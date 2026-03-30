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
    sellerResponsePrice: number;
    agreedPrice: number;
    lastMessage: string;
    status: NegotiationStatus;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    isExpired: boolean;
    timeRemaining: string;
    canBuyerRespond: boolean;
    canSellerRespond: boolean;
}

export interface SetAgreedPriceRequest {
    agreedPrice: number;
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

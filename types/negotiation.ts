import { Order, User } from ".";

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
    agreedPrice: number | null;
    status: NegotiationStatus;
    rejectedBy: User | null;
    rejectionReason: string | null;
    sellerNote: string | null;
    expiresAt: string;
    priceSetAt: string | null;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
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

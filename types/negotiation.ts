import { Order } from ".";

export enum NegotiationStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    EXPIRED,
    COUNTERED
}


export interface Negotiation {
    id: string;
    order: Order;
    buyerProposedPrice: number;
    sellerResponsePrice: number;
    lastMessage: string;
    status: NegotiationStatus;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

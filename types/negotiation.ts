import { Order, User } from ".";

export enum NegotiationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}


export interface Negotiation {
    id: string;
    order: Order;
    buyerProposedPrice: number;
    agreedPrice: number;
    status: NegotiationStatus;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    closedAt: string;
}

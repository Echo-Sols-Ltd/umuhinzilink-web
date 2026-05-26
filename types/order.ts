import { Product } from "./product";
import { User } from "./user";
import { Negotiation } from "./negotiation";

// Order-related enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}


export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  WALLET = 'WALLET'
}



export interface Order {
    id: string;
    orderNumber: string;
    buyer: User;
    product: Product;
    negotiation: Negotiation;
    quantity: number;
    totalPrice: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    createdAt: string;
    updatedAt: string;
}

export interface OrderRequest {
    productId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    proposedPrice?: number;
}
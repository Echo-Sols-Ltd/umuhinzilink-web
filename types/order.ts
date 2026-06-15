import { Product } from "./product";
import { User } from "./user";
import { Negotiation } from "./negotiation";

// Order-related enums
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  /** @deprecated legacy — mapped to PENDING_PAYMENT on backend */
  PENDING = 'PENDING',
  /** @deprecated legacy — paid orders use COMPLETED */
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const isUnpaidOrder = (status: OrderStatus) =>
  status === OrderStatus.PENDING_PAYMENT || status === OrderStatus.PENDING;


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
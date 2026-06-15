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

export const isPaidOrder = (status: OrderStatus) =>
  status === OrderStatus.COMPLETED || status === OrderStatus.CONFIRMED;

export const getOrderStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING_PAYMENT:
    case OrderStatus.PENDING:
      return 'Pending payment';
    case OrderStatus.COMPLETED:
    case OrderStatus.CONFIRMED:
      return 'Completed';
    case OrderStatus.CANCELLED:
      return 'Cancelled';
    default:
      return String(status).replace(/_/g, ' ').toLowerCase();
  }
};

export type OrderStatusFilter = 'all' | 'pending' | 'completed' | 'cancelled';

export const matchesOrderStatusFilter = (status: OrderStatus, filter: OrderStatusFilter): boolean => {
  if (filter === 'all') return true;
  if (filter === 'pending') return isUnpaidOrder(status);
  if (filter === 'completed') return isPaidOrder(status);
  if (filter === 'cancelled') return status === OrderStatus.CANCELLED;
  return false;
};


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
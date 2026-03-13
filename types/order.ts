import { Product } from "./product";
import { User } from "./user";
import { Negotiation } from "./negotiation";

// Order-related enums
export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
  SATISFIED = 'SATISFIED'
}

export enum OrderType {
  NORMAL = 'NORMAL',
  NEGOTIATED = 'NEGOTIATED'
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface DeliveryStep {
  status: DeliveryStatus;
  completedAt: string;
  completed: boolean;
}

export interface Delivery {
  id: string;
  isCanceled: boolean;
  deliveryStartDate: string;
  deliveredDate: string;
  trackingSteps: DeliveryStep[];
}

export interface Order {
  id: string;
  buyer: User;
  product: Product;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isBuyerSatisfied: boolean;
  orderType: OrderType;
  negotiation?: Negotiation;
  delivery?: Delivery;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRequest {
  productId: string;
  quantity: number;
  totalPrice: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
}
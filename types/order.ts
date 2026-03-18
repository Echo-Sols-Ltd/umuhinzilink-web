import { Product } from "./product";
import { User } from "./user";
import { Negotiation } from "./negotiation";

// Order-related enums
export enum OrderStatus {
  PENDING,
  CONFIRMED,
  COMPLETED,
  CANCELLED,
  OUT_FOR_DELIVERY
}


export enum OrderType {
  NORMAL,
  NEGOTIATED
}

export enum PaymentMethod {
  MOBILE_MONEY,
  AIRTEL_MONEY,
  BANK_TRANSFER,
  CASH,
  WALLET
}

export enum DeliveryStatus {
  SCHEDULED,
  IN_TRANSIT,
  DELIVERED,
  FAILED,
  CANCELLED
}

export interface DeliveryStep {
  status: DeliveryStatus;
  completedAt: string;
  completed: boolean;
}

export interface Delivery {
  id: string;
  isCanceled: boolean;
  trackingSteps: DeliveryStep[];
  deliveredDate: string;
  deliveryStartDate: string;
}

export interface Order {
  id: string;
  buyer: User;
  product: Product;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  delivery: Delivery;
  paymentMethod: PaymentMethod;
  isBuyerSatisfied: boolean;
  orderType: OrderType;
  negotiation: Negotiation;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRequest {
  productId: string;
  quantity: number;
  totalPrice: number;
  proposedPrice?: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
}
import { Product } from "./product";
import { User } from "./user";

// Order-related enums
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET = 'WALLET',
  CASH = 'CASH',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

// Option arrays for UI components
export const orderStatusOptions = [
  { label: 'PENDING', value: OrderStatus.PENDING },
  { label: 'COMPLETED', value: OrderStatus.COMPLETED },
  { label: 'CANCELLED', value: OrderStatus.CANCELLED },
  { label: 'ACTIVE', value: OrderStatus.ACTIVE },
];

export const paymentMethodOptions = [
  { label: 'MOBILE_MONEY', value: PaymentMethod.MOBILE_MONEY },
  { label: 'BANK_TRANSFER', value: PaymentMethod.BANK_TRANSFER },
  { label: 'WALLET', value: PaymentMethod.WALLET },
  { label: 'CASH', value: PaymentMethod.CASH },
];

export const deliveryStatusOptions = [
  { label: 'PENDING', value: DeliveryStatus.PENDING },
  { label: 'SCHEDULED', value: DeliveryStatus.SCHEDULED },
  { label: 'IN_TRANSIT', value: DeliveryStatus.IN_TRANSIT },
  { label: 'DELIVERED', value: DeliveryStatus.DELIVERED },
  { label: 'FAILED', value: DeliveryStatus.FAILED },
];

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
  delivery?: Delivery;
  paymentMethod: PaymentMethod;
  isBuyerSatisfied: boolean;
  createdAt: string;
  updatedAt: string;
}
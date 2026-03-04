import { DeliveryStatus, OrderStatus, PaymentMethod } from './enums';
import { FarmerProduct, SupplierProduct } from './product';
import { User } from './user';

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

export interface FarmerOrder {
  id: string;
  buyer: User;
  product: FarmerProduct;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  delivery?: Delivery;
  paymentMethod: PaymentMethod;
  isBuyerSatisfied?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierOrder {
  id: string;
  buyer: User;
  product: SupplierProduct;
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: OrderStatus;
  delivery?: Delivery;
  paymentMethod: PaymentMethod;
  deliveryDate?: string;
  isBuyerSatisfied?: boolean;
  createdAt: string;
  updatedAt: string;
}

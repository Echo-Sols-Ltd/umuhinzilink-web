import { DeliveryStatus, OrderStatus, PaymentMethod } from './enums';
import { Product} from './product';
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
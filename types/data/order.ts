import { OrderStatus, PaymentMethod, DeliveryStatus } from '../order';

// Order status options for UI components
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

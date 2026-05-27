import { OrderStatus, PaymentMethod } from '../order';

// Order status options for UI components
export const orderStatusOptions = [
  { label: 'PENDING', value: OrderStatus.PENDING },
  { label: 'COMPLETED', value: OrderStatus.COMPLETED },
  { label: 'CANCELLED', value: OrderStatus.CANCELLED },
  { label: 'CONFIRMED', value: OrderStatus.CONFIRMED },
];

export const paymentMethodOptions = [
  { label: 'MOBILE_MONEY', value: PaymentMethod.MOBILE_MONEY },
  { label: 'BANK_TRANSFER', value: PaymentMethod.BANK_TRANSFER },
  { label: 'WALLET', value: PaymentMethod.WALLET },
  { label: 'CASH', value: PaymentMethod.CASH },
];


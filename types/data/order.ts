import { OrderStatus, PaymentMethod } from '../order';

// Order status options for UI components
export const orderStatusOptions = [
  { label: 'PENDING PAYMENT', value: OrderStatus.PENDING_PAYMENT },
  { label: 'COMPLETED', value: OrderStatus.COMPLETED },
  { label: 'CANCELLED', value: OrderStatus.CANCELLED },
];

export const paymentMethodOptions = [
  { label: 'MOBILE_MONEY', value: PaymentMethod.MOBILE_MONEY },
  { label: 'BANK_TRANSFER', value: PaymentMethod.BANK_TRANSFER },
  { label: 'WALLET', value: PaymentMethod.WALLET },
  { label: 'CASH', value: PaymentMethod.CASH },
];


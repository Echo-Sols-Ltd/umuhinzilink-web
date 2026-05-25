import { PaymentMethod, User } from ".";

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  INCOME = 'INCOME'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface Wallet {
  id: string
  user: User;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDTO {
  id: string;
  transactionId: string;
  user: User;
  wallet: Wallet;
  orderId: string;
  recipient: User;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  phoneNumber: string; // mobile money
  reference: string; // from provider
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
}
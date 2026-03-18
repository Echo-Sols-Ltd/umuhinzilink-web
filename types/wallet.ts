import { PaymentMethod } from ".";

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

export interface WalletDTO {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface WalletTransactionDTO {
  id: string;
  transactionId: string;
  userId: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  orderId: string;
  recipientId: string;
  recipientEmail: string;
  reference: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface PaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
}

export interface PaymentResponseDTO {
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  reference: string;
  message: string;
  createdAt: string;
  paidAt?: string;
  phoneNumber?: string;
}
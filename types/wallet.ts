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

export interface WalletDepositRequest {
  amount: number;
  description?: string;
}

export interface WalletPaymentRequest {
  orderId: string;
  description?: string;
}

export interface WalletTransactionDTO {
  id: string;
  walletId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  createdAt: string;
}

export interface PaymentRequest {
  orderId: string;
  paymentMethod: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'WALLET' | 'CASH';
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
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  reference: string;
  message: string;
  createdAt: string;
  paidAt?: string;
  phoneNumber?: string;
}
import { ApiResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

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

export class WalletService {
  // Get wallet balance
  async getBalance(): Promise<ApiResponse<WalletDTO>> {
    return await apiClient.get<WalletDTO>(API_ENDPOINTS.WALLET.BALANCE);
  }

  // Deposit money to wallet
  async deposit(request: WalletDepositRequest): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.post<WalletTransactionDTO>(API_ENDPOINTS.WALLET.DEPOSIT, request);
  }

  // Pay for order using wallet
  async payOrder(request: WalletPaymentRequest): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.post<WalletTransactionDTO>(API_ENDPOINTS.WALLET.PAY_ORDER, request);
  }

  // Get transaction history
  async getTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponse<{
    content: WalletTransactionDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(url);
  }

  // Get transaction by ID
  async getTransactionById(transactionId: string): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.get<WalletTransactionDTO>(API_ENDPOINTS.WALLET.TRANSACTION_BY_ID(transactionId));
  }

  // Admin: Create wallet for user
  async createWalletForUser(userId: string): Promise<ApiResponse<WalletDTO>> {
    return await apiClient.post<WalletDTO>(API_ENDPOINTS.WALLET.ADMIN_CREATE_WALLET(userId));
  }
}

export const walletService = new WalletService();
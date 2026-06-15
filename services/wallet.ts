import { ApiResponse, PaginatedResponse, Wallet, Transaction } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

interface WalletDepositRequest {
  amount: number;
  description?: string;
}

interface WalletPaymentRequest {
  orderId: string;
  description?: string;
}



class WalletService {
  // Get wallet balance
  async getBalance(): Promise<ApiResponse<Wallet>> {
    return await apiClient.get<ApiResponse<Wallet>>(API_ENDPOINTS.WALLET.ME);
  }

  // Deposit money to wallet
  async deposit(request: WalletDepositRequest): Promise<ApiResponse<Transaction>> {
    return await apiClient.post<ApiResponse<Transaction>>(API_ENDPOINTS.WALLET.DEPOSIT, request);
  }

  // Pay for order using wallet
  async payOrder(orderId: string): Promise<ApiResponse<unknown>> {
    return await apiClient.post<ApiResponse<unknown>>(
      `${API_ENDPOINTS.PAYMENT.PAY}?orderId=${orderId}`,
      undefined,
      { timeout: 30000 }
    );
  }


  // Get transaction by ID
  async getTransactionById(transactionId: string): Promise<ApiResponse<Transaction>> {
    return await apiClient.get<ApiResponse<Transaction>>(API_ENDPOINTS.WALLET.TRANSACTION_BY_ID(transactionId));
  }



  // Admin: Get all wallets (paginated)
  async getAllWallets(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Wallet[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_ALL_WALLETS}?${queryParams.toString()}`;
    return await apiClient.get<PaginatedResponse<Wallet[]>>(url);
  }

  // Admin: Get all transactions (paginated)
  async getAllTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_ALL_TRANSACTIONS}?${queryParams.toString()}`;
    return await apiClient.get<PaginatedResponse<Transaction[]>>(url);
  }

  // Admin: Get wallet by user ID
  async getWalletByUserId(userId: string): Promise<ApiResponse<Wallet>> {
    return await apiClient.get<ApiResponse<Wallet>>(API_ENDPOINTS.WALLET.ADMIN_WALLET_BY_USER(userId));
  }

  // Admin: Get transactions by user ID (paginated)
  async getTransactionsByUserId(userId: string, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_TRANSACTIONS_BY_USER(userId)}?${queryParams.toString()}`;
    return await apiClient.get<PaginatedResponse<Transaction[]>>(url);
  }
}

export const walletService = new WalletService();
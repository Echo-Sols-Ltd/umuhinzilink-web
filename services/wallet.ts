import { ApiResponse, PaginatedResponse, WalletDTO } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

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
    return await apiClient.get<ApiResponse<WalletDTO>>(API_ENDPOINTS.WALLET.BALANCE);
  }

  // Deposit money to wallet
  async deposit(request: WalletDepositRequest): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.post<ApiResponse<WalletTransactionDTO>>(API_ENDPOINTS.WALLET.DEPOSIT, request);
  }

  // Pay for order using wallet
  async payOrder(request: WalletPaymentRequest): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.post<ApiResponse<WalletTransactionDTO>>(API_ENDPOINTS.WALLET.PAY_ORDER, request, {
      timeout: 30000,
    });
  }

  // Get transaction history
  async getTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<WalletTransactionDTO[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<WalletTransactionDTO[]>>(url);
  }

  // Get transaction by ID
  async getTransactionById(transactionId: string): Promise<ApiResponse<WalletTransactionDTO>> {
    return await apiClient.get<ApiResponse<WalletTransactionDTO>>(API_ENDPOINTS.WALLET.TRANSACTION_BY_ID(transactionId));
  }

  // Admin: Create wallet for user
  async createWalletForUser(userId: string): Promise<ApiResponse<WalletDTO>> {
    return await apiClient.post<ApiResponse<WalletDTO>>(API_ENDPOINTS.WALLET.ADMIN_CREATE_WALLET(userId));
  }

  // Admin: Get all wallets (paginated)
  async getAllWallets(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<WalletDTO[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_ALL_WALLETS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<WalletDTO[]>>(url);
  }

  // Admin: Get all transactions (paginated)
  async getAllTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<WalletTransactionDTO[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_ALL_TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<WalletTransactionDTO[]>>(url);
  }

  // Admin: Get wallet by user ID
  async getWalletByUserId(userId: string): Promise<ApiResponse<WalletDTO>> {
    return await apiClient.get<ApiResponse<WalletDTO>>(API_ENDPOINTS.WALLET.ADMIN_WALLET_BY_USER(userId));
  }

  // Admin: Get transactions by user ID (paginated)
  async getTransactionsByUserId(userId: string, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<WalletTransactionDTO[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.ADMIN_TRANSACTIONS_BY_USER(userId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<WalletTransactionDTO[]>>(url);
  }
}

export const walletService = new WalletService();
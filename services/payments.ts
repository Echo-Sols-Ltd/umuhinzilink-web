import { ApiResponse, PaginatedResponse, PaymentRequest, Transaction } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class PaymentService {
  async processPayment(request: PaymentRequest): Promise<ApiResponse<unknown>> {
    return await apiClient.post<ApiResponse<unknown>>(API_ENDPOINTS.PAYMENT.PROCESS, request);
  }

  async getPaymentStatus(transactionId: string): Promise<ApiResponse<Transaction>> {
    return await apiClient.get<ApiResponse<Transaction>>(API_ENDPOINTS.PAYMENT.STATUS(transactionId));
  }

  async getOrderPayment(orderId: string): Promise<ApiResponse<Transaction>> {
    return await apiClient.get<ApiResponse<Transaction>>(API_ENDPOINTS.PAYMENT.ORDER_PAYMENT(orderId));
  }

  async getMyTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 50));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.WALLET.TRANSACTIONS}?${queryParams.toString()}`;
    return await apiClient.get<PaginatedResponse<Transaction[]>>(url);
  }

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
}

export const paymentService = new PaymentService();

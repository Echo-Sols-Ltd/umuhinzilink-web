import { ApiResponse, PaymentRequest, Transaction } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';



class PaymentService {
  // Process payment for order
  async processPayment(request: PaymentRequest): Promise<ApiResponse<Transaction>> {
    return await apiClient.post<ApiResponse<Transaction>>(API_ENDPOINTS.PAYMENT.PROCESS, request);
  }

  // Check payment status
  async getPaymentStatus(transactionId: string): Promise<ApiResponse<Transaction>> {
    return await apiClient.get<ApiResponse<Transaction>>(API_ENDPOINTS.PAYMENT.STATUS(transactionId));
  }

  // Get payment details for order
  async getOrderPayment(orderId: string): Promise<ApiResponse<Transaction>> {
    return await apiClient.get<ApiResponse<Transaction>>(API_ENDPOINTS.PAYMENT.ORDER_PAYMENT(orderId));
  }

  // Get user's transaction history (paginated)
  async getMyTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponse<{
    content: Transaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.PAYMENT.MY_TRANSACTIONS}?${queryParams.toString()}`;
    return await apiClient.get<ApiResponse<{ content: Transaction[]; totalElements: number; totalPages: number; size: number; number: number }>>(url);
  }

  // Admin: Get all transactions (paginated)
  async getAllTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponse<{
    content: Transaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

    const url = `${API_ENDPOINTS.PAYMENT.ADMIN_ALL_TRANSACTIONS}?${queryParams.toString()}`;
    return await apiClient.get<ApiResponse<{ content: Transaction[]; totalElements: number; totalPages: number; size: number; number: number }>>(url);
  }
}

export const paymentService = new PaymentService();
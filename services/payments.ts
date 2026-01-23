import { ApiResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export interface PaymentRequest {
  orderId: string;
  paymentMethod: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'WALLET' | 'CASH';
  phoneNumber?: string; // for mobile money
  accountNumber?: string; // for bank transfer
  bankName?: string; // for bank transfer
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

export class PaymentService {
  // Process payment for order
  async processPayment(request: PaymentRequest): Promise<ApiResponse<PaymentResponseDTO>> {
    return await apiClient.post<PaymentResponseDTO>(API_ENDPOINTS.PAYMENT.PROCESS, request);
  }

  // Check payment status
  async getPaymentStatus(transactionId: string): Promise<ApiResponse<PaymentResponseDTO>> {
    return await apiClient.get<PaymentResponseDTO>(API_ENDPOINTS.PAYMENT.STATUS(transactionId));
  }

  // Get payment details for order
  async getOrderPayment(orderId: string): Promise<ApiResponse<PaymentResponseDTO>> {
    return await apiClient.get<PaymentResponseDTO>(API_ENDPOINTS.PAYMENT.ORDER_PAYMENT(orderId));
  }

  // Get user's transaction history
  async getMyTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponse<{
    content: PaymentResponseDTO[];
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

    const url = `${API_ENDPOINTS.PAYMENT.MY_TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(url);
  }

  // Admin: Get all transactions
  async getAllTransactions(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<ApiResponse<{
    content: PaymentResponseDTO[];
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

    const url = `${API_ENDPOINTS.PAYMENT.ADMIN_ALL_TRANSACTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get(url);
  }
}

export const paymentService = new PaymentService();
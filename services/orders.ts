import { ApiResponse, Order, OrderRequest, OrderStatus, PaginatedResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class OrderService {
  async createOrder(payload: OrderRequest): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CREATE, payload);
  }

  async getBuyerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.ALL}?page=${page}&size=${size}`
    );
  }

  async getSellerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.SELLER_ALL}?page=${page}&size=${size}`
    );
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDER.BY_ID(id));
  }

  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CANCEL(id));
  }

  async acceptOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.ACCEPT(id));
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.UPDATE_STATUS(id), status);
  }

  async markOrderSatisfaction(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER.SATISFACTION(id)
    );
  }
}


export const orderService = new OrderService();

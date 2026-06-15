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

  async acceptOrder(_id: string): Promise<ApiResponse<Order>> {
    return {
      success: false,
      message: 'Orders are paid automatically when the buyer checks out.',
    };
  }

  async updateOrderStatus(
    _id: string,
    _status: OrderStatus
  ): Promise<ApiResponse<Order>> {
    return {
      success: false,
      message: 'Order status is managed automatically after payment.',
    };
  }

  async markOrderSatisfaction(_id: string): Promise<ApiResponse<Order>> {
    return {
      success: false,
      message: 'Order satisfaction tracking is not available yet.',
    };
  }
}


export const orderService = new OrderService();

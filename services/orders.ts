import { ApiResponse, DeliveryStatus, Order, OrderRequest, PaginatedResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class OrderService {
  async createFarmerOrder(payload: OrderRequest): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CREATE_FARMER, payload);
  }

  async createSupplierOrder(payload: OrderRequest): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CREATE_SUPPLIER, payload);
  }

  async getBuyerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.BUYER_ALL}?page=${page}&size=${size}`
    );
  }

  async getFarmerBuyerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.FARMER_BUYER_ALL}?page=${page}&size=${size}`
    );
  }

  async getSupplierOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.SUPPLIER_ALL}?page=${page}&size=${size}`
    );
  }

  async getFarmerOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.FARMER_ALL}?page=${page}&size=${size}`
    );
  }

  async getSupplierOrderById(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDER.BY_SUPPLIER_ID(id));
  }

  async getFarmerOrderById(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDER.BY_FARMER_ID(id));
  }

  async cancelSupplierOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CANCEL_SUPPLIER(id));
  }

  async cancelFarmerOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CANCEL_FARMER(id));
  }

  async acceptSupplierOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.ACCEPT_SUPPLIER(id));
  }

  async acceptFarmerOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.ACCEPT_FARMER(id));
  }

  async updateFarmerOrderStatus(
    id: string,
    status: DeliveryStatus
  ): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.UPDATE_FARMER_STATUS(id), status);
  }

  async updateSupplierOrderStatus(
    id: string,
    status: DeliveryStatus
  ): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER.UPDATE_SUPPLIER_STATUS(id),
      status
    );
  }

  async markFarmerOrderSatisfaction(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER.SATISFACTION_FARMER(id)
    );
  }

  async markSupplierOrderSatisfaction(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER.SATISFACTION_SUPPLIER(id)
    );
  }
}

export const orderService = new OrderService();

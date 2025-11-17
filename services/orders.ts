import { ApiResponse, DeliveryStatus, FarmerOrder, OrderRequest, SupplierOrder } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class OrderService {
  async createFarmerOrder(payload: OrderRequest): Promise<ApiResponse<FarmerOrder>> {
    return await apiClient.post<FarmerOrder>(API_ENDPOINTS.ORDER.CREATE_FARMER, payload);
  }

  async createSupplierOrder(payload: OrderRequest): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.post<SupplierOrder>(API_ENDPOINTS.ORDER.CREATE_SUPPLIER, payload);
  }

  async getBuyerOrders(): Promise<ApiResponse<FarmerOrder[]>> {
    return await apiClient.get<FarmerOrder[]>(API_ENDPOINTS.ORDER.BUYER_ALL);
  }

  async getFarmerBuyerOrders(): Promise<ApiResponse<SupplierOrder[]>> {
    return await apiClient.get<SupplierOrder[]>(API_ENDPOINTS.ORDER.FARMER_BUYER_ALL);
  }

  async getSupplierOrders(): Promise<ApiResponse<SupplierOrder[]>> {
    return await apiClient.get<SupplierOrder[]>(API_ENDPOINTS.ORDER.SUPPLIER_ALL);
  }

  async getFarmerOrders(): Promise<ApiResponse<FarmerOrder[]>> {
    return await apiClient.get<FarmerOrder[]>(API_ENDPOINTS.ORDER.FARMER_ALL);
  }

  async getSupplierOrderById(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.get<SupplierOrder>(API_ENDPOINTS.ORDER.BY_SUPPLIER_ID(id));
  }

  async getFarmerOrderById(id: string): Promise<ApiResponse<FarmerOrder>> {
    return await apiClient.get<FarmerOrder>(API_ENDPOINTS.ORDER.BY_FARMER_ID(id));
  }

  async cancelSupplierOrder(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<SupplierOrder>(API_ENDPOINTS.ORDER.CANCEL_SUPPLIER(id));
  }

  async cancelFarmerOrder(id: string): Promise<ApiResponse<FarmerOrder>> {
    return await apiClient.put<FarmerOrder>(API_ENDPOINTS.ORDER.CANCEL_FARMER(id));
  }

  async acceptSupplierOrder(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<SupplierOrder>(API_ENDPOINTS.ORDER.ACCEPT_SUPPLIER(id));
  }

  async acceptFarmerOrder(id: string): Promise<ApiResponse<FarmerOrder>> {
    return await apiClient.put<FarmerOrder>(API_ENDPOINTS.ORDER.ACCEPT_FARMER(id));
  }

  async updateFarmerOrderStatus(
    id: string,
    status: DeliveryStatus
  ): Promise<ApiResponse<FarmerOrder>> {
    return await apiClient.put<FarmerOrder>(API_ENDPOINTS.ORDER.UPDATE_FARMER_STATUS(id), status);
  }

  async updateSupplierOrderStatus(
    id: string,
    status: DeliveryStatus
  ): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<SupplierOrder>(
      API_ENDPOINTS.ORDER.UPDATE_SUPPLIER_STATUS(id),
      status
    );
  }
}

export const orderService = new OrderService();

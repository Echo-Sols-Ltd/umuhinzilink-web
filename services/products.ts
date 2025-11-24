import {
  FarmerProduct,
  SupplierProduct,
  FarmerProductRequest,
  ApiResponse,
  PaginatedResponse,
  FarmerProductionStat,
  SupplierProductionStat,
  SupplierProductRequest,
} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class ProductService {
  async createFarmerProduct(payload: FarmerProductRequest): Promise<ApiResponse<FarmerProduct>> {
    return await apiClient.post<FarmerProduct>(API_ENDPOINTS.PRODUCT.CREATE_FARMER, payload);
  }

  async createSupplierProduct(
    payload: SupplierProductRequest
  ): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.post<SupplierProduct>(API_ENDPOINTS.PRODUCT.CREATE_SUPPLIER, payload);
  }

  async updateFarmerProduct(
    id: string,
    payload: FarmerProductRequest
  ): Promise<ApiResponse<FarmerProduct>> {
    return await apiClient.put<FarmerProduct>(API_ENDPOINTS.PRODUCT.UPDATE_FARMER(id), payload);
  }

  async updateSupplierProduct(
    id: string,
    payload: SupplierProductRequest
  ): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.put<SupplierProduct>(API_ENDPOINTS.PRODUCT.UPDATE_SUPPLIER(id), payload);
  }

  async deleteFarmerProduct(id: string): Promise<ApiResponse<FarmerProduct>> {
    return await apiClient.delete<FarmerProduct>(API_ENDPOINTS.PRODUCT.DELETE_FARMER(id));
  }

  async deleteSupplierProduct(id: string): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.delete<SupplierProduct>(API_ENDPOINTS.PRODUCT.DELETE_SUPPLIER(id));
  }

  async getProductsByFarmer(): Promise<ApiResponse<FarmerProduct[]>> {
    return await apiClient.get<FarmerProduct[]>(API_ENDPOINTS.PRODUCT.FARMER_ALL);
  }

  async getProductsBySupplier(): Promise<ApiResponse<SupplierProduct[]>> {
    return await apiClient.get<SupplierProduct[]>(API_ENDPOINTS.PRODUCT.SUPPLIER_ALL);
  }

  async getBuyerProducts(): Promise<ApiResponse<PaginatedResponse<FarmerProduct[]>>> {
    return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(API_ENDPOINTS.PRODUCT.BUYER_ALL);
  }

  async getFarmerBuyerProducts(): Promise<ApiResponse<PaginatedResponse<SupplierProduct[]>>> {
    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(
      API_ENDPOINTS.PRODUCT.FARMER_BUYER_ALL
    );
  }

  async getFarmerStats(): Promise<ApiResponse<FarmerProductionStat[]>> {
    return await apiClient.get<FarmerProductionStat[]>(API_ENDPOINTS.PRODUCT.FARMER_STATS);
  }

  async getSupplierStats(): Promise<ApiResponse<SupplierProductionStat[]>> {
    return await apiClient.get<SupplierProductionStat[]>(API_ENDPOINTS.PRODUCT.SUPPLIER_STATS);
  }
}

export const productService = new ProductService();

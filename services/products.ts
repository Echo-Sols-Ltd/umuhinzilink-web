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
    return await apiClient.post<ApiResponse<FarmerProduct>>(API_ENDPOINTS.PRODUCT.CREATE_FARMER, payload);
  }

  async createSupplierProduct(
    payload: SupplierProductRequest
  ): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.post<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.CREATE_SUPPLIER, payload);
  }

  async updateFarmerProduct(
    id: string,
    payload: FarmerProductRequest
  ): Promise<ApiResponse<FarmerProduct>> {
    return await apiClient.put<ApiResponse<FarmerProduct>>(API_ENDPOINTS.PRODUCT.UPDATE_FARMER(id), payload);
  }

  async updateSupplierProduct(
    id: string,
    payload: SupplierProductRequest
  ): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.put<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.UPDATE_SUPPLIER(id), payload);
  }

  async deleteFarmerProduct(id: string): Promise<ApiResponse<FarmerProduct>> {
    return await apiClient.delete<ApiResponse<FarmerProduct>>(API_ENDPOINTS.PRODUCT.DELETE_FARMER(id));
  }

  async deleteSupplierProduct(id: string): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.delete<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.DELETE_SUPPLIER(id));
  }

  async getProductsByFarmer(): Promise<PaginatedResponse<FarmerProduct[]>> {
    return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(API_ENDPOINTS.PRODUCT.FARMER_ALL);
  }

  async getProductsBySupplier(): Promise<PaginatedResponse<SupplierProduct[]>> {
    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_ALL);
  }

  async getBuyerProducts(): Promise<PaginatedResponse<FarmerProduct[]>> {
    return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(API_ENDPOINTS.PRODUCT.FARMER_ALL_PUBLIC);
  }

  async getFarmerBuyerProducts(): Promise<PaginatedResponse<SupplierProduct[]>> {
    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(
      API_ENDPOINTS.PRODUCT.SUPPLIER_ALL_PUBLIC
    );
  }

  async getFarmerStats(): Promise<ApiResponse<FarmerProductionStat[]>> {
    return await apiClient.get<ApiResponse<FarmerProductionStat[]>>(API_ENDPOINTS.PRODUCT.FARMER_STATS);
  }

  async getSupplierStats(): Promise<ApiResponse<SupplierProductionStat[]>> {
    return await apiClient.get<ApiResponse<SupplierProductionStat[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_STATS);
  }

  async searchFarmerProducts(params: {
    name?: string;
    keyword?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<FarmerProduct[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiClient.get<PaginatedResponse<FarmerProduct[]>>(`${API_ENDPOINTS.PRODUCT.FARMER_SEARCH}?${queryParams.toString()}`);
  }

  async searchSupplierProducts(params: {
    name?: string;
    keyword?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<SupplierProduct[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(`${API_ENDPOINTS.PRODUCT.SUPPLIER_SEARCH}?${queryParams.toString()}`);
  }

  async uploadProductPhoto(file: File): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<ApiResponse<string>>(API_ENDPOINTS.FILES.UPLOAD_AVATAR, file)
  }
}

export const productService = new ProductService();

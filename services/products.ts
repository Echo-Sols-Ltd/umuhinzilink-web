import {
  Product,
  FarmerProductRequest,
  ApiResponse,
  PaginatedResponse,
  SupplierProductRequest,
} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class ProductService {
  async createProduct(payload: FarmerProductRequest | SupplierProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.CREATE, payload);
  }

  async updateProduct(id: string, payload: FarmerProductRequest | SupplierProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.UPDATE(id), payload);
  }

  async deleteProduct(id: string): Promise<ApiResponse<Product>> {
    return await apiClient.delete<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.DELETE(id));
  }

  async getPrivateProducts(page = 0, size = 10): Promise<PaginatedResponse<Product[]>> {
    return await apiClient.get<PaginatedResponse<Product[]>>(
      `${API_ENDPOINTS.PRODUCT.PRIVATE_ALL}?page=${page}&size=${size}`
    );
  }

  async getPublicProducts(page = 0, size = 10): Promise<PaginatedResponse<Product[]>> {
    return await apiClient.get<PaginatedResponse<Product[]>>(
      `${API_ENDPOINTS.PRODUCT.PUBLIC_ALL}?page=${page}&size=${size}`
    );
  }

  async getFarmerStats(): Promise<ApiResponse<any[]>> {
    return await apiClient.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCT.FARMER_STATS);
  }

  async getSupplierStats(): Promise<ApiResponse<any[]>> {
    return await apiClient.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_STATS);
  }

  async searchProducts(params: {
    name?: string;
    keyword?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiClient.get<PaginatedResponse<Product[]>>(`${API_ENDPOINTS.PRODUCT.SEARCH}?${queryParams.toString()}`);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return await apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.BY_ID(id));
  }

  async uploadProductPhoto(file: File): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<ApiResponse<string>>(API_ENDPOINTS.FILES.UPLOAD_GENERIC, file)
  }
}

export const productService = new ProductService();


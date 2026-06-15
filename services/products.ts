import {
  Product,
  ProductRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class ProductService {
  async createProduct(payload: ProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.CREATE, payload);
  }

  async updateProduct(id: string, payload: ProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.UPDATE(id), payload);
  }

  async deleteProduct(id: string): Promise<ApiResponse<Product>> {
    return await apiClient.delete<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.DELETE(id));
  }

  async getProducts(page = 0, size = 10): Promise<PaginatedResponse<Product[]>> {
    return await apiClient.get<PaginatedResponse<Product[]>>(
      `${API_ENDPOINTS.PRODUCT.ALL}?page=${page}&size=${size}`
    );
  }

  async getSellerProducts(page = 0, size = 10): Promise<PaginatedResponse<Product[]>> {
    return await apiClient.get<PaginatedResponse<Product[]>>(
      `${API_ENDPOINTS.PRODUCT.SELLER}?page=${page}&size=${size}`
    );
  }



  async getSellerStats(): Promise<ApiResponse<Record<string, number>>> {
    return await apiClient.get<ApiResponse<Record<string, number>>>(API_ENDPOINTS.PRODUCT.SELLER_STATS);
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


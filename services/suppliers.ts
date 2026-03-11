import { ApiResponse, Supplier, Product, Order,PaginatedResponse } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

export interface SupplierProductRequest {
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  measurementUnit: string;
  image: string;
  quantity: number;
  harvestDate: string;
  location: string;
  isNegotiable: boolean;
  certification: string;
}

interface SupplierDashboard {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  topProducts: Product[];
}

class SupplierService {
  // User Profile Methods
  async getUserById(id: string): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.BY_ID(id));
  }

  async getSupplierById(id: string): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.ME);
  }

  // Product Management Methods
  async createProduct(productData: SupplierProductRequest): Promise<ApiResponse<Product>> {
    return await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.CREATE_SUPPLIER, productData);
  }

  async getMyProducts(page = 0, size = 10): Promise<PaginatedResponse<Product[]>> {
    return await apiClient.get<PaginatedResponse<Product[]>>(
      `${API_ENDPOINTS.PRODUCT.SUPPLIER_ALL}?page=${page}&size=${size}`
    );
  }

  async getAllProducts(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PaginatedResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const url = `${API_ENDPOINTS.PRODUCT.SUPPLIER_ALL_PUBLIC}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<Product[]>>(url);
  }

  async searchProducts(params: {
    name?: string;
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiClient.get<PaginatedResponse<Product[]>>(`${API_ENDPOINTS.PRODUCT.SUPPLIER_SEARCH}?${queryParams.toString()}`);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return await apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.BY_SUPPLIER_ID(id));
  }

  async updateProduct(id: string, productData: Partial<SupplierProductRequest>): Promise<ApiResponse<Product>> {
    return await apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCT.UPDATE_SUPPLIER(id), productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.PRODUCT.DELETE_SUPPLIER(id));
  }

  async getProductStats(): Promise<ApiResponse<any[]>> {
    return await apiClient.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_STATS);
  }

  // Order Management Methods
  async getMyOrders(page = 0, size = 10): Promise<PaginatedResponse<Order[]>> {
    return await apiClient.get<PaginatedResponse<Order[]>>(
      `${API_ENDPOINTS.ORDER.SUPPLIER_ALL}?page=${page}&size=${size}`
    );
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDER.BY_SUPPLIER_ID(id));
  }

  async acceptOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.ACCEPT_SUPPLIER(id));
  }

  async rejectOrder(id: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.CANCEL_SUPPLIER(id));
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return await apiClient.put<ApiResponse<Order>>(API_ENDPOINTS.ORDER.UPDATE_SUPPLIER_STATUS(id), JSON.stringify(status));
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<ApiResponse<SupplierDashboard>> {
    return await apiClient.get<ApiResponse<SupplierDashboard>>(API_ENDPOINTS.DASHBOARD.SUPPLIER_STATS);
  }

  // Update Methods
  async updateSupplier(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    return await apiClient.put<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.BY_ID(id), data);
  }
}

export const supplierService = new SupplierService();

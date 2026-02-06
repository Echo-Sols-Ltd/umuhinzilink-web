import { ApiResponse, Supplier, SupplierProduct, SupplierOrder, SupplierProductionStat, PaginatedResponse } from '@/types';
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

export interface SupplierDashboard {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  topProducts: SupplierProduct[];
}

export class SupplierService {
  // User Profile Methods
  async getUserById(id: string): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.BY_ID(id));
  }

  async getMe(): Promise<ApiResponse<Supplier>> {
    return await apiClient.get<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIER.ME);
  }

  // Product Management Methods
  async createProduct(productData: SupplierProductRequest): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.post<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.CREATE_SUPPLIER, productData);
  }

  async getMyProducts(): Promise<PaginatedResponse<SupplierProduct[]>> {
    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_ALL);
  }

  async getAllProducts(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PaginatedResponse<SupplierProduct[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const url = `${API_ENDPOINTS.PRODUCT.SUPPLIER_ALL_PUBLIC}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(url);
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
  }): Promise<PaginatedResponse<SupplierProduct[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiClient.get<PaginatedResponse<SupplierProduct[]>>(`${API_ENDPOINTS.PRODUCT.SUPPLIER_SEARCH}?${queryParams.toString()}`);
  }

  async getProductById(id: string): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.get<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.BY_SUPPLIER_ID(id));
  }

  async updateProduct(id: string, productData: Partial<SupplierProductRequest>): Promise<ApiResponse<SupplierProduct>> {
    return await apiClient.put<ApiResponse<SupplierProduct>>(API_ENDPOINTS.PRODUCT.UPDATE_SUPPLIER(id), productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.PRODUCT.DELETE_SUPPLIER(id));
  }

  async getProductStats(): Promise<ApiResponse<SupplierProductionStat[]>> {
    return await apiClient.get<ApiResponse<SupplierProductionStat[]>>(API_ENDPOINTS.PRODUCT.SUPPLIER_STATS);
  }

  // Order Management Methods
  async getMyOrders(): Promise<PaginatedResponse<SupplierOrder[]>> {
    return await apiClient.get<PaginatedResponse<SupplierOrder[]>>(API_ENDPOINTS.ORDER.SUPPLIER_ALL);
  }

  async getOrderById(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.get<ApiResponse<SupplierOrder>>(API_ENDPOINTS.ORDER.BY_SUPPLIER_ID(id));
  }

  async acceptOrder(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<ApiResponse<SupplierOrder>>(API_ENDPOINTS.ORDER.ACCEPT_SUPPLIER(id));
  }

  async rejectOrder(id: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<ApiResponse<SupplierOrder>>(API_ENDPOINTS.ORDER.CANCEL_SUPPLIER(id));
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<SupplierOrder>> {
    return await apiClient.put<ApiResponse<SupplierOrder>>(API_ENDPOINTS.ORDER.UPDATE_SUPPLIER_STATUS(id), JSON.stringify(status));
  }

  // Dashboard Methods
  async getDashboardStats(): Promise<ApiResponse<SupplierDashboard>> {
    return await apiClient.get<ApiResponse<SupplierDashboard>>(API_ENDPOINTS.DASHBOARD.SUPPLIER_STATS);
  }
}

export const supplierService = new SupplierService();

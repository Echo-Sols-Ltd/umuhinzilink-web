import { API_ENDPOINTS } from './constants';
import { apiClient } from './client';
import {
  BuyerDashboardResponse,
  SellerDashboardResponse,
  AdminDashboardResponse,
  NotificationResponse,
} from '@/types';

// Dashboard Service using the existing API client
export const dashboardService = {
  // Buyer Dashboard
  getBuyerDashboard: async (): Promise<BuyerDashboardResponse> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.BUYER_STATS);
  },

  // Seller Dashboard
  getSellerDashboard: async (): Promise<SellerDashboardResponse> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.SELLER_STATS);
  },


  // Admin Dashboard
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_STATS);
  },



  // Notifications
  getNotifications: async (): Promise<NotificationResponse> => {
    return apiClient.get('/notifications');
  },



  // Dashboard analytics and insights
  getDashboardInsights: async (userRole: string, timeRange: string): Promise<any> => {
    const endpoint = `/dashboard/${userRole}/insights`;
    return apiClient.get(endpoint, { timeRange });
  },

  // Custom dashboard metrics
  getCustomMetrics: async (userRole: string, metrics: string[]): Promise<any> => {
    const endpoint = `/dashboard/${userRole}/metrics`;
    return apiClient.post(endpoint, { metrics });
  },

  // Refresh dashboard data (GET retries are handled by the API client interceptor)
  refreshDashboard: async (userRole: string): Promise<any> => {
    switch (userRole) {
      case 'BUYER':
        return apiClient.get(API_ENDPOINTS.DASHBOARD.BUYER_STATS);
      case 'SELLER':
        return apiClient.get(API_ENDPOINTS.DASHBOARD.SELLER_STATS);
      case 'ADMIN':
        return apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN_STATS);
      default:
        throw new Error(`Unsupported user role: ${userRole}`);
    }
  },
};

// Error handling utilities
export const handleDashboardError = (error: any, userRole: string) => {
  console.error(`Dashboard error for ${userRole}:`, error);

  // The API client already handles most errors, but we can add specific dashboard error handling here
  if (error.response) {
    const status = error.response.status;

    switch (status) {
      case 401:
        return {
          success: false,
          message: 'Authentication required. Please log in again.',
          error: 'UNAUTHORIZED',
        };
      case 403:
        return {
          success: false,
          message: 'You do not have permission to access this dashboard.',
          error: 'FORBIDDEN',
        };
      case 404:
        return {
          success: false,
          message: 'Dashboard data not found.',
          error: 'NOT_FOUND',
        };
      case 429:
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMITED',
        };
      case 500:
        return {
          success: false,
          message: 'Server error. Please try again later.',
          error: 'SERVER_ERROR',
        };
      default:
        return {
          success: false,
          message: `Failed to load ${userRole} dashboard data.`,
          error: error.message || 'Unknown error',
        };
    }
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      success: false,
      message: 'Request timed out. Please check your connection and try again.',
      error: 'TIMEOUT',
    };
  }

  if (error.message?.includes('Network Error')) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
      error: 'NETWORK_ERROR',
    };
  }

  return {
    success: false,
    message: `Failed to load ${userRole} dashboard data`,
    error: error.message || 'Unknown error',
  };
};

// Dashboard data caching (enhanced with better error handling)
class DashboardCache {
  private cache = new Map<string, { data: any; timestamp: number; error?: any }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Cache error responses for shorter duration
  setError(key: string, error: any): void {
    this.cache.set(key, {
      data: null,
      error,
      timestamp: Date.now(),
    });
  }

  getError(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached || !cached.error) return null;

    // Cache errors for only 1 minute
    if (Date.now() - cached.timestamp > 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.error;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear only expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      const duration = value.error ? 60 * 1000 : this.CACHE_DURATION;
      if (now - value.timestamp > duration) {
        this.cache.delete(key);
      }
    }
  }
}

export const dashboardCache = new DashboardCache();

// Enhanced dashboard service with caching and better error handling
export const cachedDashboardService = {
  ...dashboardService,

  async getBuyerDashboard(): Promise<BuyerDashboardResponse> {
    const cacheKey = 'buyer-dashboard';

    // Check for cached error first
    const cachedError = dashboardCache.getError(cacheKey);
    if (cachedError) {
      throw cachedError;
    }

    // Check for cached data
    const cached = dashboardCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await dashboardService.getBuyerDashboard();
      dashboardCache.set(cacheKey, data);
      return data;
    } catch (error) {
      dashboardCache.setError(cacheKey, error);
      throw error;
    }
  },


  async getSellerDashboard(): Promise<SellerDashboardResponse> {
    const cacheKey = 'seller-dashboard';

    const cachedError = dashboardCache.getError(cacheKey);
    if (cachedError) {
      throw cachedError;
    }

    const cached = dashboardCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await dashboardService.getSellerDashboard();
      dashboardCache.set(cacheKey, data);
      return data;
    } catch (error) {
      dashboardCache.setError(cacheKey, error);
      throw error;
    }
  },

  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const cacheKey = 'admin-dashboard';

    const cachedError = dashboardCache.getError(cacheKey);
    if (cachedError) {
      throw cachedError;
    }

    const cached = dashboardCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await dashboardService.getAdminDashboard();
      dashboardCache.set(cacheKey, data);
      return data;
    } catch (error) {
      dashboardCache.setError(cacheKey, error);
      throw error;
    }
  },
};

// Auto-cleanup expired cache entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    dashboardCache.clearExpired();
  }, 10 * 60 * 1000);
}

export default dashboardService;

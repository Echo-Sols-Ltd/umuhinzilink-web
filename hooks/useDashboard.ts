import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  dashboardService,
  cachedDashboardService,
  handleDashboardError,
  dashboardCache
} from '@/services/dashboardService';
import {
  BuyerDashboardData,
  AdminDashboardData,
  NotificationResponse,
  SellerDashboardData,
} from '@/types';

// Union type for all dashboard data
type DashboardData =
  | BuyerDashboardData
  | SellerDashboardData
  | AdminDashboardData

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useDashboard = (useCache = true): UseDashboardReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useCache ? cachedDashboardService : dashboardService;

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      switch (user.role) {
        case UserRole.BUYER:
          response = await service.getBuyerDashboard();
          break;
        case UserRole.SELLER:
          response = await service.getSellerDashboard();
          break;
        
        case UserRole.ADMIN:
          response = await service.getAdminDashboard();
          break;
        default:
          throw new Error(`Unsupported user role: ${user.role}`);
      }

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      const errorResponse = handleDashboardError(err, user.role);
      setError(errorResponse.message);
    } finally {
      setLoading(false);
    }
  }, [user, service]);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  const clearCache = useCallback(() => {
    dashboardCache.clear();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
};

// Hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationResponse['notifications']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await dashboardService.getNotifications();
      setNotifications(response.notifications);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
  };
};





// Hook for custom dashboard metrics
export const useCustomMetrics = (userRole: string, metrics: string[]) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dashboardService.getCustomMetrics(userRole, metrics);
      setData(response);
    } catch (err) {
      setError('Failed to fetch custom metrics');
    } finally {
      setLoading(false);
    }
  }, [userRole, metrics]);

  useEffect(() => {
    if (metrics.length > 0) {
      fetchMetrics();
    }
  }, [fetchMetrics, metrics.length]);

  return {
    data,
    loading,
    error,
    refetch: fetchMetrics,
  };
};

export default useDashboard;

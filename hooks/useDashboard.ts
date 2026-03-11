import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { 
  dashboardService, 
  cachedDashboardService,
  handleDashboardError,
  dashboardCache 
} from '@/services/dashboardService';
import {
  BuyerDashboardData,
  FarmerDashboardData,
  SupplierDashboardData,
  AdminDashboardData,
  GovernmentDashboardData,
  NotificationResponse
} from '@/types';

// Union type for all dashboard data
type DashboardData = 
  | BuyerDashboardData
  | FarmerDashboardData
  | SupplierDashboardData
  | AdminDashboardData
  | GovernmentDashboardData;

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
        case UserType.BUYER:
          response = await service.getBuyerDashboard();
          break;
        case UserType.FARMER:
          response = await service.getFarmerDashboard();
          break;
        case UserType.SUPPLIER:
          response = await service.getSupplierDashboard();
          break;
        case UserType.ADMIN:
          response = await service.getAdminDashboard();
          break;
        case UserType.GOVERNMENT:
          response = await service.getGovernmentDashboard();
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

// Hook for real-time dashboard updates
export const useRealtimeDashboard = (userRole: string) => {
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = dashboardService.subscribeToDashboardUpdates(
      userRole,
      (data) => {
        setRealtimeData(data);
        setIsConnected(true);
      }
    );

    return () => {
      // Cleanup function placeholder
    };
  }, [userRole]);

  return {
    realtimeData,
    isConnected,
  };
};

// Hook for dashboard export functionality
export const useDashboardExport = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (
    userRole: string,
    format: 'pdf' | 'excel' | 'csv'
  ) => {
    setExporting(true);
    setError(null);

    try {
      const blob = await dashboardService.exportDashboardData(userRole, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${userRole}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export dashboard data');
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    exportData,
    exporting,
    error,
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

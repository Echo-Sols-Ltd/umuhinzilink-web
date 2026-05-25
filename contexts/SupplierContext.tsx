import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Supplier, User, UserType } from '@/types';
import { useSupplierAction } from '@/hooks/useSellerAction';
import { userService } from '@/services/users';
import { useProduct } from './ProductContext';
import { useOrder } from './OrderContext';
import { notify } from '@/lib/notify';

interface SupplierContextType {
  supplier: Supplier | null;
  dashboardStats: any;
  loading: boolean;
  error: string | null;
  refreshSupplier: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const SupplierContext = createContext<SupplierContextType | null>(null);

function useSupplier(): SupplierContextType {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
}

function SupplierProvider({ children }: { children: React.ReactNode }) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supplierActions = useSupplierAction();
  const { fetchSupplierProducts, fetchSupplierStats } = useProduct()
  const { fetchSellingOrders: fetchSupplierOrders } = useOrder()

  // Fetch supplier profile
  const refreshSupplier = async () => {
    if (!user || user.role !== UserType.SUPPLIER) return;

    setLoading(true);
    setError(null);
    try {
      const response = await userService.getSupplierMe();
      if (response.success && response.data) {
        setSupplier(response.data);
      } else {
        setError(response.message || 'Failed to fetch supplier profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch supplier profile');
    } finally {
      setLoading(false);
    }
  };



  // Fetch dashboard stats
  const refreshDashboard = async () => {
    if (!user || user.role !== UserType.SUPPLIER) return;

    setLoading(true);
    try {
      const stats = await supplierActions.getDashboardStats();
      setDashboardStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (user: User) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await fetchSupplierProducts()
      await fetchSupplierStats()
      await fetchSupplierOrders()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch farmer data'
      setError(message)
      notify.error(message, 'Error');
    } finally {
      setLoading(false)
    }
  }

  // Initialize data when user changes
  useEffect(() => {
    if (user && user.role === UserType.SUPPLIER) {
      fetchAllData(user)
    }
  }, [user]);

  const value: SupplierContextType = {
    supplier,
    dashboardStats,
    loading,
    error,
    refreshSupplier,
    refreshDashboard,
  };

  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>;
}

export { useSupplier, SupplierProvider };

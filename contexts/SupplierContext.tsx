import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { SupplierProduct, SupplierOrder, Supplier } from '@/types';
import { useSupplierAction } from '@/hooks/useSupplierAction';
import { supplierService } from '@/services/suppliers';

interface SupplierContextType {
  supplier: Supplier | null;
  products: SupplierProduct[];
  orders: SupplierOrder[];
  dashboardStats: any;
  loading: boolean;
  error: string | null;
  refreshSupplier: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
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
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const supplierActions = useSupplierAction();

  // Fetch supplier profile
  const refreshSupplier = async () => {
    if (!user || user.role !== 'SUPPLIER') return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getMe();
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

  // Fetch supplier products
  const refreshProducts = async () => {
    if (!user || user.role !== 'SUPPLIER') return;
    
    setLoading(true);
    try {
      const productsData = await supplierActions.getMyProducts();
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch supplier orders
  const refreshOrders = async () => {
    if (!user || user.role !== 'SUPPLIER') return;
    
    setLoading(true);
    try {
      const ordersData = await supplierActions.getMyOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const refreshDashboard = async () => {
    if (!user || user.role !== 'SUPPLIER') return;
    
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

  // Initialize data when user changes
  useEffect(() => {
    if (user && user.role === 'SUPPLIER') {
      refreshSupplier();
      refreshProducts();
      refreshOrders();
      refreshDashboard();
    } else {
      // Clear data if user is not a supplier
      setSupplier(null);
      setProducts([]);
      setOrders([]);
      setDashboardStats(null);
    }
  }, [user]);

  const value: SupplierContextType = {
    supplier,
    products,
    orders,
    dashboardStats,
    loading,
    error,
    refreshSupplier,
    refreshProducts,
    refreshOrders,
    refreshDashboard,
  };

  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>;
}

export { useSupplier, SupplierProvider };

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { governmentService } from '@/services/government';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { FarmerProduct,SupplierProduct, User, FarmerOrder } from '@/types';

interface GovernmentContextType {
  isValidGovernmentUser: () => boolean;
  startFetchingResources: () => Promise<void>;
  users: User[] | null;
  supplierProducts: SupplierProduct[];
  farmerProducts: FarmerProduct[];
  orders: FarmerOrder[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  userStats: {
    totalUsers: number;
    farmerCount: number;
    buyerCount: number;
    supplierCount: number;
  };
  supplierProductStats: {
    totalProducts: number;
    inStockCount: number;
    outOfStockCount: number;
    lowStockCount: number;
  };
  farmerProductStats: {
    totalProducts: number;
    inStockCount: number;
    outOfStockCount: number;
    lowStockCount: number;
  };
  orderStats: {
    totalOrders: number;
    pendingCount: number;
    completedCount: number;
    cancelledCount: number;
  };
}

const GovernmentContext = createContext<GovernmentContextType | null>(null);

export function GovernmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[]>([]);
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [usersRes, supplierProductsRes, farmerProductsRes, ordersRes] = await Promise.all([
        governmentService.getAllUsers(),
        governmentService.getAllSuppliersProducts(),
        governmentService.getAllFarmersProducts(),
        governmentService.getAllFarmersOrders(),
      ]);

      setUsers(usersRes || []);
      setSupplierProducts(supplierProductsRes || []);
      setFarmerProducts(farmerProductsRes || []);
      setOrders(ordersRes || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch admin data';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh functions
  const refreshUsers = async () => {
    try {
      const usersRes = await governmentService.getAllUsers();
      setUsers(usersRes || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh users';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  const refreshProducts = async () => {
    try {
      const supplierProductsRes = await governmentService.getAllSuppliersProducts();
      const farmerProductsRes = await governmentService.getAllFarmersProducts();
      setSupplierProducts(supplierProductsRes || []);
      setFarmerProducts(farmerProductsRes || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh products';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  const refreshOrders = async () => {
    try {
      const farmerOrdersRes = await governmentService.getAllFarmersOrders();
      // const supplierOrdersRes = await governmentService.getAllSuppliersOrders(); // This seems to be missing from the service
      setOrders(farmerOrdersRes || []);
      // setOrders(supplierOrdersRes || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh orders';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };


  // Calculate stats
  const userStats = {
    totalUsers: users?.length || 0,
    farmerCount: users?.filter(u => u.role === 'FARMER').length || 0,
    buyerCount: users?.filter(u => u.role === 'BUYER').length || 0,
    supplierCount: users?.filter(u => u.role === 'SUPPLIER').length || 0,
  };

  const supplierProductStats = {
    totalProducts: supplierProducts?.length || 0,
    inStockCount: supplierProducts?.filter(p => p.productStatus === 'IN_STOCK').length || 0,
    outOfStockCount: supplierProducts?.filter(p => p.productStatus === 'OUT_OF_STOCK').length || 0,
    lowStockCount: supplierProducts?.filter(p => p.productStatus === 'LOW_STOCK').length || 0,
  };

  const farmerProductStats = {
    totalProducts: farmerProducts?.length || 0,
    inStockCount: farmerProducts?.filter(p => p.productStatus === 'IN_STOCK').length || 0,
    outOfStockCount: farmerProducts?.filter(p => p.productStatus === 'OUT_OF_STOCK').length || 0,
    lowStockCount: farmerProducts?.filter(p => p.productStatus === 'LOW_STOCK').length || 0,
  };

  const orderStats = {
    totalOrders: orders?.length || 0,
    pendingCount: orders?.filter(o => o.status === 'PENDING').length || 0,
    completedCount: orders?.filter(o => o.status === 'COMPLETED').length || 0,
    cancelledCount: orders?.filter(o => o.status === 'CANCELLED').length || 0,
  };

  const isValidGovernmentUser = useCallback(() => {
    if (!user) return false;
    return user.role === 'GOVERNMENT';
  }, [user]);

  const startFetchingResources = useCallback(async () => {
    if (!isValidGovernmentUser()) {
      throw new Error('Unauthorized access');
    }
    await fetchAllData(user!);
  }, [isValidGovernmentUser, fetchAllData, user]);

  return (
    <GovernmentContext.Provider
      value={{
        users,
        supplierProducts,
        farmerProducts,
        orders,
        loading,
        error,
        refreshUsers,
        refreshProducts,
        refreshOrders,
        userStats,
        supplierProductStats,
        farmerProductStats,
        orderStats,
        isValidGovernmentUser,
        startFetchingResources,
      }}
    >
      {children}
    </GovernmentContext.Provider>
  );
}

export function useGovernment() {
  const context = useContext(GovernmentContext);
  if (!context) {
    throw new Error('useGovernment must be used within GovernmentProvider');
  }
  return context;
}

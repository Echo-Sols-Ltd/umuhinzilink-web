'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { adminService } from '@/services/admin';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast-new';
import { FarmerProduct, User, FarmerOrder } from '@/types';

interface AdminContextType {
  users: User[] | null;
  products: FarmerProduct[];
  orders: FarmerOrder[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  userStats: {
    totalUsers: number;
    farmerCount: number;
    buyerCount: number;
    supplierCount: number;
  };
  productStats: {
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
  startFetchingResources: () => Promise<void>;
  isValidAdmin: () => boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[] | null>(null);
  const [products, setProducts] = useState<FarmerProduct[]>([]);
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllProducts(),
        adminService.getAllOrders(),
      ]);

      setUsers(usersRes || []);
      setProducts(productsRes || []);
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

      const usersRes = await adminService.getAllUsers();
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
      const productsRes = await adminService.getAllProducts();
      setProducts(productsRes || []);
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
      const ordersRes = await adminService.getAllOrders();
      setOrders(ordersRes || []);
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

  // Delete functions
  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users?.filter(u => u.id !== userId) || null);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'success',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await adminService.deleteProduct(productId);
      setProducts(products?.filter(p => p.id !== productId) || null);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
        variant: 'success',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await adminService.deleteOrder(orderId);
      setOrders(orders?.filter(o => o.id !== orderId) || null);
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
        variant: 'success',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
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

  const productStats = {
    totalProducts: products?.length || 0,
    inStockCount: products?.filter(p => p.productStatus === 'IN_STOCK').length || 0,
    outOfStockCount: products?.filter(p => p.productStatus === 'OUT_OF_STOCK').length || 0,
    lowStockCount: products?.filter(p => p.productStatus === 'LOW_STOCK').length || 0,
  };

  const orderStats = {
    totalOrders: orders?.length || 0,
    pendingCount: orders?.filter(o => o.status === 'PENDING').length || 0,
    completedCount: orders?.filter(o => o.status === 'COMPLETED').length || 0,
    cancelledCount: orders?.filter(o => o.status === 'CANCELLED').length || 0,
  };

  const startFetchingResources = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized access');
    }
    await fetchAllData(user);
  }, [user, fetchAllData]);

  const isValidAdmin = useCallback(() => {
    
    if (!user) return false
    return user.role === 'ADMIN';
  }, [user]);

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) fetchAllData(user);
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        users,
        products,
        orders,
        loading,
        error,
        refreshUsers,
        refreshProducts,
        refreshOrders,
        deleteUser,
        deleteProduct,
        deleteOrder,
        userStats,
        productStats,
        orderStats,
        startFetchingResources,
        isValidAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

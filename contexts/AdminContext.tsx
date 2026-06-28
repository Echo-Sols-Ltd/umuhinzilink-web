'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { adminService } from '@/services/admin';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';
import { Product, User, Order, Transaction, PaginatedResponse, Wallet, UserRole, ProductStatus, OrderStatus, isUnpaidOrder } from '@/types';

interface AdminContextType {
  users: PaginatedResponse<User[]> | null;
  systemWallet: Wallet | null
  transactions: Transaction[]
  products: Product[]; // Aggregate for dashboard/generic views
  orders: Order[]; // Aggregate for dashboard/generic views
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
    sellerCount: number;
    buyerCount: number;
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
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<PaginatedResponse<User[]> | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemWallet, setSystemWallet] = useState<Wallet | null>(null);

  const toList = <T,>(r: { data?: T[]; content?: T[] }): T[] =>
    Array.isArray((r as { content?: T[] }).content) ? (r as { content: T[] }).content : (Array.isArray(r.data) ? r.data : []);

  // Fetch all data
  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [usersRes, ProductsRes, ordersRes, transactionsRes, sysWallet] = await Promise.all([
        adminService.getAllUsers(0, 20),
        adminService.getAllProducts(0, 50),
        adminService.getAllOrders(0, 50),
        adminService.getTransactionMonitoring(0, 50),
        adminService.getSystemWallet()
      ]);

      setTransactions(toList(transactionsRes));
      setUsers(usersRes ?? null);
      setProducts(toList(ProductsRes));
      setOrders(toList(ordersRes));
      setSystemWallet(sysWallet)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch admin data';
      setError(message);
      notify.error(message, 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh functions
  const refreshUsers = async () => {
    try {

      const usersRes = await adminService.getAllUsers(0, 20);
      setUsers(usersRes || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh users';
      setError(message);
      notify.error(message, 'Error');
    }
  };

  const refreshProducts = async () => {
    try {
      const response = await adminService.getAllProducts(0, 50)
      setProducts(toList(response));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh products';
      setError(message);
      notify.error(message, 'Error');
    }
  };

  const refreshOrders = async () => {
    try {
      const orders = await adminService.getAllOrders(0, 50)
      setOrders(toList(orders));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh orders';
      setError(message);
      notify.error(message, 'Error');
    }
  };

  // Delete functions
  const deleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users && users.data ? { ...users, data: users.data.filter(u => u.id !== userId) } : null);
      notify.success('User deleted successfully', 'Success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      notify.error(message, 'Error');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await adminService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      notify.success('Product deleted successfully', 'Success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      notify.error(message, 'Error');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await adminService.deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      notify.success('Order deleted successfully', 'Success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      notify.error(message, 'Error');
    }
  };

  const userStats = {
    totalUsers: users?.data?.length || 0,
    buyerCount: users?.data?.filter(u => u.role === UserRole.BUYER).length || 0,
    sellerCount: users?.data?.filter(u => u.role === UserRole.SELLER).length || 0,
  };

  const productStats = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.status === ProductStatus.IN_STOCK).length,
    outOfStockCount: products.filter(p => p.status === ProductStatus.OUT_OF_STOCK).length,
    lowStockCount: products.filter(p => p.status === ProductStatus.LOW_STOCK).length,
  };

  const orderStats = {
    totalOrders: orders.length,
    pendingCount: orders.filter(o => isUnpaidOrder(o.status)).length,
    completedCount: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
    cancelledCount: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
  };

  const startFetchingResources = useCallback(async () => {
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized access');
    }
    await fetchAllData(user);
  }, [user, fetchAllData]);



  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user) fetchAllData(user);
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        transactions,
        systemWallet,
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

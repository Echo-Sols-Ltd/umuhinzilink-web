'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { adminService } from '@/services/admin';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';
import { Product, User, Order, WalletTransactionDTO, PaginatedResponse, WalletDTO } from '@/types';

interface AdminContextType {
  users: PaginatedResponse<User[]> | null;
  farmerProducts: Product[];
  supplierProducts: Product[];
  farmerOrders: Order[];
  supplierOrders: Order[];
  systemWallet: WalletDTO | null
  systemTransactions: WalletTransactionDTO[]
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
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<PaginatedResponse<User[]> | null>(null);
  const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [farmerOrders, setFarmerOrders] = useState<Order[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<Order[]>([]);
  const [systemTransactions, setSystemTransactions] = useState<WalletTransactionDTO[]>([])
  // Derived state for backward compatibility or aggregation
  const products = [...farmerProducts, ...supplierProducts];
  const orders = [...farmerOrders, ...supplierOrders];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemWallet, setSystemWallet] = useState<WalletDTO | null>(null);

  const toList = <T,>(r: { data?: T[]; content?: T[] }): T[] =>
    Array.isArray((r as { content?: T[] }).content) ? (r as { content: T[] }).content : (Array.isArray(r.data) ? r.data : []);

  // Fetch all data
  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [usersRes, farmerProductsRes, supplierProductsRes, farmerOrdersRes, supplierOrdersRes, transactionsRes, sysWallet] = await Promise.all([
        adminService.getAllUsers(0, 4),
        adminService.getAllFarmerProducts(0, 50),
        adminService.getAllSupplierProducts(0, 50),
        adminService.getAllFarmerOrders(0, 50),
        adminService.getAllSupplierOrders(0, 50),
        adminService.getTransactionMonitoring(0, 50),
        adminService.getSystemWallet()
      ]);

      setSystemTransactions(toList(transactionsRes));
      setUsers(usersRes ?? null);
      setFarmerProducts(toList(farmerProductsRes));
      setSupplierProducts(toList(supplierProductsRes));
      setFarmerOrders(toList(farmerOrdersRes));
      setSupplierOrders(toList(supplierOrdersRes));
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

      const usersRes = await adminService.getAllUsers(0, 4);
      setUsers(usersRes || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh users';
      setError(message);
      notify.error(message, 'Error');
    }
  };

  const refreshProducts = async () => {
    try {
      const [farmerRes, supplierRes] = await Promise.all([
        adminService.getAllFarmerProducts(0, 50),
        adminService.getAllSupplierProducts(0, 50)
      ]);
      setFarmerProducts(toList(farmerRes));
      setSupplierProducts(toList(supplierRes));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh products';
      setError(message);
      notify.error(message, 'Error');
    }
  };

  const refreshOrders = async () => {
    try {
      const [farmerRes, supplierRes] = await Promise.all([
        adminService.getAllFarmerOrders(0, 50),
        adminService.getAllSupplierOrders(0, 50)
      ]);
      setFarmerOrders(toList(farmerRes));
      setSupplierOrders(toList(supplierRes));
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
      setFarmerProducts(farmerProducts.filter(p => p.id !== productId));
      setSupplierProducts(supplierProducts.filter(p => p.id !== productId));
      notify.success('Product deleted successfully', 'Success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      notify.error(message, 'Error');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await adminService.deleteOrder(orderId);
      setFarmerOrders(farmerOrders.filter(o => o.id !== orderId));
      setSupplierOrders(supplierOrders.filter(o => o.id !== orderId));
      notify.success('Order deleted successfully', 'Success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      notify.error(message, 'Error');
    }
  };

  const userStats = {
    totalUsers: users?.data?.length || 0,
    farmerCount: users?.data?.filter(u => u.role === 'FARMER').length || 0,
    buyerCount: users?.data?.filter(u => u.role === 'BUYER').length || 0,
    supplierCount: users?.data?.filter(u => u.role === 'SUPPLIER').length || 0,
  };

  const productStats = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.productStatus === 'IN_STOCK').length,
    outOfStockCount: products.filter(p => p.productStatus === 'OUT_OF_STOCK').length,
    lowStockCount: products.filter(p => p.productStatus === 'LOW_STOCK').length,
  };

  const orderStats = {
    totalOrders: orders.length,
    pendingCount: orders.filter(o => o.status === 'PENDING').length,
    completedCount: orders.filter(o => o.status === 'COMPLETED').length,
    cancelledCount: orders.filter(o => o.status === 'CANCELLED').length,
  };

  const startFetchingResources = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') {
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
        systemTransactions,
        systemWallet,
        users,
        farmerProducts,
        supplierProducts,
        farmerOrders,
        supplierOrders,
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

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { orderService } from '@/services/orders';
import { FarmerOrder, SupplierOrder, OrderStatus, FarmerProduct, DeliveryStatus } from '@/types';
import type { OrderRequest } from '@/types/request';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { useWallet } from './WalletContext';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEYS = {
  BUYER: 'buyerOrders',
  FARMER: 'farmerOrders',
  SUPPLIER: 'supplierOrders',
  FARMER_BUYER: 'farmerBuyerOrders',
};

export type OrderContextValue = {
  loading: boolean;
  error?: string | null;
  buyerOrders: FarmerOrder[] | null;
  farmerOrders: FarmerOrder[] | null;
  supplierOrders: SupplierOrder[] | null;
  farmerBuyerOrders: SupplierOrder[] | null;

  currentFarmerOrder: FarmerOrder | null;
  currentBuyerOrder: FarmerOrder | null;
  currentSupplierOrder: SupplierOrder | null;
  currentFarmerBuyerOrder: SupplierOrder | null;
  currentProduct: FarmerProduct | null;

  setCurrentFarmerOrder: (order: FarmerOrder | null) => void;
  setCurrentSupplierOrder: (order: SupplierOrder | null) => void;
  setCurrentFarmerBuyerOrder: (order: SupplierOrder | null) => void;
  setCurrentBuyerOrder: (order: FarmerOrder | null) => void;

  setCurrentProduct: (product: FarmerProduct | null) => void;

  addFarmerOrder: (data: FarmerOrder) => void;
  addFarmerBuyerOrder: (data: SupplierOrder) => void;

  editFarmerOrder: (data: FarmerOrder) => void;
  editFarmerBuyerOrder: (data: SupplierOrder) => void;
  editSupplierOrder: (data: SupplierOrder) => void;

  updateFarmerOrderStatus: (id: string, status: DeliveryStatus) => Promise<void>;
  updateSupplierOrderStatus: (id: string, status: DeliveryStatus) => Promise<SupplierOrder | null>;

  createFarmerOrder: (payload: OrderRequest) => Promise<void>;
  createSupplierOrder: (payload: OrderRequest) => Promise<void>;
  acceptFarmerOrder: (id: string) => Promise<FarmerOrder | null>;
  acceptSupplierOrder: (id: string) => Promise<SupplierOrder | null>;
  cancelFarmerOrder: (id: string) => Promise<FarmerOrder | null>;
  cancelSupplierOrder: (id: string) => Promise<SupplierOrder | null>;
  processOrderPayment: (orderId: string, paymentMethod?: unknown) => Promise<unknown>;

  mutationLoading: boolean;

  fetchBuyerOrders: () => Promise<FarmerOrder[] | null>;
  fetchFarmerOrders: () => Promise<FarmerOrder[] | null>;
  fetchSupplierOrders: () => Promise<SupplierOrder[] | null>;
  fetchFarmerBuyerOrders: () => Promise<SupplierOrder[] | null>;

  // Derived order states
  pendingBuyerOrders: FarmerOrder[];
  completedBuyerOrders: FarmerOrder[];
  cancelledBuyerOrders: FarmerOrder[];
  activeBuyerOrders: FarmerOrder[];

  pendingFarmerOrders: FarmerOrder[];
  completedFarmerOrders: FarmerOrder[];
  cancelledFarmerOrders: FarmerOrder[];
  activeFarmerOrders: FarmerOrder[];

  pendingSupplierOrders: SupplierOrder[];
  completedSupplierOrders: SupplierOrder[];
  cancelledSupplierOrders: SupplierOrder[];
  activeSupplierOrders: SupplierOrder[];

  pendingFarmerBuyerOrders: SupplierOrder[];
  completedFarmerBuyerOrders: SupplierOrder[];
  cancelledFarmerBuyerOrders: SupplierOrder[];
  activeFarmerBuyerOrders: SupplierOrder[];
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { updateBuyerProduct } = useProduct();
  const { payOrder: payWithWallet } = useWallet();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);

  const [buyerOrders, setBuyerOrders] = useState<FarmerOrder[] | null>(null);
  const [farmerOrders, setFarmerOrders] = useState<FarmerOrder[] | null>(null);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[] | null>(null);
  const [farmerBuyerOrders, setFarmerBuyerOrders] = useState<SupplierOrder[] | null>(null);

  const [currentFarmerOrder, setCurrentFarmerOrder] = useState<FarmerOrder | null>(null);
  const [currentSupplierOrder, setCurrentSupplierOrder] = useState<SupplierOrder | null>(null);
  const [currentFarmerBuyerOrder, setCurrentFarmerBuyerOrder] = useState<SupplierOrder | null>(
    null
  );
  const [currentBuyerOrder, setCurrentBuyerOrder] = useState<FarmerOrder | null>(null);
  const [currentProduct, setCurrentProduct] = useState<FarmerProduct | null>(null);


  // 🔹 Fetch Buyer Orders
  const fetchBuyerOrders = async (): Promise<FarmerOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getBuyerOrders();
      if (!res.success) {
        return null;
      }
      setBuyerOrders(res.data ?? null);
      localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(res.data ?? []));
      return res.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Farmer Orders
  const fetchFarmerOrders = async (): Promise<FarmerOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getFarmerOrders();
      if (!res.success) {
        return null;
      }
      setFarmerOrders(res.data ?? null);
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(res.data ?? []));
      return res.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Supplier Orders
  const fetchSupplierOrders = async (): Promise<SupplierOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getSupplierOrders();
      if (!res.success) {
        return null;
      }
      setSupplierOrders(res.data ?? null);
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(res.data ?? []));
      return res.data ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Farmer Buyer Orders
  const fetchFarmerBuyerOrders = async (): Promise<SupplierOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getFarmerBuyerOrders();
      if (!res.success) {
        return null;
      }
      setFarmerBuyerOrders(res.data ?? null);
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(res.data ?? []));
      return res.data ?? null;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addFarmerOrder = (data: FarmerOrder) => {
    setBuyerOrders(prev => {
      const updated = prev ? [data, ...prev] : [data];
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
      return updated;
    });
    updateBuyerProduct(data.product.id, data.product);
    setCurrentBuyerOrder(data);
  };

  const addFarmerBuyerOrder = (data: SupplierOrder) => {
    setFarmerBuyerOrders(prev => {
      const updated = prev ? [data, ...prev] : [data];
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
      return updated;
    });
    setCurrentFarmerBuyerOrder(data);
  };

  const editFarmerOrder = (data: FarmerOrder) => {
    setFarmerOrders(prev => {
      const updated = prev?.map(order => (order.id === data.id ? data : order)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
      return updated;
    });
    setCurrentFarmerOrder(data);
  };

  const editSupplierOrder = (data: SupplierOrder) => {
    setSupplierOrders(prev => {
      const updated = prev?.map(order => (order.id === data.id ? data : order)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
      return updated;
    });
    setCurrentSupplierOrder(data);
  };

  const editFarmerBuyerOrder = (data: SupplierOrder) => {
    setFarmerBuyerOrders(prev => {
      const updated = prev?.map(order => (order.id === data.id ? data : order)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
      return updated;
    });
    setCurrentFarmerBuyerOrder(data);
  };

  const updateFarmerOrderStatus = async (id: string, status: DeliveryStatus) => {
    try {
      setMutationLoading(true);
      const response = await orderService.updateFarmerOrderStatus(id, status);
      if (response.success && response.data) {
        setFarmerOrders(prev => {
          if (!prev) return prev;
          const updated = prev.map(order =>
            order.id === id ? { ...order, ...response.data } : order
          );
          localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
          return updated;
        });
        setCurrentFarmerOrder(prev =>
          prev?.id === id ? { ...prev, ...response.data } : prev
        );
        toast({ title: 'Order status updated successfully', description: 'Delivery status has been updated.', variant: 'success' });
      } else {
        toast({ title: 'Failed to update order status', description: response.message || 'Failed to update', variant: 'error' });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update farmer order status';
      toast({ title: 'Failed to update order status', description: msg, variant: 'error' });
      throw error;
    } finally {
      setMutationLoading(false);
    }
  };

  const createFarmerOrder = async (payload: OrderRequest) => {
    try {
      setMutationLoading(true);
      const res = await orderService.createFarmerOrder(payload);
      if (!res.success) {
        toast({ title: 'Failed to create order', description: res.message || 'Failed to create order', variant: 'error' });
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        toast({ title: 'Failed to create order', description: 'Failed to create order: empty response', variant: 'error' });
        return;
      }
      addFarmerOrder(newOrder);
      toast({ title: 'Order created successfully', description: 'Initiating payment...', variant: 'success' });
      const paymentRes = await payWithWallet(newOrder.id, 'Order Payment');
      if (paymentRes?.status === 'COMPLETED') {
        // Order already updated via addFarmerOrder
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      toast({ title: 'Failed to create order', description: msg, variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const createSupplierOrder = async (payload: OrderRequest) => {
    try {
      setMutationLoading(true);
      const res = await orderService.createSupplierOrder(payload);
      if (!res.success) {
        toast({ title: 'Failed to create order', description: res.message || 'Failed to create order', variant: 'error' });
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        toast({ title: 'Failed to create order', description: 'Failed to create order: empty response', variant: 'error' });
        return;
      }
      addFarmerBuyerOrder(newOrder);
      toast({ title: 'Order created successfully', description: 'Initiating payment...', variant: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      toast({ title: 'Failed to create order', description: msg, variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const acceptFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setMutationLoading(true);
      const res = await orderService.acceptFarmerOrder(id);
      if (!res.success) {
        toast({ title: 'Failed to accept order', description: res.message || 'Failed to accept order', variant: 'error' });
        return null;
      }
      const updated = res.data;
      if (!updated) {
        toast({ title: 'Failed to accept order', description: 'Empty response', variant: 'error' });
        return null;
      }
      editFarmerOrder(updated);
      toast({ title: 'Order accepted successfully', description: 'The order has been accepted.', variant: 'success' });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order';
      toast({ title: 'Failed to accept order', description: msg, variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  const acceptSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setMutationLoading(true);
      const res = await orderService.acceptSupplierOrder(id);
      if (!res.success) {
        toast({ title: 'Failed to accept order', description: res.message || 'Failed to accept order', variant: 'error' });
        return null;
      }
      const updated = res.data;
      if (!updated) {
        toast({ title: 'Failed to accept order', description: 'Empty response', variant: 'error' });
        return null;
      }
      editSupplierOrder(updated);
      toast({ title: 'Order accepted successfully', description: 'The order has been accepted.', variant: 'success' });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order';
      toast({ title: 'Failed to accept order', description: msg, variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  const cancelFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setMutationLoading(true);
      const res = await orderService.cancelFarmerOrder(id);
      if (!res.success) {
        toast({ title: 'Failed to cancel order', description: res.message || 'Failed to cancel order', variant: 'error' });
        return null;
      }
      const updated = res.data;
      if (!updated) {
        toast({ title: 'Failed to cancel order', description: 'Empty response', variant: 'error' });
        return null;
      }
      editFarmerOrder(updated);
      toast({ title: 'Order cancelled successfully', description: 'The order has been cancelled.', variant: 'success' });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order';
      toast({ title: 'Failed to cancel order', description: msg, variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  const cancelSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setMutationLoading(true);
      const res = await orderService.cancelSupplierOrder(id);
      if (!res.success) {
        toast({ title: 'Failed to cancel order', description: res.message || 'Failed to cancel order', variant: 'error' });
        return null;
      }
      const updated = res.data;
      if (!updated) {
        toast({ title: 'Failed to cancel order', description: 'Empty response', variant: 'error' });
        return null;
      }
      editSupplierOrder(updated);
      toast({ title: 'Order cancelled successfully', description: 'The order has been cancelled.', variant: 'success' });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order';
      toast({ title: 'Failed to cancel order', description: msg, variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  const updateSupplierOrderStatus = async (id: string, status: DeliveryStatus): Promise<SupplierOrder | null> => {
    try {
      setMutationLoading(true);
      const res = await orderService.updateSupplierOrderStatus(id, status);
      if (!res.success) {
        toast({ title: 'Failed to update order status', description: res.message || 'Failed to update order status', variant: 'error' });
        return null;
      }
      const updated = res.data;
      if (!updated) {
        toast({ title: 'Failed to update order status', description: 'Empty response', variant: 'error' });
        return null;
      }
      editSupplierOrder(updated);
      toast({ title: 'Order status updated successfully', description: 'Delivery status has been updated.', variant: 'success' });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order status';
      toast({ title: 'Failed to update order status', description: msg, variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  const processOrderPayment = async (orderId: string, _paymentMethod?: unknown): Promise<unknown> => {
    try {
      setMutationLoading(true);
      toast({ title: 'Wallet Payment', description: 'Processing payment from your wallet...', variant: 'loading' });
      const res = await payWithWallet(orderId, 'Order Payment');
      if (res && (res as { status?: string }).status === 'COMPLETED') {
        await fetchFarmerBuyerOrders();
        return res;
      }
      return null;
    } catch {
      toast({ title: 'Payment error', description: 'An error occurred while processing your payment.', variant: 'error' });
      return null;
    } finally {
      setMutationLoading(false);
    }
  };

  // 🔹 Derived Orders
  const pendingBuyerOrders = useMemo(
    () => buyerOrders?.filter(o => o.status === OrderStatus.PENDING) || [],
    [buyerOrders]
  );
  const completedBuyerOrders = useMemo(
    () => buyerOrders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [buyerOrders]
  );
  const cancelledBuyerOrders = useMemo(
    () => buyerOrders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [buyerOrders]
  );
  const activeBuyerOrders = useMemo(
    () => buyerOrders?.filter(o => o.status === OrderStatus.ACTIVE) || [],
    [buyerOrders]
  );

  const pendingFarmerOrders = useMemo(
    () => farmerOrders?.filter(o => o.status === OrderStatus.PENDING) || [],
    [farmerOrders]
  );
  const completedFarmerOrders = useMemo(
    () => farmerOrders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [farmerOrders]
  );
  const cancelledFarmerOrders = useMemo(
    () => farmerOrders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [farmerOrders]
  );
  const activeFarmerOrders = useMemo(
    () => farmerOrders?.filter(o => o.status === OrderStatus.ACTIVE) || [],
    [farmerOrders]
  );

  const pendingSupplierOrders = useMemo(
    () => supplierOrders?.filter(o => o.status === OrderStatus.PENDING) || [],
    [supplierOrders]
  );
  const completedSupplierOrders = useMemo(
    () => supplierOrders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [supplierOrders]
  );
  const cancelledSupplierOrders = useMemo(
    () => supplierOrders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [supplierOrders]
  );
  const activeSupplierOrders = useMemo(
    () => supplierOrders?.filter(o => o.status === OrderStatus.ACTIVE) || [],
    [supplierOrders]
  );

  const pendingFarmerBuyerOrders = useMemo(
    () => farmerBuyerOrders?.filter(o => o.status === OrderStatus.PENDING) || [],
    [farmerBuyerOrders]
  );
  const completedFarmerBuyerOrders = useMemo(
    () => farmerBuyerOrders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [farmerBuyerOrders]
  );
  const cancelledFarmerBuyerOrders = useMemo(
    () => farmerBuyerOrders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [farmerBuyerOrders]
  );
  const activeFarmerBuyerOrders = useMemo(
    () => farmerBuyerOrders?.filter(o => o.status === OrderStatus.ACTIVE) || [],
    [farmerBuyerOrders]
  );

  const value: OrderContextValue = {
    loading,
    buyerOrders,
    farmerOrders,
    supplierOrders,
    farmerBuyerOrders,
    currentFarmerOrder,
    currentBuyerOrder,
    currentSupplierOrder,
    currentFarmerBuyerOrder,
    currentProduct,
    setCurrentFarmerOrder,
    setCurrentSupplierOrder,
    setCurrentBuyerOrder,
    setCurrentFarmerBuyerOrder,
    setCurrentProduct,
    addFarmerOrder,
    addFarmerBuyerOrder,
    editFarmerOrder,
    editSupplierOrder,
    editFarmerBuyerOrder,
    updateFarmerOrderStatus,
    updateSupplierOrderStatus,
    createFarmerOrder,
    createSupplierOrder,
    acceptFarmerOrder,
    acceptSupplierOrder,
    cancelFarmerOrder,
    cancelSupplierOrder,
    processOrderPayment,
    mutationLoading,
    fetchBuyerOrders,
    fetchFarmerOrders,
    fetchSupplierOrders,
    fetchFarmerBuyerOrders,
    pendingBuyerOrders,
    completedBuyerOrders,
    cancelledBuyerOrders,
    activeBuyerOrders,
    pendingFarmerOrders,
    completedFarmerOrders,
    cancelledFarmerOrders,
    activeFarmerOrders,
    pendingSupplierOrders,
    completedSupplierOrders,
    cancelledSupplierOrders,
    activeSupplierOrders,
    pendingFarmerBuyerOrders,
    completedFarmerBuyerOrders,
    cancelledFarmerBuyerOrders,
    activeFarmerBuyerOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return ctx;
}

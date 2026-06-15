import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '@/services/orders';
import { Order, OrderStatus, Product, UserRole, isUnpaidOrder } from '@/types';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { socketService } from '@/services/socket';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';

type OrderContextValue = {
  loading: boolean;
  error?: string | null;
  orders: Order[]

  currentOrder: Order | null;
  currentProduct: Product | null;

  setCurrentOrder: (order: Order | null) => void;
  setCurrentProduct: (product: Product | null) => void;

  addOrder: (data: Order) => void;
  updateOrder: (data: Order) => void;

  // State management functions
  setMutationLoading: (loading: boolean) => void;
  mutationLoading: boolean;

  fetchBuyingOrders: (page?: number, size?: number) => Promise<Order[] | null>;
  fetchSellingOrders: (page?: number, size?: number) => Promise<Order[] | null>;

  ordersTotalPages: number;
  ordersTotalElements: number;

  // Derived order states
  pendingBuyingOrders: Order[];
  completedBuyingOrders: Order[];
  cancelledBuyingOrders: Order[];
  activeBuyingOrders: Order[];

  pendingSellingOrders: Order[];
  completedSellingOrders: Order[];
  cancelledSellingOrders: Order[];
  activeSellingOrders: Order[];
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { updateProductState } = useProduct();
  const { showNotification } = useBrowserNotification();
  const currentOrderIdRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [mutationLoadingState, setMutationLoadingState] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotalPages, setOrdersTotalPages] = useState(0);
  const [ordersTotalElements, setOrdersTotalElements] = useState(0);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    currentOrderIdRef.current = currentOrder?.id ?? null;
  }, [currentOrder?.id]);

  const fetchBuyingOrders = async (page = 0, size = 10): Promise<Order[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getBuyerOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      setOrders(Array.isArray(list) ? list : []);
      setOrdersTotalPages(res.totalPages ?? 0);
      setOrdersTotalElements(res.totalElements ?? 0);
      return Array.isArray(list) ? list : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSellingOrders = async (page = 0, size = 10): Promise<Order[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getSellerOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      setOrders(Array.isArray(list) ? list : []);
      setOrdersTotalPages(res.totalPages ?? 0);
      setOrdersTotalElements(res.totalElements ?? 0);
      return Array.isArray(list) ? list : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.BUYER) fetchBuyingOrders(0, 10)
      if (user.role === UserRole.SELLER) fetchSellingOrders(0, 10)
    }
  }, [user])

  const addOrder = useCallback((data: Order) => {
    setOrders(prev => {
      const updated = prev ? [data, ...prev] : [data];
      return updated;
    });
    updateProductState(data.product.id, data.product);
    setCurrentOrder(data);
  }, [updateProductState]);

  const updateOrder = useCallback((data: Order) => {
    const updater = (prev: Order[] | null) => {
      if (!prev) return [data];
      return prev.map(order => (order.id === data.id ? data : order));
    };
    setOrders(updater);
    if (currentOrder?.id === data.id) setCurrentOrder(data);
  }, [currentOrder]);


  const setMutationLoading = (loading: boolean) => {
    setMutationLoadingState(loading);
  };


  // Real-time order updates via WebSocket
  useEffect(() => {
    if (!user) return;

    const ordersPath = user.role === UserRole.SELLER ? '/farmer/orders' : '/orders';

    const unsubscribe = socketService.onOrderUpdate((response) => {
      const data = response.data;
      if (!data) return;

      setOrders(prev => {
        const list = prev ?? [];
        const exists = list.some(o => o.id === data.id);
        if (exists) return list.map(o => (o.id === data.id ? data : o));
        return [data, ...list];
      });

      if (currentOrderIdRef.current === data.id) {
        setCurrentOrder(data);
      }

      if (data.product?.id) {
        updateProductState(data.product.id, data.product);
      }

      showNotification({
        type: 'order',
        title: response.message || 'Order update',
        body: response.message || `Order for ${data.product?.name ?? 'product'} updated`,
        icon: data.product?.image,
        onClick: () => { window.location.href = ordersPath; },
      });
    });

    return unsubscribe;
  }, [user, updateProductState, showNotification]);

  // 🔹 Derived Orders
  const pendingBuyingOrders = useMemo(
    () => orders?.filter(o => isUnpaidOrder(o.status)) || [],
    [orders]
  );
  const completedBuyingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [orders]
  );
  const cancelledBuyingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [orders]
  );
  const activeBuyingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [orders]
  );

  const pendingSellingOrders = useMemo(
    () => orders?.filter(o => isUnpaidOrder(o.status)) || [],
    [orders]
  );
  const completedSellingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [orders]
  );
  const cancelledSellingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.CANCELLED) || [],
    [orders]
  );
  const activeSellingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.COMPLETED) || [],
    [orders]
  );


  const value: OrderContextValue = {
    loading,
    orders,
    currentOrder,
    currentProduct,
    setCurrentOrder,
    setCurrentProduct,
    addOrder,
    updateOrder,
    setMutationLoading,
    mutationLoading: mutationLoadingState,
    fetchBuyingOrders,
    fetchSellingOrders,
    ordersTotalPages,
    ordersTotalElements,
    pendingBuyingOrders,
    completedBuyingOrders,
    cancelledBuyingOrders,
    activeBuyingOrders,
    pendingSellingOrders,
    completedSellingOrders,
    cancelledSellingOrders,
    activeSellingOrders,
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

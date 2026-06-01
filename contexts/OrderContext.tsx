import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orders';
import { Order, OrderStatus, Product, SocketResponse, UserRole } from '@/types';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { useSocket } from './SocketContext';
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
  const socket = useSocket()
  const { isEnabled, showNotification } = useBrowserNotification();

  const [loading, setLoading] = useState(false);
  const [mutationLoadingState, setMutationLoadingState] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotalPages, setOrdersTotalPages] = useState(0);
  const [ordersTotalElements, setOrdersTotalElements] = useState(0);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

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


  // Helper to update socket orders
  const handleOrderChange = useCallback((order: Order) => {
    const orderId = order.id;
    const updater = (prev: Order[]) => {
      if (!prev) return prev;
      return prev.map(o => o.id === orderId ? order : o);
    };

    setOrders(updater);

    if (currentOrder?.id === orderId) setCurrentOrder(order);
  }, [currentOrder]);


  // Socket event handlers
  const handleNewOrder = useCallback((response: SocketResponse<Order>) => {
    // Add null check to prevent undefined errors
    const data = response.data
    if (!data) {
      console.error('Order change data is undefined');
      return;
    }

    // Show notification for new order
    showNotification({
      type: 'order',
      title: 'New Order Received',
      body: response.message,
      icon: data.product.image,
      onClick: () => {
        // Navigate to orders page
        window.location.href = '/farmer/orders';
      },
    });

    // Notify triggers in-app notification context automatically from showNotification

    // For new orders, we need to refresh appropriate list since we don't have full order data
    // This is a limitation of the current socket event structure
    // In a real implementation, you might want to fetch the full order or have the socket send complete order data
    fetchBuyingOrders();
    fetchSellingOrders();
  }, [isEnabled, showNotification, fetchBuyingOrders, fetchSellingOrders]);

  const handleOrderStatusChange = useCallback((response: SocketResponse<Order>) => {
    const data = response.data;
    if (!data) return;

    if (isEnabled) {
      showNotification({
        type: 'order',
        title: 'Order Status Updated',
        body: response.message,
        icon: '/icons/order.svg',
        onClick: () => {
          window.location.href = '/farmer/orders';
        },
      });
    }
    handleOrderChange(data);
  }, [isEnabled, showNotification, handleOrderChange]); const handleOrderDeliveryChange = useCallback((response: SocketResponse<Order>) => {
    const data = response.data;
    if (!data) return;

    showNotification({
      type: 'delivery',
      title: 'Delivery Status Updated',
      body: `Your order delivery was updated`,
      icon: '/icons/delivery.svg',
      onClick: () => {
        window.location.href = '/farmer/delivery';
      },
    });

    handleOrderChange(data);
  }, [showNotification, handleOrderChange]);



  // 🔹 Derived Orders
  const pendingBuyingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.PENDING) || [],
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
    () => orders?.filter(o => o.status === OrderStatus.CONFIRMED) || [],
    [orders]
  );

  const pendingSellingOrders = useMemo(
    () => orders?.filter(o => o.status === OrderStatus.PENDING) || [],
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
    () => orders?.filter(o => o.status === OrderStatus.CONFIRMED) || [],
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

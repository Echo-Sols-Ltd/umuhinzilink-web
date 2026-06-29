import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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
  const prevUserIdRef = useRef<string | undefined>(undefined);
  const prevUserRoleRef = useRef<UserRole | undefined>(undefined);
  const showNotificationRef = useRef(showNotification);

  const userId = user?.id;
  const userRole = user?.role;

  useEffect(() => {
    showNotificationRef.current = showNotification;
  }, [showNotification]);

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

  const fetchBuyingOrders = useCallback(async (page = 0, size = 10): Promise<Order[] | null> => {
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
  }, []);

  const fetchSellingOrders = useCallback(async (page = 0, size = 10): Promise<Order[] | null> => {
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
  }, []);

  const clearOrderState = useCallback(() => {
    setOrders([]);
    setOrdersTotalPages(0);
    setOrdersTotalElements(0);
    setCurrentOrder(null);
    setCurrentProduct(null);
    setLoading(false);
    setMutationLoadingState(false);
  }, []);

  // Warm cache for profile / navbar — only when the signed-in user or role changes
  useEffect(() => {
    const previousUserId = prevUserIdRef.current;
    const previousUserRole = prevUserRoleRef.current;
    prevUserIdRef.current = userId;
    prevUserRoleRef.current = userRole;

    if (!userId) {
      if (previousUserId !== undefined) {
        clearOrderState();
      }
      return;
    }

    const userChanged = previousUserId !== userId;
    const roleChanged = previousUserRole !== userRole;

    if (userChanged || roleChanged) {
      if (previousUserId !== undefined || previousUserRole !== undefined) {
        clearOrderState();
      }

      if (userRole === UserRole.BUYER) fetchBuyingOrders(0, 10);
      else if (userRole === UserRole.SELLER) fetchSellingOrders(0, 10);
    }
  }, [userId, userRole, fetchBuyingOrders, fetchSellingOrders, clearOrderState]);

  const addOrder = useCallback((data: Order) => {
    setOrders(prev => [data, ...prev]);
    if (data.product?.id) {
      updateProductState(data.product.id, data.product);
    }
    setCurrentOrder(data);
  }, [updateProductState]);

  const updateOrder = useCallback((data: Order) => {
    setOrders(prev => prev.map(order => (order.id === data.id ? data : order)));
    if (currentOrderIdRef.current === data.id) {
      setCurrentOrder(data);
    }
  }, []);

  const setMutationLoading = useCallback((nextLoading: boolean) => {
    setMutationLoadingState(nextLoading);
  }, []);

  // Real-time order updates via WebSocket
  useEffect(() => {
    if (!userId) return;

    const ordersPath = '/orders';

    const unsubscribe = socketService.onOrderUpdate((response) => {
      const data = response.data;
      if (!data) return;

      setOrders(prev => {
        const exists = prev.some(o => o.id === data.id);
        if (exists) return prev.map(o => (o.id === data.id ? data : o));
        return [data, ...prev];
      });

      if (currentOrderIdRef.current === data.id) {
        setCurrentOrder(data);
      }

      if (data.product?.id) {
        updateProductState(data.product.id, data.product);
      }

      showNotificationRef.current({
        type: 'order',
        title: response.message || 'Order update',
        body: response.message || `Order for ${data.product?.name ?? 'product'} updated`,
        icon: data.product?.image,
        onClick: () => { window.location.href = ordersPath; },
      });
    });

    return unsubscribe;
  }, [userId, updateProductState]);

  // 🔹 Derived Orders
  const pendingBuyingOrders = useMemo(
    () => orders.filter(o => isUnpaidOrder(o.status)),
    [orders]
  );
  const completedBuyingOrders = useMemo(
    () => orders.filter(o => o.status === OrderStatus.COMPLETED),
    [orders]
  );
  const cancelledBuyingOrders = useMemo(
    () => orders.filter(o => o.status === OrderStatus.CANCELLED),
    [orders]
  );
  const activeBuyingOrders = useMemo(
    () => orders.filter(o => isUnpaidOrder(o.status)),
    [orders]
  );

  const pendingSellingOrders = useMemo(
    () => orders.filter(o => isUnpaidOrder(o.status)),
    [orders]
  );
  const completedSellingOrders = useMemo(
    () => orders.filter(o => o.status === OrderStatus.COMPLETED),
    [orders]
  );
  const cancelledSellingOrders = useMemo(
    () => orders.filter(o => o.status === OrderStatus.CANCELLED),
    [orders]
  );
  const activeSellingOrders = useMemo(
    () => orders.filter(o => isUnpaidOrder(o.status)),
    [orders]
  );

  const value = useMemo<OrderContextValue>(() => ({
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
  }), [
    loading,
    orders,
    currentOrder,
    currentProduct,
    addOrder,
    updateOrder,
    setMutationLoading,
    mutationLoadingState,
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
  ]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return ctx;
}

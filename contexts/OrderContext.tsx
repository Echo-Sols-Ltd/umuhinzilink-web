import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orders';
import { FarmerOrder, SupplierOrder, OrderStatus, FarmerProduct, DeliveryStatus, UserType, SocketResponse } from '@/types';
import type { OrderRequest } from '@/types/request';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { socketService } from '@/services/socket';
import { useSocket } from './SocketContext';
import { OrderChangeResponse, OrderDeliveryChange } from '@/services/websocket';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';


const STORAGE_KEYS = {
  BUYER: 'buyerOrders',
  FARMER: 'farmerOrders',
  SUPPLIER: 'supplierOrders',
  FARMER_BUYER: 'farmerBuyerOrders',
};

type OrderContextValue = {
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

  // Satisfaction methods
  markFarmerOrderSatisfaction: (id: string) => Promise<void>;
  markSupplierOrderSatisfaction: (id: string) => Promise<void>;

  // State management functions
  setMutationLoading: (loading: boolean) => void;

  mutationLoading: boolean;

  fetchBuyerOrders: (page?: number, size?: number) => Promise<FarmerOrder[] | null>;
  fetchFarmerOrders: (page?: number, size?: number) => Promise<FarmerOrder[] | null>;
  fetchSupplierOrders: (page?: number, size?: number) => Promise<SupplierOrder[] | null>;
  fetchFarmerBuyerOrders: (page?: number, size?: number) => Promise<SupplierOrder[] | null>;

  farmerOrdersTotalPages: number;
  farmerOrdersTotalElements: number;
  supplierOrdersTotalPages: number;
  supplierOrdersTotalElements: number;
  buyerOrdersTotalPages: number;
  buyerOrdersTotalElements: number;
  farmerBuyerOrdersTotalPages: number;
  farmerBuyerOrdersTotalElements: number;

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
  const socket = useSocket()
  const { isEnabled, shouldUseInAppNotifications, shouldUseBrowserNotifications, showNotification } = useBrowserNotification();

  const [loading, setLoading] = useState(false);
  const [mutationLoadingState, setMutationLoadingState] = useState(false);

  const [buyerOrders, setBuyerOrders] = useState<FarmerOrder[] | null>(null);
  const [farmerOrders, setFarmerOrders] = useState<FarmerOrder[] | null>(null);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[] | null>(null);
  const [farmerBuyerOrders, setFarmerBuyerOrders] = useState<SupplierOrder[] | null>(null);

  const [farmerOrdersTotalPages, setFarmerOrdersTotalPages] = useState(0);
  const [farmerOrdersTotalElements, setFarmerOrdersTotalElements] = useState(0);
  const [supplierOrdersTotalPages, setSupplierOrdersTotalPages] = useState(0);
  const [supplierOrdersTotalElements, setSupplierOrdersTotalElements] = useState(0);
  const [buyerOrdersTotalPages, setBuyerOrdersTotalPages] = useState(0);
  const [buyerOrdersTotalElements, setBuyerOrdersTotalElements] = useState(0);
  const [farmerBuyerOrdersTotalPages, setFarmerBuyerOrdersTotalPages] = useState(0);
  const [farmerBuyerOrdersTotalElements, setFarmerBuyerOrdersTotalElements] = useState(0);

  const [currentFarmerOrder, setCurrentFarmerOrder] = useState<FarmerOrder | null>(null);
  const [currentSupplierOrder, setCurrentSupplierOrder] = useState<SupplierOrder | null>(null);
  const [currentFarmerBuyerOrder, setCurrentFarmerBuyerOrder] = useState<SupplierOrder | null>(
    null
  );
  const [currentBuyerOrder, setCurrentBuyerOrder] = useState<FarmerOrder | null>(null);
  const [currentProduct, setCurrentProduct] = useState<FarmerProduct | null>(null);

  const fetchBuyerOrders = async (page = 0, size = 10): Promise<FarmerOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getBuyerOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      console.log("this is the list", res)
      setBuyerOrders(Array.isArray(list) ? list : []);
      setBuyerOrdersTotalPages((res as { totalPages?: number }).totalPages ?? 0);
      setBuyerOrdersTotalElements((res as { totalElements?: number }).totalElements ?? 0);
      return Array.isArray(list) ? list : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerOrders = async (page = 0, size = 10): Promise<FarmerOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getFarmerOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      setFarmerOrders(Array.isArray(list) ? list : []);
      setFarmerOrdersTotalPages((res as { totalPages?: number }).totalPages ?? 0);
      setFarmerOrdersTotalElements((res as { totalElements?: number }).totalElements ?? 0);
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(Array.isArray(list) ? list : []));
      return Array.isArray(list) ? list : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierOrders = async (page = 0, size = 10): Promise<SupplierOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getSupplierOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      setSupplierOrders(Array.isArray(list) ? list : []);
      setSupplierOrdersTotalPages((res as { totalPages?: number }).totalPages ?? 0);
      setSupplierOrdersTotalElements((res as { totalElements?: number }).totalElements ?? 0);
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(Array.isArray(list) ? list : []));
      return Array.isArray(list) ? list : null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerBuyerOrders = async (page = 0, size = 10): Promise<SupplierOrder[] | null> => {
    try {
      setLoading(true);
      const res = await orderService.getFarmerBuyerOrders(page, size);
      if (!res.success) return null;
      const list = res.data ?? [];
      setFarmerBuyerOrders(Array.isArray(list) ? list : []);
      setFarmerBuyerOrdersTotalPages((res as { totalPages?: number }).totalPages ?? 0);
      setFarmerBuyerOrdersTotalElements((res as { totalElements?: number }).totalElements ?? 0);
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(Array.isArray(list) ? list : []));
      return Array.isArray(list) ? list : null;
    } catch {
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

  const markFarmerOrderSatisfaction = async (id: string) => {
    try {
      setMutationLoadingState(true);
      const response = await orderService.markFarmerOrderSatisfaction(id);

      if (response.success && response.data) {
        // Update all relevant order lists with the satisfaction data
        const updatedOrder = response.data;

        // Update farmer orders
        setFarmerOrders(prev => {
          if (!prev) return prev;
          const updated = prev.map(order =>
            order.id === id ? { ...order, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : order
          );
          localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
          return updated;
        });

        // Update buyer orders
        setBuyerOrders(prev => {
          if (!prev) return prev;
          const updated = prev.map(order =>
            order.id === id ? { ...order, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : order
          );
          localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(updated));
          return updated;
        });

        // Update current order if it matches
        setCurrentFarmerOrder(prev =>
          prev?.id === id ? { ...prev, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : prev
        );
        setCurrentBuyerOrder(prev =>
          prev?.id === id ? { ...prev, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : prev
        );
      }
    } catch (error) {
      console.error('Error marking farmer order satisfaction:', error);
      throw error;
    } finally {
      setMutationLoadingState(false);
    }
  };

  const markSupplierOrderSatisfaction = async (id: string) => {
    try {
      setMutationLoadingState(true);
      const response = await orderService.markSupplierOrderSatisfaction(id);

      if (response.success && response.data) {
        // Update all relevant order lists with the satisfaction data
        const updatedOrder = response.data;

        // Update supplier orders
        setSupplierOrders(prev => {
          if (!prev) return prev;
          const updated = prev.map(order =>
            order.id === id ? { ...order, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : order
          );
          localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
          return updated;
        });

        // Update farmer buyer orders
        setFarmerBuyerOrders(prev => {
          if (!prev) return prev;
          const updated = prev.map(order =>
            order.id === id ? { ...order, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : order
          );
          localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
          return updated;
        });

        // Update current order if it matches
        setCurrentSupplierOrder(prev =>
          prev?.id === id ? { ...prev, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : prev
        );
        setCurrentFarmerBuyerOrder(prev =>
          prev?.id === id ? { ...prev, isBuyerSatisfied: updatedOrder.isBuyerSatisfied } : prev
        );
      }
    } catch (error) {
      console.error('Error marking supplier order satisfaction:', error);
      throw error;
    } finally {
      setMutationLoadingState(false);
    }
  };

  const setMutationLoading = (loading: boolean) => {
    setMutationLoadingState(loading);
  };


  // Helper to update socket orders
  const handleOrderChange = (order: FarmerOrder | SupplierOrder) => {
    const orderId = order.id
    const farmerOrder = order as FarmerOrder
    const supplierOrder = order as SupplierOrder


    // Update farmer orders delivery status
    setFarmerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map((order) => order.id === orderId ? farmerOrder : order);
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
      return updated;
    });

    // Update buyer orders delivery status
    setBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map((order) => order.id === orderId ? farmerOrder : order);
      localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update supplier orders delivery status
    setSupplierOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map((order) => order.id === orderId ? supplierOrder : order);
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
      return updated;
    });

    // Update farmer buyer orders delivery status
    setFarmerBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map((order) => order.id === orderId ? supplierOrder : order);
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update current orders if they match
    setCurrentFarmerOrder(prev =>
      prev?.id === orderId ? farmerOrder : prev
    );
    setCurrentBuyerOrder(prev =>
      prev?.id === orderId ? farmerOrder : prev
    );
    setCurrentSupplierOrder(prev =>
      prev?.id === orderId ? supplierOrder : prev
    );
    setCurrentFarmerBuyerOrder(prev =>
      prev?.id === orderId ? supplierOrder : prev
    );

  }
  // Socket event handlers
  const handleNewOrder = useCallback((response: SocketResponse<FarmerOrder | SupplierOrder>) => {
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
    fetchBuyerOrders();
    fetchFarmerOrders();
    fetchSupplierOrders();
    fetchFarmerBuyerOrders();
  }, [isEnabled, showNotification, fetchBuyerOrders, fetchFarmerOrders, fetchSupplierOrders, fetchFarmerBuyerOrders]);

  const handleOrderStatusChange = useCallback((response: SocketResponse<FarmerOrder | SupplierOrder>) => {
    // Add null check to prevent undefined errors
    const data = response.data
    if (!data) {
      console.error('Order change data is undefined');
      return;
    }

    // Show notification for order status change
    if (isEnabled) {
      showNotification({
        type: 'order',
        title: 'Order Status Updated',
        body: response.message,
        icon: '/icons/order.svg',
        onClick: () => {
          // Navigate to orders page
          window.location.href = '/farmer/orders';
        },
      });
    }
    handleOrderChange(data)
  }, [isEnabled, showNotification, setCurrentFarmerOrder, setCurrentBuyerOrder, setCurrentSupplierOrder, setCurrentFarmerBuyerOrder]);




  const handleOrderDeliveryChange = useCallback((response: SocketResponse<FarmerOrder | SupplierOrder>) => {
    // Add null check to prevent undefined errors
    const data = response.data
    if (!data) {
      console.error('Delivery change data is undefined');
      return;
    }

    // Show notification for delivery status change
    showNotification({
      type: 'delivery',
      title: 'Delivery Status Updated',
      body: `Your order delivery was updated`,
      icon: '/icons/delivery.svg',
      onClick: () => {
        // Navigate to delivery page
        window.location.href = '/farmer/delivery';
      },
    });

    handleOrderChange(data);

  }, [shouldUseInAppNotifications, showNotification, setCurrentFarmerOrder, setCurrentBuyerOrder, setCurrentSupplierOrder, setCurrentFarmerBuyerOrder]);

  const handleOrderSatisfaction = useCallback((response: SocketResponse<FarmerOrder | SupplierOrder>) => {
    // Add null check to prevent undefined errors
    const data = response.data
    if (!data) {
      console.error('Satisfaction change data is undefined');
      return;
    }

    // Show notification for seller when buyer confirms satisfaction
    if (user?.role !== UserType.BUYER && data.isBuyerSatisfied) {
      showNotification({
        type: 'order',
        title: 'Order Delivered Safely',
        body: `${data.buyer.names} confirmed safe delivery of ${data.product.name}`,
        icon: data.product.image,
        onClick: () => {
          // Navigate to orders page
          window.location.href = user?.role === UserType.FARMER ? '/farmer/orders' : '/supplier/orders';
        },
      });
    }

    handleOrderChange(data);

  }, [user, showNotification, handleOrderChange]);

  const cleanupSocketListeners = useCallback(() => {
    if (!socket) return;
    socket.removeNewOrderListener(handleNewOrder);
    socket.removeOrderStatusChangeListener(handleOrderStatusChange);
    socket.removeOrderDeliveryChangeListener(handleOrderDeliveryChange);
    socket.removeOrderSatisfactionListener(handleOrderSatisfaction);
  }, [socket, handleNewOrder, handleOrderStatusChange, handleOrderDeliveryChange, handleOrderSatisfaction]);

  useEffect(() => {
    if (!socket) return;

    socket.onNewOrder(handleNewOrder);
    socket.onOrderStatusChange(handleOrderStatusChange);
    socket.onOrderDeliveryChange(handleOrderDeliveryChange);
    socket.onOrderSatisfaction(handleOrderSatisfaction);

    return cleanupSocketListeners;
  }, [socket, handleNewOrder, handleOrderStatusChange, handleOrderDeliveryChange, handleOrderSatisfaction, cleanupSocketListeners]);

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
    markFarmerOrderSatisfaction,
    markSupplierOrderSatisfaction,
    setMutationLoading,
    mutationLoading: mutationLoadingState,
    fetchBuyerOrders,
    fetchFarmerOrders,
    fetchSupplierOrders,
    fetchFarmerBuyerOrders,
    farmerOrdersTotalPages,
    farmerOrdersTotalElements,
    supplierOrdersTotalPages,
    supplierOrdersTotalElements,
    buyerOrdersTotalPages,
    buyerOrdersTotalElements,
    farmerBuyerOrdersTotalPages,
    farmerBuyerOrdersTotalElements,
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

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orders';
import { FarmerOrder, SupplierOrder, OrderStatus, FarmerProduct, DeliveryStatus } from '@/types';
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

  const setMutationLoading = (loading: boolean) => {
    setMutationLoadingState(loading);
  };

  // Socket event handlers
  const handleNewOrder = useCallback((orderChange: FarmerOrder | SupplierOrder) => {
    console.log("this is new order", orderChange);

    // Add null check to prevent undefined errors
    if (!orderChange) {
      console.error('Order change data is undefined');
      return;
    }

    // Show notification for new order
    const browserNotificationShown = showNotification({
      type: 'order',
      title: 'New Order Received',
      body: `Order #${orderChange.id} has been placed with status: ${orderChange.status}`,
      icon: '/icons/order.svg',
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

  const handleOrderStatusChange = useCallback((orderChange: FarmerOrder | SupplierOrder) => {
    console.log("this is order status change", orderChange);

    // Add null check to prevent undefined errors
    if (!orderChange) {
      console.error('Order change data is undefined');
      return;
    }

    // Show notification for order status change
    if (isEnabled) {
      showNotification({
        type: 'order',
        title: 'Order Status Updated',
        body: `Order #${orderChange.id} status changed to: ${orderChange.status}`,
        icon: '/icons/order.svg',
        onClick: () => {
          // Navigate to orders page
          window.location.href = '/farmer/orders';
        },
      });
    }

    // Update order status across all relevant lists by orderId
    const { id, status } = orderChange;

    // Helper function to update order status
    const updateOrderStatus = (order: any) => {
      if (order.id === id) {
        return {
          ...order,
          status: status,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    };

    // Update farmer orders
    setFarmerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateOrderStatus);
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
      return updated;
    });

    // Update buyer orders
    setBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateOrderStatus);
      localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update supplier orders
    setSupplierOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateOrderStatus);
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
      return updated;
    });

    // Update farmer buyer orders
    setFarmerBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateOrderStatus);
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update current orders if they match
    setCurrentFarmerOrder(prev =>
      prev?.id === id ? updateOrderStatus(prev) : prev
    );
    setCurrentBuyerOrder(prev =>
      prev?.id === id ? updateOrderStatus(prev) : prev
    );
    setCurrentSupplierOrder(prev =>
      prev?.id === id ? updateOrderStatus(prev) : prev
    );
    setCurrentFarmerBuyerOrder(prev =>
      prev?.id === id ? updateOrderStatus(prev) : prev
    );
  }, [isEnabled, showNotification, setCurrentFarmerOrder, setCurrentBuyerOrder, setCurrentSupplierOrder, setCurrentFarmerBuyerOrder]);
  const handleOrderDeliveryChange = useCallback((deliveryChange: FarmerOrder | SupplierOrder) => {
    if (!deliveryChange) {
      console.error('Delivery change data is undefined');
      return;
    }

    // Show notification for delivery status change
    const browserNotificationShown = showNotification({
      type: 'delivery',
      title: 'Delivery Status Updated',
      body: `Order #${deliveryChange.id} delivery status: ${deliveryChange.status}`,
      icon: '/icons/delivery.svg',
      onClick: () => {
        // Navigate to delivery page
        window.location.href = '/farmer/delivery';
      },
    });

    // In-app notifications are automatically shown via showNotification inside useBrowserNotification

    // Update order delivery status across all relevant lists by orderId
    const { id, status } = deliveryChange;

    // Helper function to update delivery status
    const updateDeliveryStatus = (order: any) => {
      if (order.id === id) {
        // Create or update delivery object with proper status
        const updatedDelivery = {
          ...order.delivery,
          status: status, // Use the delivery status from socket event
          updatedAt: new Date().toISOString(),
          // CRITICAL: Update trackingSteps to match the new status
          trackingSteps: order.delivery?.trackingSteps?.map((step: any) => {
            // Mark the step with the new status as completed
            if (step.status === status) {
              return {
                ...step,
                completed: true,
                completedAt: new Date().toISOString()
              };
            }
            // Keep existing completed steps as completed
            return step;
          }) || [{
            // If no trackingSteps exist, create one for the current status
            status: status,
            completed: true,
            completedAt: new Date().toISOString(),
            location: 'Updated via socket',
            notes: 'Delivery status updated automatically'
          }]
        };

        return {
          ...order,
          delivery: updatedDelivery,
          // Also update a deliveryStatus field if it exists on the order
          ...(order.deliveryStatus && { deliveryStatus: status })
        };
      }
      return order;
    };

    // Update farmer orders delivery status
    setFarmerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateDeliveryStatus);
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(updated));
      return updated;
    });

    // Update buyer orders delivery status
    setBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateDeliveryStatus);
      localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update supplier orders delivery status
    setSupplierOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateDeliveryStatus);
      localStorage.setItem(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
      return updated;
    });

    // Update farmer buyer orders delivery status
    setFarmerBuyerOrders(prev => {
      if (!prev) return prev;
      const updated = prev.map(updateDeliveryStatus);
      localStorage.setItem(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
      return updated;
    });

    // Update current orders if they match
    setCurrentFarmerOrder(prev =>
      prev?.id === id ? updateDeliveryStatus(prev) : prev
    );
    setCurrentBuyerOrder(prev =>
      prev?.id === id ? updateDeliveryStatus(prev) : prev
    );
    setCurrentSupplierOrder(prev =>
      prev?.id === id ? updateDeliveryStatus(prev) : prev
    );
    setCurrentFarmerBuyerOrder(prev =>
      prev?.id === id ? updateDeliveryStatus(prev) : prev
    );
  }, [shouldUseInAppNotifications, showNotification, setCurrentFarmerOrder, setCurrentBuyerOrder, setCurrentSupplierOrder, setCurrentFarmerBuyerOrder]);

  const cleanupSocketListeners = useCallback(() => {
    if (!socket) return;
    socket.removeNewOrderListener(handleNewOrder);
    socket.removeOrderStatusChangeListener(handleOrderStatusChange);
    socket.removeOrderDeliveryChangeListener(handleOrderDeliveryChange);
  }, [socket, handleNewOrder, handleOrderStatusChange, handleOrderDeliveryChange]);

  useEffect(() => {
    if (!socket) return;

    socket.onNewOrder(handleNewOrder);
    socket.onOrderStatusChange(handleOrderStatusChange);
    socket.onOrderDeliveryChange(handleOrderDeliveryChange);

    return cleanupSocketListeners;
  }, [socket, handleNewOrder, handleOrderStatusChange, handleOrderDeliveryChange, cleanupSocketListeners]);

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

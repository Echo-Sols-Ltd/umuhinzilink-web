import { useOrder } from '@/contexts/OrderContext';
import { orderService } from '@/services/orders';
import { useWallet } from '@/contexts/WalletContext';
import { notify } from '@/lib/notify';
import { Order, OrderStatus } from '@/types';
import { OrderRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

/**
 * Order actions hook that handles order mutations (create, accept, cancel, update status, process payment)
 * Uses OrderContext for state management and updates
 */
export default function useOrderAction() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth();
  const {
    addOrder,updateOrder
  } = useOrder();
  const { payOrder: payWithWallet } = useWallet();


  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      setLoading(true);
      const response = await orderService.updateOrderStatus(id, status);
      if (response.success && response.data) {
        updateOrder({ ...response.data, id } as Order);
        notify.success('Delivery status has been updated.', 'Order status updated successfully');
      } else {
        notify.error(response.message || 'Failed to update', 'Failed to update order status');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update farmer order status';
      notify.error(msg, 'Failed to update order status');
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const createOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
      const res = await orderService.createOrder(payload);
      if (!res.success) {
        notify.error(res.message || 'Failed to create order', 'Failed to create order');
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        notify.error('Failed to create order: empty response', 'Failed to create order');
        return;
      }

      addOrder(newOrder);
      notify.success('Initiating payment...', 'Order created successfully');


    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      notify.error(msg, 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };



  return {
    createOrder,
    updateOrderStatus,
    loading,
  };
}

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

  const acceptOrder = async (id: string): Promise<Order | null> => {
    try {
      setLoading(true);
      const res = await orderService.acceptOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to accept order', 'Failed to accept order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to accept order');
        return null;
      }
      updateOrder(updated);
      notify.success('The order has been accepted.', 'Order accepted successfully');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order';
      notify.error(msg, 'Failed to accept order');
      return null;
    } finally {
      setLoading(false);
    }
  };


  const cancelOrder = async (id: string): Promise<Order | null> => {
    try {
      setLoading(true);
      const res = await orderService.cancelOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to cancel order', 'Failed to cancel order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to cancel order');
        return null;
      }
      updateOrder(updated);
      notify.success('The order has been cancelled.', 'Order cancelled successfully');
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order';
      notify.error(msg, 'Failed to cancel order');
      return null;
    } finally {
      setLoading(false);
    }
  };


  const processOrderPayment = async (orderId: string, _paymentMethod?: unknown): Promise<unknown> => {
    try {
      setLoading(true);
      notify.loading('Processing payment from your wallet...', 'Wallet Payment');
      const res = await payWithWallet(orderId, 'Order Payment');
      if (res && (res as { status?: string }).status === 'COMPLETED') {
        // Refresh orders after payment
        // await fetchFarmerBuyerOrders();
        return res;
      }
      return null;
    } catch {
      notify.error('An error occurred while processing your payment.', 'Payment error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    acceptOrder,
    cancelOrder,
    updateOrderStatus,
    processOrderPayment,
    loading,
  };
}

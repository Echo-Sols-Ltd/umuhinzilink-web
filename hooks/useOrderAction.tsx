import { useOrder } from '@/contexts/OrderContext';
import { orderService } from '@/services/orders';
import { useWallet } from '@/contexts/WalletContext';
import { notify } from '@/lib/notify';
import { Order, OrderStatus } from '@/types';
import { OrderRequest } from '@/types';
import { useState } from 'react';

export type CreateOrderResult = {
  order: Order;
  paid: boolean;
};

/**
 * Order actions hook that handles order mutations (create, cancel, pay)
 */
export default function useOrderAction() {
  const [loading, setLoading] = useState(false);
  const { addOrder, updateOrder } = useOrder();
  const { payOrder: payWithWallet } = useWallet();

  const createOrder = async (
    payload: OrderRequest,
    options?: { payImmediately?: boolean }
  ): Promise<CreateOrderResult | null> => {
    try {
      setLoading(true);
      const res = await orderService.createOrder(payload);
      if (!res.success) {
        notify.error(res.message || 'Failed to create order', 'Failed to create order');
        return null;
      }
      const newOrder = res.data;
      if (!newOrder) {
        notify.error('Failed to create order: empty response', 'Failed to create order');
        return null;
      }

      addOrder(newOrder);

      const isNegotiated = payload.proposedPrice != null;
      const shouldPay = options?.payImmediately ?? !isNegotiated;

      if (!shouldPay) {
        notify.success('Your offer has been sent to the seller.', 'Offer sent');
        return { order: newOrder, paid: false };
      }

      const paid = await payWithWallet(newOrder.id);
      if (paid) {
        try {
          const refreshed = await orderService.getOrderById(newOrder.id);
          if (refreshed.success && refreshed.data) {
            updateOrder(refreshed.data);
            return { order: refreshed.data, paid: true };
          }
        } catch {
          // fall through with optimistic status
        }
        updateOrder({ ...newOrder, status: OrderStatus.COMPLETED });
        return { order: { ...newOrder, status: OrderStatus.COMPLETED }, paid: true };
      }

      notify.warning(
        'Order created but payment failed. Add funds to your wallet and pay from your orders page.',
        'Payment required'
      );
      return { order: newOrder, paid: false };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      notify.error(msg, 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await orderService.cancelOrder(id);
      if (response.success && response.data) {
        updateOrder(response.data);
        notify.success('The order has been cancelled.', 'Order cancelled');
        return response.data;
      }
      notify.error(response.message || 'Failed to cancel order', 'Cancel failed');
      return null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to cancel order';
      notify.error(msg, 'Cancel failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const payOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const paid = await payWithWallet(orderId);
      if (!paid) return false;

      const refreshed = await orderService.getOrderById(orderId);
      if (refreshed.success && refreshed.data) {
        updateOrder(refreshed.data);
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    cancelOrder,
    payOrder,
    loading,
  };
}

import { useOrder } from '@/contexts/OrderContext';
import { orderService } from '@/services/orders';
import { useWallet } from '@/contexts/WalletContext';
import { notify } from '@/lib/notify';
import { FarmerOrder, SupplierOrder, DeliveryStatus } from '@/types';
import type { OrderRequest } from '@/types/request';
import { useState } from 'react';

/**
 * Order actions hook that handles order mutations (create, accept, cancel, update status, process payment)
 * Uses OrderContext for state management and updates
 */
export default function useOrderAction() {
  const [loading, setLoading] = useState(false)
  const {
    addFarmerOrder,
    addFarmerBuyerOrder,
    editFarmerOrder,
    editSupplierOrder,
    editFarmerBuyerOrder,
    fetchFarmerBuyerOrders,
  } = useOrder();
  const { payOrder: payWithWallet } = useWallet();


  const updateFarmerOrderStatus = async (id: string, status: DeliveryStatus) => {
    try {
      setLoading(true);
      const response = await orderService.updateFarmerOrderStatus(id, status);
      if (response.success && response.data) {
        editFarmerOrder({ ...response.data, id } as FarmerOrder);
        notify.success('Delivery status has been updated.', 'Order status updated successfully' );
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

  const updateSupplierOrderStatus = async (id: string, status: DeliveryStatus): Promise<SupplierOrder | null> => {
    try {
      setLoading(true);
      const res = await orderService.updateSupplierOrderStatus(id, status);
      if (!res.success) {
        notify.error(res.message || 'Failed to update order status', 'Failed to update order status');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to update order status');
        return null;
      }
      editSupplierOrder(updated);
      notify.success('Delivery status has been updated.', 'Order status updated successfully' );
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order status';
      notify.error(msg, 'Failed to update order status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createFarmerOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
      const res = await orderService.createFarmerOrder(payload);
      if (!res.success) {
        notify.error(res.message || 'Failed to create order', 'Failed to create order');
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        notify.error('Failed to create order: empty response', 'Failed to create order');
        return;
      }
      addFarmerOrder(newOrder);
      notify.success('Initiating payment...', 'Order created successfully' );
      const paymentRes = await payWithWallet(newOrder.id, 'Order Payment');
      if (paymentRes?.status === 'COMPLETED') {
        // Order already updated via addFarmerOrder
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      notify.error(msg, 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const createSupplierOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
      const res = await orderService.createSupplierOrder(payload);
      if (!res.success) {
        notify.error(res.message || 'Failed to create order', 'Failed to create order');
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        notify.error('Failed to create order: empty response', 'Failed to create order');
        return;
      }
      addFarmerBuyerOrder(newOrder);
      notify.success('Initiating payment...', 'Order created successfully' );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      notify.error(msg, 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const acceptFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setLoading(true);
      const res = await orderService.acceptFarmerOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to accept order', 'Failed to accept order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to accept order');
        return null;
      }
      editFarmerOrder(updated);
      notify.success('The order has been accepted.', 'Order accepted successfully' );
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order';
      notify.error(msg, 'Failed to accept order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setLoading(true);
      const res = await orderService.acceptSupplierOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to accept order', 'Failed to accept order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to accept order');
        return null;
      }
      editSupplierOrder(updated);
      notify.success('The order has been accepted.', 'Order accepted successfully' );
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order';
      notify.error(msg, 'Failed to accept order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setLoading(true);
      const res = await orderService.cancelFarmerOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to cancel order', 'Failed to cancel order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to cancel order');
        return null;
      }
      editFarmerOrder(updated);
      notify.success('The order has been cancelled.', 'Order cancelled successfully' );
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order';
      notify.error(msg, 'Failed to cancel order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setLoading(true);
      const res = await orderService.cancelSupplierOrder(id);
      if (!res.success) {
        notify.error(res.message || 'Failed to cancel order', 'Failed to cancel order');
        return null;
      }
      const updated = res.data;
      if (!updated) {
        notify.error('Empty response', 'Failed to cancel order');
        return null;
      }
      editSupplierOrder(updated);
      notify.success('The order has been cancelled.', 'Order cancelled successfully' );
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
    createFarmerOrder,
    createSupplierOrder,
    acceptFarmerOrder,
    acceptSupplierOrder,
    cancelFarmerOrder,
    cancelSupplierOrder,
    updateFarmerOrderStatus,
    updateSupplierOrderStatus,
    processOrderPayment,
    loading,
  };
}

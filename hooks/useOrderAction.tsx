import { useOrder } from '@/contexts/OrderContext';
import { orderService } from '@/services/orders';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();


  const updateFarmerOrderStatus = async (id: string, status: DeliveryStatus) => {
    try {
      setLoading(true);
      const response = await orderService.updateFarmerOrderStatus(id, status);
      if (response.success && response.data) {
        editFarmerOrder({ ...response.data, id } as FarmerOrder);
        toast({ title: 'Order status updated successfully', description: 'Delivery status has been updated.', variant: 'success' });
      } else {
        toast({ title: 'Failed to update order status', description: response.message || 'Failed to update', variant: 'error' });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update farmer order status';
      toast({ title: 'Failed to update order status', description: msg, variant: 'error' });
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
      setLoading(false);
    }
  };

  const createFarmerOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const createSupplierOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const acceptFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const acceptSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const cancelFarmerOrder = async (id: string): Promise<FarmerOrder | null> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const cancelSupplierOrder = async (id: string): Promise<SupplierOrder | null> => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const processOrderPayment = async (orderId: string, _paymentMethod?: unknown): Promise<unknown> => {
    try {
      setLoading(true);
      toast({ title: 'Wallet Payment', description: 'Processing payment from your wallet...', variant: 'loading' });
      const res = await payWithWallet(orderId, 'Order Payment');
      if (res && (res as { status?: string }).status === 'COMPLETED') {
        // Refresh orders after payment
        // await fetchFarmerBuyerOrders();
        return res;
      }
      return null;
    } catch {
      toast({ title: 'Payment error', description: 'An error occurred while processing your payment.', variant: 'error' });
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

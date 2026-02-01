import { DeliveryStatus, OrderRequest, PaymentMethod } from '@/types';
import { useState } from 'react';
import { orderService } from '@/services/orders';
import { paymentService } from '@/services/payments';
import { useOrder } from '@/contexts/OrderContext';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/use-toast';

export default function useOrderAction() {
  const [loading, setLoading] = useState(false);
  const {
    addFarmerOrder,
    addFarmerBuyerOrder,
    editFarmerOrder,
    editSupplierOrder,
    editFarmerBuyerOrder,
    fetchFarmerBuyerOrders,
  } = useOrder();
  const { payOrder: payWithWallet } = useWallet();

  const createFarmerOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);
      const res = await orderService.createFarmerOrder(payload);
      if (!res.success) {
        toast({
          title: 'Failed to create order',
          description: res.message || 'Failed to create order',
          variant: 'error',
        });
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        toast({
          title: 'Failed to create order',
          description: 'Failed to create order: empty response',
          variant: 'error',
        });
        return;
      }
      addFarmerOrder(newOrder);
      toast({
        title: 'Order created successfully',
        description: 'Initiating payment...',
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      toast({
        title: 'Failed to create order',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplierOrder = async (payload: OrderRequest) => {
    try {
      setLoading(true);

      const res = await orderService.createSupplierOrder(payload);
      if (!res.success) {
        toast({
          title: 'Failed to create order',
          description: res.message || 'Failed to create order',
          variant: 'error',
        });
        return;
      }
      const newOrder = res.data;
      if (!newOrder) {
        toast({
          title: 'Failed to create order',
          description: 'Failed to create order: empty response',
          variant: 'error',
        });
        return;
      }

      addFarmerBuyerOrder(newOrder);
      toast({
        title: 'Order created successfully',
        description: 'Initiating payment...',
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      toast({
        title: 'Failed to create order',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptFarmerOrder = async (id: string) => {
    try {
      setLoading(true);

      const res = await orderService.acceptFarmerOrder(id);
      if (!res.success) {
        toast({
          title: 'Failed to accept order',
          description: res.message || 'Failed to accept order',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to accept order',
          description: 'Failed to accept order: empty response',
          variant: 'error',
        });
        return null;
      }
      editFarmerOrder(updatedOrder);

      toast({
        title: 'Order accepted successfully',
        description: 'Order accepted successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      toast({
        title: 'Failed to accept order',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptSupplierOrder = async (id: string) => {
    try {
      setLoading(true);

      const res = await orderService.acceptSupplierOrder(id);
      if (!res.success) {
        toast({
          title: 'Failed to accept order',
          description: res.message || 'Failed to accept order',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to accept order',
          description: 'Failed to accept order: empty response',
          variant: 'error',
        });
        return null;
      }

      editSupplierOrder(updatedOrder);
      toast({
        title: 'Order accepted successfully',
        description: 'Order accepted successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept order';
      toast({
        title: 'Failed to accept order',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelFarmerOrder = async (id: string) => {
    try {
      setLoading(true);

      const res = await orderService.cancelFarmerOrder(id);
      if (!res.success) {
        toast({
          title: 'Failed to cancel order',
          description: res.message || 'Failed to cancel order',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to cancel order',
          description: 'Failed to cancel order: empty response',
          variant: 'error',
        });
        return null;
      }

      editFarmerOrder(updatedOrder);
      toast({
        title: 'Order cancelled successfully',
        description: 'Order cancelled successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      toast({
        title: 'Failed to cancel order',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSupplierOrder = async (id: string) => {
    try {
      setLoading(true);

      const res = await orderService.cancelSupplierOrder(id);
      if (!res.success) {
        toast({
          title: 'Failed to cancel order',
          description: res.message || 'Failed to cancel order',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to cancel order',
          description: 'Failed to cancel order: empty response',
          variant: 'error',
        });
        return null;
      }
      editSupplierOrder(updatedOrder);

      toast({
        title: 'Order cancelled successfully',
        description: 'Order cancelled successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      toast({
        title: 'Failed to cancel order',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFarmerOrderStatus = async (id: string, status: DeliveryStatus) => {
    try {
      setLoading(true);

      const res = await orderService.updateFarmerOrderStatus(id, status);
      if (!res.success) {
        toast({
          title: 'Failed to update order status',
          description: res.message || 'Failed to update order status',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to update order status',
          description: 'Failed to update order status: empty response',
          variant: 'error',
        });
        return null;
      }

      editFarmerOrder(updatedOrder);
      toast({
        title: 'Order status updated successfully',
        description: 'Order status updated successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      toast({
        title: 'Failed to update order status',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplierOrderStatus = async (id: string, status: DeliveryStatus) => {
    try {
      setLoading(true);

      const res = await orderService.updateSupplierOrderStatus(id, status);
      if (!res.success) {
        toast({
          title: 'Failed to update order status',
          description: res.message || 'Failed to update order status',
          variant: 'error',
        });
        return null;
      }
      const updatedOrder = res.data;
      if (!updatedOrder) {
        toast({
          title: 'Failed to update order status',
          description: 'Failed to update order status: empty response',
          variant: 'error',
        });
        return null;
      }

      editSupplierOrder(updatedOrder);
      toast({
        title: 'Order status updated successfully',
        description: 'Order status updated successfully',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      toast({
        title: 'Failed to update order status',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  const processOrderPayment = async (orderId: string, paymentMethod: any) => {
    try {
      setLoading(true);

      if (true) {
        toast({
          title: 'Wallet Payment',
          description: 'Processing payment from your wallet...',
        });

        const res = await payWithWallet(orderId, 'Order Payment');
        if (res && res.status === 'COMPLETED') {
          // Updated orders in context should reflect the new state
          fetchFarmerBuyerOrders();
          return res;
        }
        return null;
      }

      const res = await paymentService.processPayment({
        orderId,
        paymentMethod,
      });

      if (res.success) {
        toast({
          title: 'Payment successful',
          description: 'Your payment has been processed successfully.',
        });
        fetchFarmerBuyerOrders();
        return res.data;
      } else {
        toast({
          title: 'Payment failed',
          description: res.message || 'We could not process your payment.',
        });
        return null;
      }
    } catch (err) {
      toast({
        title: 'Payment error',
        description: 'An error occurred while processing your payment.',
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSupplierOrder,
    createFarmerOrder,
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

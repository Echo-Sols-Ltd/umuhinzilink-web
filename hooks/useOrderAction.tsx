import { useOrder } from '@/contexts/OrderContext';

/**
 * Order actions (create, accept, cancel, update status, process payment) are provided by OrderContext.
 * This hook re-exports them for backward compatibility.
 */
export default function useOrderAction() {
  const order = useOrder();
  return {
    createFarmerOrder: order.createFarmerOrder,
    createSupplierOrder: order.createSupplierOrder,
    acceptFarmerOrder: order.acceptFarmerOrder,
    acceptSupplierOrder: order.acceptSupplierOrder,
    cancelFarmerOrder: order.cancelFarmerOrder,
    cancelSupplierOrder: order.cancelSupplierOrder,
    updateFarmerOrderStatus: order.updateFarmerOrderStatus,
    updateSupplierOrderStatus: order.updateSupplierOrderStatus,
    processOrderPayment: order.processOrderPayment,
    loading: order.mutationLoading,
  };
}

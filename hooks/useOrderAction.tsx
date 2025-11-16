import { DeliveryStatus, OrderRequest } from "@/types";
import { useState } from "react";
import { orderService } from "@/services/orders";
import { useOrder } from "@/contexts/OrderContext";
import { useToast } from "@/components/ui/toast/Toast";

export default function useOrderAction() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const { addFarmerOrder, addFarmerBuyerOrder, editFarmerOrder, editSupplierOrder, editFarmerBuyerOrder } = useOrder()


    const createFarmerOrder = async (payload: OrderRequest) => {
        try {
            setLoading(true);
            const res = await orderService.createFarmerOrder(payload);
            if (!res.success) {
                showToast({
                    title: "Failed to create order",
                    description: res.message || 'Failed to create order',
                    type: 'error'
                })
                return;
            }
            const newOrder = res.data;
            if (!newOrder) {
                showToast({
                    title: "Failed to create order",
                    description: 'Failed to create order: empty response',
                    type: 'error'
                })
                return;
            }
            addFarmerOrder(newOrder)
            showToast({
                title: "Order created successfully",
                description: 'Order created successfully',
                type: 'default'
            })
            // router.push('/payment/initiate')
        } catch (err: any) {
            showToast({
                title: "Failed to create order",
                description: err?.message || 'Failed to create order',
                type: 'error'
            })

        } finally {
            setLoading(false);
        }
    };


    const createSupplierOrder = async (payload: OrderRequest) => {
        try {
            setLoading(true);

            const res = await orderService.createSupplierOrder(payload);
            if (!res.success) {
                showToast({
                    title: "Failed to create order",
                    description: res.message || 'Failed to create order',
                    type: 'error'
                })
                return;
            }
            const newOrder = res.data;
            if (!newOrder) {
                showToast({
                    title: "Failed to create order",
                    description: 'Failed to create order: empty response',
                    type: 'error'
                })
                return;
            }

            addFarmerBuyerOrder(newOrder);
            showToast({
                title: "Order created successfully",
                description: 'Order created successfully',
                type: 'default'
            })
            // router.push('/payment/initiate')
        } catch (err: any) {
            showToast({
                title: "Failed to create order",
                description: err?.message || 'Failed to create order',
                type: 'error'
            })

        } finally {
            setLoading(false);
        }
    };



    const acceptFarmerOrder = async (id: string) => {
        try {
            setLoading(true);

            const res = await orderService.acceptFarmerOrder(id);
            if (!res.success) {
                showToast({
                    title: "Failed to accept order",
                    description: res.message || 'Failed to accept order',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to accept order",
                    description: 'Failed to accept order: empty response',
                    type: 'error'
                })
                return null;
            }
            editFarmerOrder(updatedOrder)

            showToast({
                title: "Order accepted successfully",
                description: 'Order accepted successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to accept order",
                description: err?.message || 'Failed to accept order',
                type: 'error'
            })
            return null;
        } finally {
            setLoading(false);
        }
    }

    const acceptSupplierOrder = async (id: string) => {
        try {
            setLoading(true);

            const res = await orderService.acceptSupplierOrder(id);
            if (!res.success) {
                showToast({
                    title: "Failed to accept order",
                    description: res.message || 'Failed to accept order',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to accept order",
                    description: 'Failed to accept order: empty response',
                    type: 'error'
                })
                return null;
            }

            editSupplierOrder(updatedOrder);
            showToast({
                title: "Order accepted successfully",
                description: 'Order accepted successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to accept order",
                description: err?.message || 'Failed to accept order',
                type: 'error'
            })
            return null;
        } finally {
            setLoading(false);
        }
    }

    const cancelFarmerOrder = async (id: string) => {
        try {
            setLoading(true);

            const res = await orderService.cancelFarmerOrder(id);
            if (!res.success) {
                showToast({
                    title: "Failed to cancel order",
                    description: res.message || 'Failed to cancel order',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to cancel order",
                    description: 'Failed to cancel order: empty response',
                    type: 'error'
                })
                return null;
            }

            editFarmerOrder(updatedOrder)
            showToast({
                title: "Order cancelled successfully",
                description: 'Order cancelled successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to cancel order",
                description: err?.message || 'Failed to cancel order',
                type: 'error'
            })
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
                showToast({
                    title: "Failed to cancel order",
                    description: res.message || 'Failed to cancel order',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to cancel order",
                    description: 'Failed to cancel order: empty response',
                    type: 'error'
                })
                return null;
            }
            editSupplierOrder(updatedOrder)

            showToast({
                title: "Order cancelled successfully",
                description: 'Order cancelled successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to cancel order",
                description: err?.message || 'Failed to cancel order',
                type: 'error'
            })
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
                showToast({
                    title: "Failed to update order status",
                    description: res.message || 'Failed to update order status',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to update order status",
                    description: 'Failed to update order status: empty response',
                    type: 'error'
                })
                return null;
            }

            editFarmerOrder(updatedOrder)
            showToast({
                title: "Order status updated successfully",
                description: 'Order status updated successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to update order status",
                description: err?.message || 'Failed to update order status',
                type: 'error'
            })
            return null;
        } finally {
            setLoading(false);
        }
    }

    const updateSupplierOrderStatus = async (id: string, status: DeliveryStatus) => {
        try {
            setLoading(true);

            const res = await orderService.updateSupplierOrderStatus(id, status);
            if (!res.success) {
                showToast({
                    title: "Failed to update order status",
                    description: res.message || 'Failed to update order status',
                    type: 'error'
                })
                return null;
            }
            const updatedOrder = res.data;
            if (!updatedOrder) {
                showToast({
                    title: "Failed to update order status",
                    description: 'Failed to update order status: empty response',
                    type: 'error'
                })
                return null;
            }

            editSupplierOrder(updatedOrder);
            showToast({
                title: "Order status updated successfully",
                description: 'Order status updated successfully',
                type: 'default'
            })
        } catch (err: any) {
            showToast({
                title: "Failed to update order status",
                description: err?.message || 'Failed to update order status',
                type: 'error'
            })
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        createSupplierOrder,
        createFarmerOrder,
        acceptFarmerOrder,
        acceptSupplierOrder,
        cancelFarmerOrder,
        cancelSupplierOrder,
        updateFarmerOrderStatus,
        updateSupplierOrderStatus,
        loading
    }
}
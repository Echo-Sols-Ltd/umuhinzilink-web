import { DeliveryStatus, OrderStatus } from "@/types";

export interface OrderChangeResponse {
    orderId: string;
    status: OrderStatus;
    message: string;
}
export interface OrderDeliveryChange {
    orderId: string;
    status: DeliveryStatus;
    message: string;
}
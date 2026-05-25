import {OrderStatus } from "@/types";

export interface OrderChangeResponse {
    orderId: string;
    status: OrderStatus;
    message: string;
}
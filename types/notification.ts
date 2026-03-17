import { User } from './user';

export enum NotificationType {
    ORDER = 'ORDER',
    PAYMENT = 'PAYMENT',
    DELIVERY = 'DELIVERY',
    MESSAGE = 'MESSAGE',
    NEGOTIATION = 'NEGOTIATION',
    PRODUCT = 'PRODUCT',
    SYSTEM = 'SYSTEM'
}
export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: NotificationType;
    userId: string;
}

export interface NotificationFilter {
    isRead?: boolean;
    type?: NotificationType;
}
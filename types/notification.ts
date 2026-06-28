import { User } from './user';

export enum NotificationType {
    ORDER = 'ORDER',
    PAYMENT = 'PAYMENT',
    NEGOTIATION = 'NEGOTIATION',
    PRODUCT = 'PRODUCT',
    SYSTEM = 'SYSTEM'
}
export interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    type: NotificationType;
    user: User;
}

export interface NotificationFilter {
    isRead?: boolean;
    type?: NotificationType;
}
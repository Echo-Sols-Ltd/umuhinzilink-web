import { User } from './user';

export enum NotificationType {
    SYSTEM = 'SYSTEM',
    MESSAGE = 'MESSAGE',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    PRODUCT = 'PRODUCT',
    ORDER = 'ORDER',
}
export interface Notification {
    id: string;
    title: string;
    user: User;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: NotificationType;
}

export interface NotificationFilter {
    isRead?: boolean;
    type?: NotificationType;
}
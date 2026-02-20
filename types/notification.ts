import { User } from './user';

export enum NotificationType {
    SYSTEM_INFO = "SYSTEM_INFO",
    SYSTEM_WARNING = "SYSTEM_WARNING",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    MESSAGE = "MESSAGE",
    USER_UPDATE = "USER_UPDATE",
    GROUP_UPDATE = "GROUP_UPDATE",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS"
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
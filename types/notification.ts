import { User } from './user';

export interface Notification {
    id: string; // Changed to string to match id pattern in project
    title: string;
    user: User;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

export interface NotificationFilter {
    isRead?: boolean;
    type?: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

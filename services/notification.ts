import { apiClient } from './client';
import { Notification, NotificationType, PaginatedResponse } from '@/types';

class NotificationService {
    async getNotifications(page = 0, size = 15): Promise<PaginatedResponse<Notification[]>> {
        return apiClient.get<PaginatedResponse<Notification[]>>('/notifications', { page, size });
    }

    async getUnreadNotifications(page = 0, size = 15): Promise<PaginatedResponse<Notification[]>> {
        return apiClient.get<PaginatedResponse<Notification[]>>('/notifications/unread', { page, size });
    }

    async getByType(type: NotificationType, page = 0, size = 15): Promise<PaginatedResponse<Notification[]>> {
        return apiClient.get<PaginatedResponse<Notification[]>>(`/notifications/type/${type}`, { page, size });
    }

    async getUnreadCount(): Promise<number> {
        const res = await apiClient.get<{ success: boolean; data?: number }>('/notifications/unread/count');
        return res.data ?? 0;
    }

    async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
        return apiClient.put(`/notifications/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<{ success: boolean; message: string }> {
        return apiClient.put('/notifications/read-all');
    }

    async deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
        return apiClient.delete(`/notifications/${notificationId}`);
    }

    async deleteAllNotifications(): Promise<{ success: boolean; message: string }> {
        return apiClient.delete('/notifications');
    }
}

export const notificationService = new NotificationService();

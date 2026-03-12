import { apiClient } from './client';
import { Notification, NotificationFilter } from '@/types';
import { ApiResponse } from '@/types';

class NotificationService {
    async getNotifications(filter?: NotificationFilter): Promise<ApiResponse<Notification[]>> {
        return apiClient.get('/notifications', filter as Record<string, unknown>);
    }

    async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
        return apiClient.put(`/notifications/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<ApiResponse<void>> {
        return apiClient.put('/notifications/read-all');
    }

    async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
        return apiClient.delete(`/notifications/${notificationId}`);
    }

    async deleteAllNotifications(): Promise<ApiResponse<void>> {
        return apiClient.delete('/notifications');
    }
}

export const notificationService = new NotificationService();

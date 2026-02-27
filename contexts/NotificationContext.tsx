'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationFilter, NotificationType } from '@/types/notification';
import { notificationService } from '@/services/notification';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';
import { PaginatedResponse } from '@/types/api';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    fetchNotifications: (filter?: NotificationFilter & { page?: number; size?: number }) => Promise<void>;
    fetchAll: (params: { page: number; size: number }) => Promise<void>;
    fetchByType: (type: NotificationType, params: { page: number; size: number }) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async (filter?: NotificationFilter & { page?: number; size?: number }) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(filter);
            if (response.success && response.data) {
                // Support both direct array and nested paginated data structures
                const data = response.data as any;

                if (Array.isArray(data)) {
                    const normalizedNotifications = data.map((n: any) => ({
                        ...n,
                        id: String(n.id)
                    }));
                    setNotifications(normalizedNotifications);
                    setTotalElements(data.length);
                    setTotalPages(1);
                    setCurrentPage(0);
                } else {
                    // Handle PaginatedResponse
                    const rawNotifications = Array.isArray(data.data) ? data.data : [];
                    const normalizedNotifications = rawNotifications.map((n: any) => ({
                        ...n,
                        id: String(n.id)
                    }));
                    setNotifications(normalizedNotifications);

                    // Use totalElements/totalPages if they exist in the response
                    const paginated = response as unknown as PaginatedResponse<Notification[]>;
                    setTotalElements(paginated.totalElements || rawNotifications.length);
                    setTotalPages(paginated.totalPages || 1);
                    setCurrentPage(paginated.pageNumber || 0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchAll = useCallback(async (params: { page: number; size: number }) => {
        await fetchNotifications(params);
    }, [fetchNotifications]);

    const fetchByType = useCallback(async (type: NotificationType, params: { page: number; size: number }) => {
        await fetchNotifications({ ...params, type });
    }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            const response = await notificationService.markAsRead(id);
            if (response.success) {
                setNotifications(prev =>
                    (Array.isArray(prev) ? prev : []).map(n => (n.id === id ? { ...n, isRead: true } : n))
                );
            }
        } catch (error) {
            notify.error('Failed to mark notification as read', 'Error');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, isRead: true })));
                notify.success('All notifications marked as read', 'Success');
            }
        } catch (error) {
            notify.error('Failed to mark all notifications as read', 'Error');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => (Array.isArray(prev) ? prev : []).filter(n => n.id !== id));
            }
        } catch (error) {
            notify.error('Failed to delete notification', 'Error');
        }
    };

    const clearAll = async () => {
        try {
            const response = await notificationService.deleteAllNotifications();
            if (response.success) {
                setNotifications([]);
                notify.success('All notifications cleared', 'Success');
            }
        } catch (error) {
            notify.error('Failed to clear notifications', 'Error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications]);

    const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(n => n && !n.isRead).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                totalElements,
                totalPages,
                currentPage,
                loading,
                fetchNotifications,
                fetchAll,
                fetchByType,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}

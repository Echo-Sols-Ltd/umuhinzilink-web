'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '@/types';
import { notificationService } from '@/services/notification';
import { socketService } from '@/services/socket';
import { useAuth } from './AuthContext';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';
import { notify } from '@/lib/notify';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    totalElements: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    fetchAll: (params: { page: number; size: number }) => Promise<void>;
    fetchUnread: (params: { page: number; size: number }) => Promise<void>;
    fetchByType: (type: NotificationType, params: { page: number; size: number }) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    productNotifications: Notification[];
    orderNotifications: Notification[];
    systemNotifications: Notification[];
    unreadNotifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function normalizeNotifications(data: Notification[]): Notification[] {
    return data.map((n) => ({ ...n, id: String(n.id) }));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();
    const { showNotification } = useBrowserNotification();

    const applyPage = (res: {
        success: boolean;
        data?: Notification[];
        totalElements?: number;
        totalPages?: number;
        pageNumber?: number;
    }) => {
        if (!res.success) return;
        const list = normalizeNotifications(res.data ?? []);
        setNotifications(list);
        setTotalElements(res.totalElements ?? list.length);
        setTotalPages(res.totalPages ?? 1);
        setCurrentPage(res.pageNumber ?? 0);
    };

    const refreshUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch {
            setUnreadCount(notifications.filter(n => !n.isRead).length);
        }
    }, [user, notifications]);

    const fetchAll = useCallback(async (params: { page: number; size: number }) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await notificationService.getNotifications(params.page, params.size);
            applyPage(res);
            await refreshUnreadCount();
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user, refreshUnreadCount]);

    const fetchUnread = useCallback(async (params: { page: number; size: number }) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await notificationService.getUnreadNotifications(params.page, params.size);
            applyPage(res);
            await refreshUnreadCount();
        } catch (error) {
            console.error('Failed to fetch unread notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user, refreshUnreadCount]);

    const fetchByType = useCallback(async (type: NotificationType, params: { page: number; size: number }) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await notificationService.getByType(type, params.page, params.size);
            applyPage(res);
        } catch (error) {
            console.error('Failed to fetch notifications by type:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            const response = await notificationService.markAsRead(id);
            if (response.success) {
                setNotifications(prev =>
                    prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch {
            notify.error('Failed to mark notification as read', 'Error');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
                notify.success('All notifications marked as read', 'Success');
            }
        } catch {
            notify.error('Failed to mark all notifications as read', 'Error');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                await refreshUnreadCount();
            }
        } catch {
            notify.error('Failed to delete notification', 'Error');
        }
    };

    const clearAll = async () => {
        try {
            const response = await notificationService.deleteAllNotifications();
            if (response.success) {
                setNotifications([]);
                setUnreadCount(0);
                setTotalElements(0);
                notify.success('All notifications cleared', 'Success');
            }
        } catch {
            notify.error('Failed to clear notifications', 'Error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchAll({ page: 0, size: 15 });
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, fetchAll]);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = socketService.onNotification((incoming, wsMessage) => {
            setNotifications(prev => {
                const exists = prev.some(n => n.id === incoming.id);
                if (exists) return prev;
                return [incoming, ...prev];
            });
            setUnreadCount(prev => prev + 1);
            setTotalElements(prev => prev + 1);

            const title = incoming.title || wsMessage;
            const body = incoming.message || wsMessage;
            notify.info(body, title);
            showNotification({
                type: incoming.type === NotificationType.NEGOTIATION ? 'message' : 'order',
                title,
                body,
                onClick: () => { window.location.href = '/notifications'; },
            });
        });

        return unsubscribe;
    }, [user, showNotification]);

    const productNotifications = notifications.filter(n => n.type === NotificationType.PRODUCT);
    const orderNotifications = notifications.filter(n => n.type === NotificationType.ORDER);
    const systemNotifications = notifications.filter(n => n.type === NotificationType.SYSTEM);
    const unreadNotifications = notifications.filter(n => !n.isRead);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                totalElements,
                totalPages,
                currentPage,
                loading,
                fetchAll,
                fetchUnread,
                fetchByType,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
                productNotifications,
                orderNotifications,
                systemNotifications,
                unreadNotifications,
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

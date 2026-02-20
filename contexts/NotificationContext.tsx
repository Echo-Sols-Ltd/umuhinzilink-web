'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationFilter } from '@/types/notification';
import { notificationService } from '@/services/notification';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const fetchNotifications = useCallback(async (filter?: NotificationFilter) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(filter);
            if (response.success && response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
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
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to mark notification as read',
                variant: 'error',
            });
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                toast({
                    title: 'Success',
                    description: 'All notifications marked as read',
                    variant: 'success',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to mark all notifications as read',
                variant: 'error',
            });
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete notification',
                variant: 'error',
            });
        }
    };

    const clearAll = async () => {
        try {
            const response = await notificationService.deleteAllNotifications();
            if (response.success) {
                setNotifications([]);
                toast({
                    title: 'Success',
                    description: 'All notifications cleared',
                    variant: 'success',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to clear notifications',
                variant: 'error',
            });
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                fetchNotifications,
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

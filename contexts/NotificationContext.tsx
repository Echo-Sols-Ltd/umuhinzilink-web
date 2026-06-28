'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
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

function clearNotificationState(
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>,
    setTotalElements: React.Dispatch<React.SetStateAction<number>>,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
) {
    setNotifications((prev) => (prev.length === 0 ? prev : []));
    setUnreadCount((prev) => (prev === 0 ? prev : 0));
    setTotalElements((prev) => (prev === 0 ? prev : 0));
    setTotalPages((prev) => (prev === 0 ? prev : 0));
    setCurrentPage((prev) => (prev === 0 ? prev : 0));
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
    const userId = user?.id;
    const prevUserIdRef = useRef<string | undefined>(undefined);
    const showNotificationRef = useRef(showNotification);

    useEffect(() => {
        showNotificationRef.current = showNotification;
    }, [showNotification]);

    const applyPage = useCallback((res: {
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
    }, []);

    const refreshUnreadCount = useCallback(async () => {
        if (!userId) return;
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch {
            // Keep existing badge count if the unread endpoint fails.
        }
    }, [userId]);

    const fetchAll = useCallback(async (params: { page: number; size: number }) => {
        if (!userId) return;
        setLoading(true);
        try {
            const [listResult, countResult] = await Promise.allSettled([
                notificationService.getNotifications(params.page, params.size),
                notificationService.getUnreadCount(),
            ]);

            if (listResult.status === 'fulfilled') {
                applyPage(listResult.value);
            } else {
                throw listResult.reason;
            }

            if (countResult.status === 'fulfilled') {
                setUnreadCount(countResult.value);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            notify.error('Could not load notifications. Please try again.', 'Notifications');
        } finally {
            setLoading(false);
        }
    }, [userId, applyPage]);

    const fetchUnread = useCallback(async (params: { page: number; size: number }) => {
        if (!userId) return;
        setLoading(true);
        try {
            const [listResult, countResult] = await Promise.allSettled([
                notificationService.getUnreadNotifications(params.page, params.size),
                notificationService.getUnreadCount(),
            ]);

            if (listResult.status === 'fulfilled') {
                applyPage(listResult.value);
            } else {
                throw listResult.reason;
            }

            if (countResult.status === 'fulfilled') {
                setUnreadCount(countResult.value);
            }
        } catch (error) {
            console.error('Failed to fetch unread notifications:', error);
            notify.error('Could not load notifications. Please try again.', 'Notifications');
        } finally {
            setLoading(false);
        }
    }, [userId, applyPage]);

    const fetchByType = useCallback(async (type: NotificationType, params: { page: number; size: number }) => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await notificationService.getByType(type, params.page, params.size);
            applyPage(res);
        } catch (error) {
            console.error('Failed to fetch notifications by type:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, applyPage]);

    const markAsRead = useCallback(async (id: string) => {
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
    }, []);

    const markAllAsRead = useCallback(async () => {
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
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            const response = await notificationService.deleteNotification(id);
            if (response.success) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                await refreshUnreadCount();
            }
        } catch {
            notify.error('Failed to delete notification', 'Error');
        }
    }, [refreshUnreadCount]);

    const clearAll = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        const previousUserId = prevUserIdRef.current;
        prevUserIdRef.current = userId;

        if (!userId) {
            if (previousUserId) {
                clearNotificationState(
                    setNotifications,
                    setUnreadCount,
                    setTotalElements,
                    setTotalPages,
                    setCurrentPage,
                );
            }
            return;
        }

        if (previousUserId === userId) return;

        let cancelled = false;

        (async () => {
            try {
                const count = await notificationService.getUnreadCount();
                if (!cancelled) setUnreadCount(count);
            } catch (error) {
                if (!cancelled) console.error('Failed to fetch notification count:', error);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

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
            showNotificationRef.current({
                type: incoming.type === NotificationType.NEGOTIATION ? 'message' : 'order',
                title,
                body,
                onClick: () => { window.location.href = '/notifications'; },
            });
        });

        return unsubscribe;
    }, [userId]);

    const productNotifications = useMemo(
        () => notifications.filter(n => n.type === NotificationType.PRODUCT),
        [notifications],
    );
    const orderNotifications = useMemo(
        () => notifications.filter(n => n.type === NotificationType.ORDER),
        [notifications],
    );
    const systemNotifications = useMemo(
        () => notifications.filter(n => n.type === NotificationType.SYSTEM),
        [notifications],
    );
    const unreadNotifications = useMemo(
        () => notifications.filter(n => !n.isRead),
        [notifications],
    );

    const value = useMemo<NotificationContextType>(() => ({
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
    }), [
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
    ]);

    return (
        <NotificationContext.Provider value={value}>
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

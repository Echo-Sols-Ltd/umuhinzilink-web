'use client';

import { useNotificationContext } from '@/contexts/NotificationContext';

export const useNotification = () => {
    const context = useNotificationContext();
    return context;
};

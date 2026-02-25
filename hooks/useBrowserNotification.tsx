'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type NotificationType = 'message' | 'product' | 'order' | 'delivery';

export interface NotificationData {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  data?: any;
  onClick?: () => void;
}

interface UseBrowserNotificationReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  showNotification: (data: NotificationData) => void;
  isSupported: boolean;
  isEnabled: boolean;
}

export const useBrowserNotification = (): UseBrowserNotificationReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { user } = useAuth();

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const [isEnabled, setIsEnabled] = useState(false);

  // Check current permission status
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Browser notifications are not supported');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setIsEnabled(result === 'granted'); // Update isEnabled state
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission]);

  // Show notification
  const showNotification = useCallback((data: NotificationData) => {
    if (!isEnabled) {
      console.warn('Notifications are not enabled');
      return;
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        tag: `${data.type}-${user?.id || 'anonymous'}`,
        requireInteraction: true,
        data: data.data,
      });

      // Handle click events
      if (data.onClick) {
        notification.onclick = () => {
          data.onClick?.();
          notification.close();
        };
      } else {
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      console.log(`Notification shown: ${data.title}`);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [isEnabled, user?.id]);

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported,
    isEnabled,
  };
};

// Utility functions for specific notification types
export const createMessageNotification = (
  senderName: string,
  message: string,
  onClick?: () => void
): NotificationData => ({
  type: 'message',
  title: `New message from ${senderName}`,
  body: message.length > 100 ? message.substring(0, 100) + '...' : message,
  icon: '/icons/message.svg',
  onClick,
});

export const createProductNotification = (
  productName: string,
  action: 'new' | 'updated',
  onClick?: () => void
): NotificationData => ({
  type: 'product',
  title: `Product ${action === 'new' ? 'added' : 'updated'}`,
  body: `${productName} has been ${action === 'new' ? 'added to the marketplace' : 'updated'}`,
  icon: '/icons/product.svg',
  onClick,
});

export const createOrderNotification = (
  orderId: string,
  status: string,
  action: 'new' | 'status_change' | 'delivery_change',
  onClick?: () => void
): NotificationData => ({
  type: 'order',
  title: `Order ${action === 'new' ? 'received' : 'updated'}`,
  body: `Order #${orderId} ${action === 'new' ? 'has been placed' : `status changed to ${status}`}`,
  icon: '/icons/order.svg',
  onClick,
});

export const createDeliveryNotification = (
  orderId: string,
  deliveryStatus: string,
  onClick?: () => void
): NotificationData => ({
  type: 'delivery',
  title: 'Delivery update',
  body: `Order #${orderId} delivery status: ${deliveryStatus}`,
  icon: '/icons/delivery.svg',
  onClick,
});

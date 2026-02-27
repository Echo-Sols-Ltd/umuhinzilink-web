'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotificationStrategy } from './usePageVisibility';
import { notify } from '@/lib/notify';

type NotificationType = 'message' | 'product' | 'order' | 'delivery';

interface NotificationData {
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
  showNotification: (data: NotificationData) => boolean;
  isSupported: boolean;
  isEnabled: boolean;
  canShowBrowserNotifications: boolean;
  shouldUseInAppNotifications: boolean;
  shouldUseBrowserNotifications: boolean;
}

export const useBrowserNotification = (): UseBrowserNotificationReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const { shouldUseInAppNotifications, shouldUseBrowserNotifications } = useNotificationStrategy();

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

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
      setIsEnabled(result === 'granted');
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission]);

  // Show notification with intelligent routing
  const showNotification = useCallback((data: NotificationData): boolean => {
    console.log('📱 Showing notification:', data.type, 'Strategy:', shouldUseInAppNotifications ? 'In-App' : 'Browser');

    // Always show in-app notifications when page is visible
    if (shouldUseInAppNotifications) {
      console.log('✅ Showing in-app notification (page is visible)');
      notify.info(data.body, data.title);
      // Return false to indicate browser notification was not shown
      return false;
    }

    // Show browser notification when page is hidden
    if (shouldUseBrowserNotifications && isEnabled) {
      console.log('🔔 Showing browser notification (page is hidden)');
      try {
        const notification = new Notification(data.title, {
          body: data.body,
          icon: data.icon || '/favicon.ico',
          tag: `${data.type}-${Date.now()}`, // Prevent duplicates
          data: data.data,
        });

        // Handle click on browser notification
        if (data.onClick) {
          notification.onclick = () => {
            if (data.onClick) {
              data.onClick();
            }
            // Focus the window when notification is clicked
            if (typeof window !== 'undefined') {
              window.focus();
            }
          };
        }

        return true; // Browser notification was shown
      } catch (error) {
        console.error('Error showing browser notification:', error);
        return false;
      }
    }

    console.log('⚠️ Notification not shown (page hidden but no permission)');
    return false;
  }, [shouldUseInAppNotifications, shouldUseBrowserNotifications, isEnabled]);

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported,
    isEnabled,
    canShowBrowserNotifications: isSupported && isEnabled,
    shouldUseInAppNotifications,
    shouldUseBrowserNotifications,
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

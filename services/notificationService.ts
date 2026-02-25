import { useBrowserNotification, createMessageNotification, createProductNotification, createOrderNotification, createDeliveryNotification } from '@/hooks/useBrowserNotification';
import { OrderChangeResponse, OrderDeliveryChange } from '@/services/websocket';
import { useAuth } from '@/contexts/AuthContext';

export class NotificationService {
  private notificationHook: ReturnType<typeof useBrowserNotification>;
  private userId?: string;

  constructor(notificationHook: ReturnType<typeof useBrowserNotification>, userId?: string) {
    this.notificationHook = notificationHook;
    this.userId = userId;
  }

  // Handle new message notifications
  handleNewMessage = (senderName: string, message: string, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createMessageNotification(senderName, message, onClick);
    this.notificationHook.showNotification(notification);
  };

  // Handle new product notifications
  handleNewProduct = (productName: string, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createProductNotification(productName, 'new', onClick);
    this.notificationHook.showNotification(notification);
  };

  // Handle product update notifications
  handleProductUpdate = (productName: string, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createProductNotification(productName, 'updated', onClick);
    this.notificationHook.showNotification(notification);
  };

  // Handle new order notifications
  handleNewOrder = (orderData: OrderChangeResponse, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createOrderNotification(
      orderData.orderId,
      orderData.status,
      'new',
      onClick
    );
    this.notificationHook.showNotification(notification);
  };

  // Handle order status change notifications
  handleOrderStatusChange = (orderData: OrderChangeResponse, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createOrderNotification(
      orderData.orderId,
      orderData.status,
      'status_change',
      onClick
    );
    this.notificationHook.showNotification(notification);
  };

  // Handle delivery status change notifications
  handleDeliveryChange = (deliveryData: OrderDeliveryChange, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createDeliveryNotification(
      deliveryData.orderId,
      deliveryData.status,
      onClick
    );
    this.notificationHook.showNotification(notification);
  };

  // Handle chat message notifications
  handleChatMessage = (senderName: string, message: string, chatId?: string, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    const notification = createMessageNotification(senderName, message, onClick);
    this.notificationHook.showNotification(notification);
  };

  // Handle system notifications
  handleSystemNotification = (title: string, message: string, onClick?: () => void) => {
    if (!this.notificationHook.isEnabled) return;

    this.notificationHook.showNotification({
      type: 'order', // Using order type for system notifications
      title,
      body: message,
      icon: '/icons/system.svg',
      onClick,
    });
  };

  // Check if notifications are enabled
  get isEnabled(): boolean {
    return this.notificationHook.isEnabled;
  }

  // Get permission status
  get permission(): NotificationPermission {
    return this.notificationHook.permission;
  }

  // Request permission
  async requestPermission(): Promise<boolean> {
    return await this.notificationHook.requestPermission();
  }
}

// Hook to create notification service instance
export const useNotificationService = () => {
  const notificationHook = useBrowserNotification();
  const { user } = useAuth();
  
  const notificationService = new NotificationService(notificationHook, user?.id);
  
  return notificationService;
};

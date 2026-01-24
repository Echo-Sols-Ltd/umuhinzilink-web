'use client';

import * as React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X,
  Bell,
  Zap,
  Heart
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { notificationSlideIn, progressBarVariants } from './index';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  persistent?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

// Notification context
interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Individual notification component
interface NotificationProps {
  notification: NotificationData;
  onRemove: (id: string) => void;
  index: number;
}

const Notification: React.FC<NotificationProps> = ({ notification, onRemove, index }) => {
  const [progress, setProgress] = React.useState(100);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const progressRef = React.useRef<NodeJS.Timeout | null>(null);

  const { id, type, title, description, duration = 5000, action, icon, persistent } = notification;

  // Auto-dismiss logic
  React.useEffect(() => {
    if (persistent || isPaused || isDragging) return;

    const interval = 50;
    const decrement = (interval / duration) * 100;

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onRemove(id);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [id, duration, onRemove, persistent, isPaused, isDragging]);

  // Get notification styling based on type
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          description: 'text-green-700 dark:text-green-300',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          description: 'text-red-700 dark:text-red-300',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100',
          description: 'text-yellow-700 dark:text-yellow-300',
          progress: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          description: 'text-blue-700 dark:text-blue-300',
          progress: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-700 dark:text-gray-300',
          progress: 'bg-gray-500'
        };
    }
  };

  // Get default icon based on type
  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const styles = getNotificationStyles();
  const displayIcon = icon || getDefaultIcon();

  // Handle drag to dismiss
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100) {
      onRemove(id);
    }
  };

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={notificationSlideIn}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        'cursor-grab active:cursor-grabbing',
        styles.bg,
        styles.border,
        isDragging && 'scale-105 shadow-xl'
      )}
      style={{
        zIndex: 1000 - index,
      }}
    >
      {/* Progress bar */}
      {!persistent && (
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 h-1 rounded-b-lg',
            styles.progress
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          variants={progressBarVariants}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}

      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
        {displayIcon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium', styles.title)}>
          {title}
        </div>
        {description && (
          <div className={cn('mt-1 text-sm', styles.description)}>
            {description}
          </div>
        )}
        {action && (
          <div className="mt-3">
            <button
              onClick={action.onClick}
              className={cn(
                'text-sm font-medium underline-offset-4 hover:underline',
                styles.icon
              )}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(id)}
        className={cn(
          'flex-shrink-0 rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5',
          'transition-colors duration-200',
          styles.icon
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// Notification container component
interface NotificationContainerProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
  position: NotificationData['position'];
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (notifications.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        getPositionClasses()
      )}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              notification={notification}
              onRemove={onRemove}
              index={index}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Notification provider component
interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultPosition?: NotificationData['position'];
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultPosition = 'top-right'
}) => {
  const [notifications, setNotifications] = React.useState<NotificationData[]>([]);

  const addNotification = React.useCallback((notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationData = {
      ...notification,
      id,
      position: notification.position || defaultPosition
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    return id;
  }, [maxNotifications, defaultPosition]);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  // Group notifications by position
  const notificationsByPosition = React.useMemo(() => {
    const groups: Record<string, NotificationData[]> = {};
    notifications.forEach((notification) => {
      const position = notification.position || defaultPosition;
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(notification);
    });
    return groups;
  }, [notifications, defaultPosition]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll
      }}
    >
      {children}
      {Object.entries(notificationsByPosition).map(([position, positionNotifications]) => (
        <NotificationContainer
          key={position}
          notifications={positionNotifications}
          onRemove={removeNotification}
          position={position as NotificationData['position']}
        />
      ))}
    </NotificationContext.Provider>
  );
};

// Convenience hooks for different notification types
export const useNotificationActions = () => {
  const { addNotification } = useNotifications();

  return React.useMemo(() => ({
    success: (title: string, description?: string, options?: Partial<NotificationData>) =>
      addNotification({ type: 'success', title, description, ...options }),
    
    error: (title: string, description?: string, options?: Partial<NotificationData>) =>
      addNotification({ type: 'error', title, description, ...options }),
    
    warning: (title: string, description?: string, options?: Partial<NotificationData>) =>
      addNotification({ type: 'warning', title, description, ...options }),
    
    info: (title: string, description?: string, options?: Partial<NotificationData>) =>
      addNotification({ type: 'info', title, description, ...options }),
    
    custom: (notification: Omit<NotificationData, 'id'>) =>
      addNotification(notification)
  }), [addNotification]);
};
'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Loader2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export interface NotificationData {
  id: string;
  title?: string;
  description: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  onClose?: () => void;
  dismissible?: boolean;
  showProgress?: boolean;
}

interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<NotificationData>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const getVariantConfig = (variant: NotificationData['variant']) => {
  switch (variant) {
    case 'success':
      return {
        icon: CheckCircle,
        colors: {
          bg: 'bg-green-50 dark:bg-green-950/50',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          description: 'text-green-700 dark:text-green-200',
          progress: 'bg-green-500',
          closeButton: 'text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300',
          actionPrimary: 'bg-green-600 hover:bg-green-700 text-white',
          actionSecondary: 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-950',
        },
        shadow: 'shadow-green-500/10',
      };
    case 'error':
      return {
        icon: AlertCircle,
        colors: {
          bg: 'bg-red-50 dark:bg-red-950/50',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          description: 'text-red-700 dark:text-red-200',
          progress: 'bg-red-500',
          closeButton: 'text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300',
          actionPrimary: 'bg-red-600 hover:bg-red-700 text-white',
          actionSecondary: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950',
        },
        shadow: 'shadow-red-500/10',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        colors: {
          bg: 'bg-amber-50 dark:bg-amber-950/50',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-600 dark:text-amber-400',
          title: 'text-amber-900 dark:text-amber-100',
          description: 'text-amber-700 dark:text-amber-200',
          progress: 'bg-amber-500',
          closeButton: 'text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300',
          actionPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
          actionSecondary: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-950',
        },
        shadow: 'shadow-amber-500/10',
      };
    case 'info':
      return {
        icon: Info,
        colors: {
          bg: 'bg-blue-50 dark:bg-blue-950/50',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          description: 'text-blue-700 dark:text-blue-200',
          progress: 'bg-blue-500',
          closeButton: 'text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300',
          actionPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          actionSecondary: 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-950',
        },
        shadow: 'shadow-blue-500/10',
      };
    case 'loading':
      return {
        icon: Loader2,
        colors: {
          bg: 'bg-gray-50 dark:bg-gray-950/50',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-700 dark:text-gray-200',
          progress: 'bg-gray-500',
          closeButton: 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
          actionPrimary: 'bg-gray-600 hover:bg-gray-700 text-white',
          actionSecondary: 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-950',
        },
        shadow: 'shadow-gray-500/10',
      };
  }
};

interface NotificationItemProps {
  notification: NotificationData;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<NotificationData>) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  index, 
  onRemove, 
  onUpdate 
}) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const config = getVariantConfig(notification.variant);
  const Icon = config.icon;

  // Handle auto-dismiss with progress
  useEffect(() => {
    if (notification.persistent || !notification.duration || notification.duration <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (notification.duration! / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [notification.duration, notification.persistent]);

  // Pause progress on hover
  useEffect(() => {
    if (isHovered && notification.duration && !notification.persistent) {
      setProgress(prev => prev); // Pause progress
    }
  }, [isHovered, notification.duration, notification.persistent]);

  const handleClose = useCallback(() => {
    onRemove(notification.id);
    notification.onClose?.();
  }, [notification.id, notification.onClose, onRemove]);

  const handleAction = useCallback(() => {
    notification.action?.onClick();
    if (!notification.persistent) {
      handleClose();
    }
  }, [notification.action, notification.persistent, handleClose]);

  const slideInVariants: Variants = {
    initial: { 
      opacity: 0, 
      x: 400, 
      scale: 0.95,
      rotateY: -15
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: 400, 
      scale: 0.95,
      rotateY: 15,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants: Variants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: index * 0.1 + 0.2
      }
    }
  };

  return (
    <motion.div
      layout
      variants={slideInVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-xl border backdrop-blur-sm',
        config.colors.bg,
        config.colors.border,
        config.shadow,
        'shadow-lg',
        'transform-gpu' // Enable hardware acceleration
      )}
      style={{
        marginBottom: index < 4 ? '12px' : '8px', // Closer stacking for more notifications
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      {/* Progress bar */}
      {notification.showProgress && notification.duration && !notification.persistent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={cn('h-full', config.colors.progress)}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Animated Icon */}
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            className="flex-shrink-0 mt-0.5"
          >
            <Icon 
              className={cn(
                'w-5 h-5',
                config.colors.icon,
                notification.variant === 'loading' && 'animate-spin'
              )} 
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <motion.h4 
                className={cn('text-sm font-semibold mb-1', config.colors.title)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {notification.title}
              </motion.h4>
            )}
            <motion.p 
              className={cn('text-sm leading-relaxed', config.colors.description)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {notification.description}
            </motion.p>

            {/* Action Button */}
            {notification.action && (
              <motion.div 
                className="mt-3 flex justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <button
                  onClick={handleAction}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    notification.action.variant === 'primary' 
                      ? config.colors.actionPrimary
                      : cn('border', config.colors.actionSecondary)
                  )}
                >
                  {notification.action.label}
                  {notification.action.variant === 'primary' && (
                    <ChevronRight className="w-3 h-3 ml-1" />
                  )}
                  {notification.action.variant === 'secondary' && (
                    <ExternalLink className="w-3 h-3 ml-1" />
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Close Button */}
          {notification.dismissible !== false && (
            <motion.button
              onClick={handleClose}
              className={cn(
                'flex-shrink-0 rounded-full p-1.5 transition-all duration-200',
                'hover:scale-110 active:scale-95',
                config.colors.closeButton
              )}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close notification</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notificationData: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationData = {
      id,
      duration: 5000,
      dismissible: true,
      showProgress: true,
      ...notificationData,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<NotificationData>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    updateNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 right-4 z-[1080] pointer-events-none">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => (
                <div key={notification.id} className="pointer-events-auto">
                  <NotificationItem
                    notification={notification}
                    index={index}
                    onRemove={removeNotification}
                    onUpdate={updateNotification}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </NotificationContext.Provider>
  );
};

// Convenience hook for creating notifications
export const useNotificationActions = () => {
  const { addNotification, removeNotification, clearAll, updateNotification } = useNotifications();

  return {
    success: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) =>
      addNotification({ ...options, description, variant: 'success' }),
    
    error: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) =>
      addNotification({ ...options, description, variant: 'error', duration: 8000 }),
    
    warning: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) =>
      addNotification({ ...options, description, variant: 'warning', duration: 6000 }),
    
    info: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) =>
      addNotification({ ...options, description, variant: 'info' }),
    
    loading: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) =>
      addNotification({ 
        ...options, 
        description, 
        variant: 'loading', 
        duration: 0, 
        persistent: true,
        dismissible: false,
        showProgress: false
      }),
    
    custom: (data: Omit<NotificationData, 'id'>) => addNotification(data),
    
    dismiss: removeNotification,
    dismissAll: clearAll,
    update: updateNotification,
  };
};

// Standalone notification functions
let globalNotificationActions: ReturnType<typeof useNotificationActions> | null = null;

export const setGlobalNotificationActions = (actions: ReturnType<typeof useNotificationActions>) => {
  globalNotificationActions = actions;
};

export const notify = {
  success: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return '';
    }
    return globalNotificationActions.success(description, options);
  },
  
  error: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return '';
    }
    return globalNotificationActions.error(description, options);
  },
  
  warning: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return '';
    }
    return globalNotificationActions.warning(description, options);
  },
  
  info: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return '';
    }
    return globalNotificationActions.info(description, options);
  },
  
  loading: (description: string, options?: Partial<Omit<NotificationData, 'id' | 'variant' | 'description'>>) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return '';
    }
    return globalNotificationActions.loading(description, options);
  },
  
  dismiss: (id: string) => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return;
    }
    globalNotificationActions.dismiss(id);
  },
  
  dismissAll: () => {
    if (!globalNotificationActions) {
      console.warn('NotificationProvider not found. Please wrap your app with NotificationProvider.');
      return;
    }
    globalNotificationActions.dismissAll();
  },
};
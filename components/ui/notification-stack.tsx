'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo, Variants } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Loader2,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StackedNotification {
  id: string;
  title?: string;
  description: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  persistent?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  onClose?: () => void;
  dismissible?: boolean;
  swipeable?: boolean;
  expandable?: boolean;
  timestamp?: Date;
  category?: string;
  metadata?: Record<string, any>;
}

interface NotificationStackContextType {
  notifications: StackedNotification[];
  addNotification: (notification: Omit<StackedNotification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearByCategory: (category: string) => void;
  updateNotification: (id: string, updates: Partial<StackedNotification>) => void;
  pauseAll: () => void;
  resumeAll: () => void;
  maxVisible: number;
  setMaxVisible: (max: number) => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  setPosition: (position: NotificationStackContextType['position']) => void;
}

const NotificationStackContext = createContext<NotificationStackContextType | undefined>(undefined);

export const useNotificationStack = () => {
  const context = useContext(NotificationStackContext);
  if (!context) {
    throw new Error('useNotificationStack must be used within a NotificationStackProvider');
  }
  return context;
};

const getVariantConfig = (variant: StackedNotification['variant']) => {
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
        glow: 'shadow-green-500/20',
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
        glow: 'shadow-red-500/20',
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
        glow: 'shadow-amber-500/20',
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
        glow: 'shadow-blue-500/20',
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
        glow: 'shadow-gray-500/20',
      };
  }
};

const getPriorityConfig = (priority: StackedNotification['priority'] = 'normal') => {
  switch (priority) {
    case 'urgent':
      return {
        zIndex: 'z-[1090]',
        scale: 1.02,
        glow: true,
        pulse: true,
        duration: 0,
      };
    case 'high':
      return {
        zIndex: 'z-[1085]',
        scale: 1.01,
        glow: true,
        pulse: false,
        duration: 8000,
      };
    case 'low':
      return {
        zIndex: 'z-[1075]',
        scale: 0.98,
        glow: false,
        pulse: false,
        duration: 3000,
      };
    case 'normal':
    default:
      return {
        zIndex: 'z-[1080]',
        scale: 1,
        glow: false,
        pulse: false,
        duration: 5000,
      };
  }
};

const getPositionStyles = (position: NotificationStackContextType['position']) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 transform -translate-x-1/2';
    case 'bottom-center':
      return 'bottom-4 left-1/2 transform -translate-x-1/2';
    case 'top-right':
    default:
      return 'top-4 right-4';
  }
};

interface StackedNotificationItemProps {
  notification: StackedNotification;
  index: number;
  totalVisible: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<StackedNotification>) => void;
  isPaused: boolean;
}

const StackedNotificationItem: React.FC<StackedNotificationItemProps> = ({ 
  notification, 
  index, 
  totalVisible,
  onRemove, 
  onUpdate,
  isPaused
}) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const config = getVariantConfig(notification.variant);
  const priorityConfig = getPriorityConfig(notification.priority);
  const Icon = config.icon;

  // Calculate stacking offset
  const stackOffset = Math.min(index * 4, 12);
  const stackScale = Math.max(1 - index * 0.02, 0.94);
  const stackOpacity = Math.max(1 - index * 0.1, 0.7);

  // Handle auto-dismiss with progress
  useEffect(() => {
    if (notification.persistent || !notification.duration || notification.duration <= 0 || isPaused || isHovered) {
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
  }, [notification.duration, notification.persistent, isPaused, isHovered]);

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

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (notification.swipeable !== false) {
      const threshold = 100;
      if (Math.abs(info.offset.x) > threshold) {
        handleClose();
      }
    }
  };

  const slideInVariants: Variants = {
    initial: { 
      opacity: 0, 
      x: 400, 
      scale: 0.9,
      rotateY: -10
    },
    animate: { 
      opacity: stackOpacity, 
      x: 0, 
      scale: stackScale * priorityConfig.scale,
      rotateY: 0,
      y: stackOffset,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.05
      }
    },
    exit: { 
      opacity: 0, 
      x: 400, 
      scale: 0.9,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: stackScale * priorityConfig.scale * 1.02,
      y: stackOffset - 2,
      transition: { duration: 0.2 }
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
        delay: index * 0.05 + 0.1
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
      whileHover="hover"
      drag={notification.swipeable !== false ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className={cn(
        'relative w-full max-w-sm overflow-hidden rounded-xl border backdrop-blur-sm cursor-pointer',
        'transform-gpu', // Enable hardware acceleration
        config.colors.bg,
        config.colors.border,
        config.shadow,
        priorityConfig.glow && config.glow,
        priorityConfig.zIndex,
        isDragging && 'rotate-2',
        index > 0 && 'pointer-events-none' // Only top notification is interactive
      )}
      style={{
        marginBottom: index === totalVisible - 1 ? 0 : -stackOffset + 4,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority Pulse Effect */}
      {priorityConfig.pulse && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl',
            config.colors.border,
            'border-2 opacity-50'
          )}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Progress bar */}
      {notification.duration && !notification.persistent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={cn('h-full', config.colors.progress)}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}

      <div className={cn('p-4', isExpanded && 'pb-6')}>
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
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <motion.h4 
                    className={cn('text-sm font-semibold mb-1', config.colors.title)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    {notification.title}
                  </motion.h4>
                )}
                <motion.p 
                  className={cn(
                    'text-sm leading-relaxed',
                    config.colors.description,
                    !isExpanded && 'line-clamp-2'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                >
                  {notification.description}
                </motion.p>

                {/* Metadata */}
                {isExpanded && notification.metadata && (
                  <motion.div
                    className="mt-2 text-xs opacity-70"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.7, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                  >
                    {notification.timestamp && (
                      <p>
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    )}
                    {notification.category && (
                      <p className="capitalize">
                        Category: {notification.category}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-1 ml-2">
                {/* Expand/Collapse Button */}
                {notification.expandable && (
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                      'flex-shrink-0 rounded-full p-1 transition-all duration-200',
                      'hover:scale-110 active:scale-95',
                      config.colors.closeButton
                    )}
                    whileHover={{ rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-3 h-3" />
                    ) : (
                      <Maximize2 className="w-3 h-3" />
                    )}
                  </motion.button>
                )}

                {/* Close Button */}
                {notification.dismissible !== false && (
                  <motion.button
                    onClick={handleClose}
                    className={cn(
                      'flex-shrink-0 rounded-full p-1 transition-all duration-200',
                      'hover:scale-110 active:scale-95',
                      config.colors.closeButton
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.4 }}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                    <span className="sr-only">Close notification</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Action Button */}
            {notification.action && (
              <motion.div 
                className="mt-3 flex justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.4 }}
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
        </div>
      </div>

      {/* Swipe Indicator */}
      {notification.swipeable !== false && isDragging && (
        <motion.div
          className="absolute inset-y-0 right-0 w-1 bg-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

export const NotificationStackProvider: React.FC<{ 
  children: React.ReactNode;
  maxVisible?: number;
  position?: NotificationStackContextType['position'];
}> = ({ 
  children, 
  maxVisible: initialMaxVisible = 5,
  position: initialPosition = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<StackedNotification[]>([]);
  const [maxVisible, setMaxVisible] = useState(initialMaxVisible);
  const [position, setPosition] = useState(initialPosition);
  const [isPaused, setIsPaused] = useState(false);

  // Sort notifications by priority and timestamp
  const sortedNotifications = notifications
    .sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'normal'];
      const bPriority = priorityOrder[b.priority || 'normal'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0);
    })
    .slice(0, maxVisible);

  const addNotification = useCallback((notificationData: Omit<StackedNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: StackedNotification = {
      id,
      duration: 5000,
      dismissible: true,
      swipeable: true,
      expandable: false,
      priority: 'normal',
      timestamp: new Date(),
      ...notificationData,
    };

    setNotifications(prev => [newNotification, ...prev]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<StackedNotification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearByCategory = useCallback((category: string) => {
    setNotifications(prev => prev.filter(notification => notification.category !== category));
  }, []);

  const pauseAll = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAll = useCallback(() => {
    setIsPaused(false);
  }, []);

  const contextValue: NotificationStackContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    clearByCategory,
    updateNotification,
    pauseAll,
    resumeAll,
    maxVisible,
    setMaxVisible,
    position,
    setPosition,
  };

  return (
    <NotificationStackContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className={cn('fixed pointer-events-none z-[1080]', getPositionStyles(position))}>
            <AnimatePresence mode="popLayout">
              {sortedNotifications.map((notification, index) => (
                <div key={notification.id} className="pointer-events-auto mb-2">
                  <StackedNotificationItem
                    notification={notification}
                    index={index}
                    totalVisible={sortedNotifications.length}
                    onRemove={removeNotification}
                    onUpdate={updateNotification}
                    isPaused={isPaused}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </NotificationStackContext.Provider>
  );
};

// Convenience hook for creating stacked notifications
export const useStackedNotifications = () => {
  const { addNotification, removeNotification, clearAll, clearByCategory, updateNotification, pauseAll, resumeAll } = useNotificationStack();

  return {
    success: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp'>>) =>
      addNotification({ ...options, description, variant: 'success' }),
    
    error: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp'>>) =>
      addNotification({ ...options, description, variant: 'error', duration: 8000, priority: 'high' }),
    
    warning: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp'>>) =>
      addNotification({ ...options, description, variant: 'warning', duration: 6000 }),
    
    info: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp'>>) =>
      addNotification({ ...options, description, variant: 'info' }),
    
    loading: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp'>>) =>
      addNotification({ 
        ...options, 
        description, 
        variant: 'loading', 
        duration: 0, 
        persistent: true,
        dismissible: false,
        swipeable: false
      }),
    
    urgent: (description: string, options?: Partial<Omit<StackedNotification, 'id' | 'variant' | 'description' | 'timestamp' | 'priority'>>) =>
      addNotification({ ...options, description, variant: 'error', priority: 'urgent', persistent: true }),
    
    custom: (data: Omit<StackedNotification, 'id' | 'timestamp'>) => addNotification(data),
    
    dismiss: removeNotification,
    dismissAll: clearAll,
    dismissByCategory: clearByCategory,
    update: updateNotification,
    pause: pauseAll,
    resume: resumeAll,
  };
};
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InlineErrorProps {
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  variant?: 'default' | 'subtle' | 'bordered' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  dismissible?: boolean;
  animate?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  onDismiss?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const getTypeConfig = (type: InlineErrorProps['type'] = 'error') => {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle,
        colors: {
          default: {
            bg: 'bg-green-50 dark:bg-green-950/20',
            border: 'border-green-200 dark:border-green-800/50',
            text: 'text-green-800 dark:text-green-200',
            icon: 'text-green-600 dark:text-green-400',
          },
          subtle: {
            bg: 'bg-transparent',
            border: 'border-transparent',
            text: 'text-green-700 dark:text-green-300',
            icon: 'text-green-600 dark:text-green-400',
          },
          bordered: {
            bg: 'bg-transparent',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: 'text-green-600 dark:text-green-400',
          },
          filled: {
            bg: 'bg-green-600 dark:bg-green-700',
            border: 'border-green-600 dark:border-green-700',
            text: 'text-white',
            icon: 'text-green-100',
          },
        },
        actionColors: {
          primary: 'bg-green-600 hover:bg-green-700 text-white',
          secondary: 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-950/30',
        },
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        colors: {
          default: {
            bg: 'bg-amber-50 dark:bg-amber-950/20',
            border: 'border-amber-200 dark:border-amber-800/50',
            text: 'text-amber-800 dark:text-amber-200',
            icon: 'text-amber-600 dark:text-amber-400',
          },
          subtle: {
            bg: 'bg-transparent',
            border: 'border-transparent',
            text: 'text-amber-700 dark:text-amber-300',
            icon: 'text-amber-600 dark:text-amber-400',
          },
          bordered: {
            bg: 'bg-transparent',
            border: 'border-amber-200 dark:border-amber-800',
            text: 'text-amber-800 dark:text-amber-200',
            icon: 'text-amber-600 dark:text-amber-400',
          },
          filled: {
            bg: 'bg-amber-600 dark:bg-amber-700',
            border: 'border-amber-600 dark:border-amber-700',
            text: 'text-white',
            icon: 'text-amber-100',
          },
        },
        actionColors: {
          primary: 'bg-amber-600 hover:bg-amber-700 text-white',
          secondary: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-950/30',
        },
      };
    case 'info':
      return {
        icon: Info,
        colors: {
          default: {
            bg: 'bg-blue-50 dark:bg-blue-950/20',
            border: 'border-blue-200 dark:border-blue-800/50',
            text: 'text-blue-800 dark:text-blue-200',
            icon: 'text-blue-600 dark:text-blue-400',
          },
          subtle: {
            bg: 'bg-transparent',
            border: 'border-transparent',
            text: 'text-blue-700 dark:text-blue-300',
            icon: 'text-blue-600 dark:text-blue-400',
          },
          bordered: {
            bg: 'bg-transparent',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: 'text-blue-600 dark:text-blue-400',
          },
          filled: {
            bg: 'bg-blue-600 dark:bg-blue-700',
            border: 'border-blue-600 dark:border-blue-700',
            text: 'text-white',
            icon: 'text-blue-100',
          },
        },
        actionColors: {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-950/30',
        },
      };
    case 'error':
    default:
      return {
        icon: AlertCircle,
        colors: {
          default: {
            bg: 'bg-red-50 dark:bg-red-950/20',
            border: 'border-red-200 dark:border-red-800/50',
            text: 'text-red-800 dark:text-red-200',
            icon: 'text-red-600 dark:text-red-400',
          },
          subtle: {
            bg: 'bg-transparent',
            border: 'border-transparent',
            text: 'text-red-700 dark:text-red-300',
            icon: 'text-red-600 dark:text-red-400',
          },
          bordered: {
            bg: 'bg-transparent',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: 'text-red-600 dark:text-red-400',
          },
          filled: {
            bg: 'bg-red-600 dark:bg-red-700',
            border: 'border-red-600 dark:border-red-700',
            text: 'text-white',
            icon: 'text-red-100',
          },
        },
        actionColors: {
          primary: 'bg-red-600 hover:bg-red-700 text-white',
          secondary: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950/30',
        },
      };
  }
};

const getSizeConfig = (size: InlineErrorProps['size'] = 'md') => {
  switch (size) {
    case 'sm':
      return {
        padding: 'p-2',
        text: 'text-xs',
        icon: 'w-3 h-3',
        gap: 'space-x-2',
        button: 'px-2 py-1 text-xs',
        closeButton: 'p-0.5',
        closeIcon: 'w-3 h-3',
      };
    case 'lg':
      return {
        padding: 'p-4',
        text: 'text-base',
        icon: 'w-6 h-6',
        gap: 'space-x-4',
        button: 'px-4 py-2 text-sm',
        closeButton: 'p-2',
        closeIcon: 'w-5 h-5',
      };
    case 'md':
    default:
      return {
        padding: 'p-3',
        text: 'text-sm',
        icon: 'w-4 h-4',
        gap: 'space-x-3',
        button: 'px-3 py-1.5 text-sm',
        closeButton: 'p-1',
        closeIcon: 'w-4 h-4',
      };
  }
};

export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  type = 'error',
  variant = 'default',
  size = 'md',
  icon = true,
  dismissible = false,
  animate = true,
  action,
  onDismiss,
  className,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  const config = getTypeConfig(type);
  const sizeConfig = getSizeConfig(size);
  const Icon = config.icon;
  const colors = config.colors[variant];

  // Trigger shake animation for errors
  useEffect(() => {
    if (type === 'error' && animate) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [type, animate, message]);

  const handleDismiss = () => {
    if (animate) {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), 200);
    } else {
      onDismiss?.();
    }
  };

  const handleAction = () => {
    action?.onClick();
  };

  if (!message && !children) return null;

  const content = (
    <motion.div
      className={cn(
        'rounded-lg border transition-all duration-200',
        colors.bg,
        colors.border,
        sizeConfig.padding,
        isShaking && 'animate-shake',
        className
      )}
      animate={isShaking ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className={cn('flex items-start', sizeConfig.gap)}>
        {/* Icon */}
        {icon && (
          <motion.div
            initial={animate ? { scale: 0, rotate: -180 } : {}}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.1 
            }}
            className="flex-shrink-0 mt-0.5"
          >
            <Icon className={cn(sizeConfig.icon, colors.icon)} />
          </motion.div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {message && (
            <motion.p
              className={cn(sizeConfig.text, colors.text, 'leading-relaxed')}
              initial={animate ? { opacity: 0, y: 10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={animate ? { opacity: 0, y: 10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}

          {/* Action Button */}
          {action && (
            <motion.div
              className="mt-2"
              initial={animate ? { opacity: 0, scale: 0.9 } : {}}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleAction}
                className={cn(
                  'inline-flex items-center rounded-md font-medium transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  sizeConfig.button,
                  action.variant === 'primary' 
                    ? config.actionColors.primary
                    : cn('border', config.actionColors.secondary)
                )}
              >
                {action.label}
                {action.variant === 'primary' ? (
                  <RefreshCw className="w-3 h-3 ml-1.5" />
                ) : (
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <motion.button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 rounded-full transition-all duration-200',
              'hover:scale-110 active:scale-95',
              colors.icon,
              'hover:opacity-70',
              sizeConfig.closeButton
            )}
            initial={animate ? { opacity: 0, scale: 0 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className={sizeConfig.closeIcon} />
            <span className="sr-only">Dismiss</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  if (!animate) {
    return content;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Field Error Component for Forms
export interface FieldErrorProps extends Omit<InlineErrorProps, 'type' | 'variant'> {
  error?: string | string[];
  touched?: boolean;
  showIcon?: boolean;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  touched = true,
  showIcon = true,
  animate = true,
  className,
  ...props
}) => {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  
  if (!errorMessage || !touched) return null;

  return (
    <InlineError
      message={errorMessage}
      type="error"
      variant="subtle"
      size="sm"
      icon={showIcon}
      animate={animate}
      className={cn('mt-1', className)}
      {...props}
    />
  );
};

// Success Message Component
export const SuccessMessage: React.FC<Omit<InlineErrorProps, 'type'>> = (props) => (
  <InlineError type="success" {...props} />
);

// Warning Message Component
export const WarningMessage: React.FC<Omit<InlineErrorProps, 'type'>> = (props) => (
  <InlineError type="warning" {...props} />
);

// Info Message Component
export const InfoMessage: React.FC<Omit<InlineErrorProps, 'type'>> = (props) => (
  <InlineError type="info" {...props} />
);

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class InlineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('InlineErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <InlineError
          type="error"
          variant="bordered"
          message="Something went wrong. Please try again."
          action={{
            label: "Retry",
            onClick: this.retry,
            variant: "primary"
          }}
          dismissible
          onDismiss={this.retry}
        />
      );
    }

    return this.props.children;
  }
}
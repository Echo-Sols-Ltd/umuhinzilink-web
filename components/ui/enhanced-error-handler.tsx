'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useNotificationActions } from './enhanced-notification-system';
import { useStackedNotifications } from './notification-stack';
import { InlineError } from './enhanced-inline-errors';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export interface ErrorInfo {
  message: string;
  code?: string | number;
  type?: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'client' | 'timeout' | 'unknown';
  context?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
  retryable?: boolean;
  critical?: boolean;
}

export interface ErrorHandlerOptions {
  showNotification?: boolean;
  showInline?: boolean;
  notificationType?: 'standard' | 'stacked';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  persistent?: boolean;
  category?: string;
  onRetry?: () => void | Promise<void>;
  onDismiss?: () => void;
}

interface ErrorHandlerContextType {
  handleError: (error: Error | ErrorInfo | string, options?: ErrorHandlerOptions) => void;
  clearErrors: (category?: string) => void;
  retryLastError: () => void;
  getErrorSuggestion: (error: ErrorInfo) => string;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }
  return context;
};

const parseError = (error: Error | ErrorInfo | string): ErrorInfo => {
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
      timestamp: new Date(),
      retryable: false,
    };
  }

  if (error instanceof Error) {
    // Parse common error patterns
    const message = error.message;
    let type: ErrorInfo['type'] = 'unknown';
    let retryable = false;

    if (message.includes('fetch') || message.includes('network') || message.includes('Network')) {
      type = 'network';
      retryable = true;
    } else if (message.includes('timeout') || message.includes('timed out')) {
      type = 'timeout';
      retryable = true;
    } else if (message.includes('401') || message.includes('Unauthorized')) {
      type = 'authentication';
      retryable = false;
    } else if (message.includes('403') || message.includes('Forbidden')) {
      type = 'authorization';
      retryable = false;
    } else if (message.includes('404') || message.includes('Not Found')) {
      type = 'client';
      retryable = false;
    } else if (message.includes('500') || message.includes('server')) {
      type = 'server';
      retryable = true;
    } else if (message.includes('validation') || message.includes('invalid')) {
      type = 'validation';
      retryable = false;
    }

    return {
      message,
      type,
      retryable,
      timestamp: new Date(),
      code: (error as any).code || (error as any).status,
      metadata: {
        stack: error.stack,
        name: error.name,
      },
    };
  }

  return {
    ...error,
    timestamp: error.timestamp || new Date(),
  };
};

const getErrorIcon = (type: ErrorInfo['type']) => {
  switch (type) {
    case 'network':
    case 'timeout':
      return '🌐';
    case 'authentication':
      return '🔐';
    case 'authorization':
      return '🚫';
    case 'validation':
      return '⚠️';
    case 'server':
      return '🔧';
    case 'client':
      return '❓';
    default:
      return '❌';
  }
};

const getErrorSuggestion = (error: ErrorInfo): string => {
  switch (error.type) {
    case 'network':
      return 'Please check your internet connection and try again.';
    case 'timeout':
      return 'The request took too long. Please try again or check your connection.';
    case 'authentication':
      return 'Your session has expired. Please sign in again.';
    case 'authorization':
      return 'You don\'t have permission to perform this action.';
    case 'validation':
      return 'Please check your input and try again.';
    case 'server':
      return 'We\'re experiencing technical difficulties. Please try again later.';
    case 'client':
      return 'The requested resource was not found.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

const getErrorPriority = (error: ErrorInfo): 'low' | 'normal' | 'high' | 'urgent' => {
  if (error.critical) return 'urgent';
  
  switch (error.type) {
    case 'authentication':
    case 'server':
      return 'high';
    case 'network':
    case 'timeout':
      return 'normal';
    case 'validation':
    case 'client':
      return 'low';
    default:
      return 'normal';
  }
};

export const ErrorHandlerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotificationActions();
  const stackedNotifications = useStackedNotifications();
  const { isOnline } = useNetworkStatus();
  
  const [lastError, setLastError] = React.useState<{
    error: ErrorInfo;
    options: ErrorHandlerOptions;
  } | null>(null);

  const handleError = useCallback((
    error: Error | ErrorInfo | string, 
    options: ErrorHandlerOptions = {}
  ) => {
    const parsedError = parseError(error);
    const suggestion = getErrorSuggestion(parsedError);
    const priority = options.priority || getErrorPriority(parsedError);
    
    // Store for retry functionality
    setLastError({ error: parsedError, options });

    // Enhance error message with network status
    let enhancedMessage = parsedError.message;
    if (parsedError.type === 'network' && !isOnline) {
      enhancedMessage = 'You appear to be offline. Please check your internet connection.';
    }

    const errorTitle = `${getErrorIcon(parsedError.type)} ${parsedError.type === 'unknown' ? 'Error' : (parsedError.type ? parsedError.type.charAt(0).toUpperCase() + parsedError.type.slice(1) : 'Error')} Error`;
    
    // Show notification if requested
    if (options.showNotification !== false) {
      const notificationOptions = {
        title: errorTitle,
        persistent: options.persistent || parsedError.critical,
        priority,
        category: options.category || parsedError.type || 'error',
        action: parsedError.retryable && options.onRetry ? {
          label: 'Retry',
          onClick: options.onRetry,
          variant: 'primary' as const,
        } : undefined,
        onClose: options.onDismiss,
        expandable: !!parsedError.metadata,
        metadata: {
          ...parsedError.metadata,
          suggestion,
          timestamp: parsedError.timestamp,
          code: parsedError.code,
        },
      };

      if (options.notificationType === 'stacked') {
        stackedNotifications.error(enhancedMessage, notificationOptions);
      } else {
        notifications.error(enhancedMessage, notificationOptions);
      }
    }

    // Log error for debugging
    console.error('Enhanced Error Handler:', {
      error: parsedError,
      options,
      suggestion,
      isOnline,
    });

    // Report to error tracking service (if available)
    if (typeof window !== 'undefined' && (window as any).errorTracker) {
      (window as any).errorTracker.captureError(parsedError);
    }
  }, [notifications, stackedNotifications, isOnline]);

  const clearErrors = useCallback((category?: string) => {
    if (category) {
      stackedNotifications.dismissByCategory(category);
    } else {
      notifications.dismissAll();
      stackedNotifications.dismissAll();
    }
  }, [notifications, stackedNotifications]);

  const retryLastError = useCallback(() => {
    if (lastError?.options.onRetry) {
      lastError.options.onRetry();
    }
  }, [lastError]);

  const contextValue: ErrorHandlerContextType = {
    handleError,
    clearErrors,
    retryLastError,
    getErrorSuggestion,
  };

  return (
    <ErrorHandlerContext.Provider value={contextValue}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

// Convenience hooks for specific error types
export const useNetworkErrorHandler = () => {
  const { handleError } = useErrorHandler();
  
  return useCallback((error: Error | string, options?: Omit<ErrorHandlerOptions, 'category'>) => {
    handleError(error, { ...options, category: 'network' });
  }, [handleError]);
};

export const useValidationErrorHandler = () => {
  const { handleError } = useErrorHandler();
  
  return useCallback((error: Error | string, options?: Omit<ErrorHandlerOptions, 'category'>) => {
    handleError(error, { ...options, category: 'validation', showNotification: false, showInline: true });
  }, [handleError]);
};

export const useAuthErrorHandler = () => {
  const { handleError } = useErrorHandler();
  
  return useCallback((error: Error | string, options?: Omit<ErrorHandlerOptions, 'category'>) => {
    handleError(error, { 
      ...options, 
      category: 'authentication', 
      priority: 'high',
      persistent: true 
    });
  }, [handleError]);
};

// Global error handler for unhandled errors
export const setupGlobalErrorHandler = (errorHandler: ErrorHandlerContextType) => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handleError(event.reason, {
      category: 'unhandled',
      priority: 'high',
      notificationType: 'stacked',
    });
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorHandler.handleError(event.error || event.message, {
      category: 'javascript',
      priority: 'high',
      notificationType: 'stacked',
    });
  });
};

// Inline Error Component with Enhanced Error Handler Integration
export interface EnhancedInlineErrorProps {
  error?: Error | ErrorInfo | string | null;
  onRetry?: () => void | Promise<void>;
  onDismiss?: () => void;
  showSuggestion?: boolean;
  className?: string;
}

export const EnhancedInlineError: React.FC<EnhancedInlineErrorProps> = ({
  error,
  onRetry,
  onDismiss,
  showSuggestion = true,
  className,
}) => {
  const { getErrorSuggestion } = useErrorHandler();

  if (!error) return null;

  const parsedError = parseError(error);
  const suggestion = showSuggestion ? getErrorSuggestion(parsedError) : undefined;

  return (
    <InlineError
      message={parsedError.message}
      type="error"
      variant="default"
      action={parsedError.retryable && onRetry ? {
        label: 'Retry',
        onClick: onRetry,
        variant: 'primary',
      } : undefined}
      dismissible={!!onDismiss}
      onDismiss={onDismiss}
      className={className}
    >
      {suggestion && (
        <p className="text-xs mt-1 opacity-75">
          {suggestion}
        </p>
      )}
    </InlineError>
  );
};
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, X } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  variant?: 'inline' | 'toast' | 'modal';
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  className = '',
  variant = 'inline'
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const { isOnline } = useNetworkStatus();

  const getErrorType = (message: string) => {
    if (message.includes('timeout') || message.includes('timed out')) return 'timeout';
    if (message.includes('network') || message.includes('Network')) return 'network';
    if (message.includes('unauthorized') || message.includes('Unauthorized')) return 'auth';
    if (message.includes('forbidden') || message.includes('Forbidden')) return 'permission';
    if (message.includes('not found') || message.includes('Not Found')) return 'notfound';
    if (message.includes('server') || message.includes('500')) return 'server';
    return 'generic';
  };

  const errorType = getErrorType(errorMessage);

  const getErrorConfig = (type: string) => {
    switch (type) {
      case 'network':
        return {
          title: 'Connection Problem',
          message: isOnline 
            ? 'Unable to connect to our servers. Please check your internet connection and try again.'
            : 'You appear to be offline. Please check your internet connection.',
          icon: isOnline ? Wifi : WifiOff,
          color: 'red',
          showRetry: true,
        };
      case 'timeout':
        return {
          title: 'Request Timeout',
          message: 'The request took too long to complete. This might be due to a slow connection or server issues.',
          icon: AlertTriangle,
          color: 'yellow',
          showRetry: true,
        };
      case 'auth':
        return {
          title: 'Authentication Required',
          message: 'Your session has expired. Please sign in again to continue.',
          icon: AlertTriangle,
          color: 'red',
          showRetry: false,
        };
      case 'permission':
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          icon: AlertTriangle,
          color: 'red',
          showRetry: false,
        };
      case 'notfound':
        return {
          title: 'Not Found',
          message: 'The requested resource could not be found.',
          icon: AlertTriangle,
          color: 'yellow',
          showRetry: false,
        };
      case 'server':
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Our team has been notified and is working on a fix.',
          icon: AlertTriangle,
          color: 'red',
          showRetry: true,
        };
      default:
        return {
          title: 'Something went wrong',
          message: errorMessage,
          icon: AlertTriangle,
          color: 'red',
          showRetry: true,
        };
    }
  };

  const config = getErrorConfig(errorType);
  const Icon = config.icon;

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  if (variant === 'toast') {
    return (
      <div className={`fixed top-4 right-4 max-w-sm w-full ${colors.bg} ${colors.border} border rounded-lg shadow-lg p-4 z-50 ${className}`}>
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${colors.text}`}>{config.title}</h4>
            <p className={`text-sm ${colors.text} mt-1`}>{config.message}</p>
            {(config.showRetry && onRetry) && (
              <button
                onClick={onRetry}
                className={`mt-2 text-xs ${colors.button} text-white px-3 py-1 rounded transition-colors`}
              >
                Try Again
              </button>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`${colors.text} hover:opacity-75`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{config.message}</p>
          <div className="flex space-x-3">
            {config.showRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`flex-1 ${colors.button} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${colors.text}`}>{config.title}</h4>
          <p className={`text-sm ${colors.text} mt-1`}>{config.message}</p>
          {config.showRetry && onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 ${colors.button} text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${colors.text} hover:opacity-75`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Hook for managing error state
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | string | null>(null);

  const handleError = React.useCallback((error: Error | string) => {
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const retry = React.useCallback((fn: () => void | Promise<void>) => {
    clearError();
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.catch(handleError);
      }
    } catch (err) {
      handleError(err as Error);
    }
  }, [clearError, handleError]);

  return {
    error,
    handleError,
    clearError,
    retry,
  };
}
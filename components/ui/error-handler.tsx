'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, X } from '@/lib/icons';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();
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
          title: t('errorHandler.connectionProblem.title'),
          message: isOnline 
            ? t('errorHandler.connectionProblem.messageOnline')
            : t('errorHandler.connectionProblem.messageOffline'),
          icon: isOnline ? Wifi : WifiOff,
          color: 'red',
          showRetry: true,
        };
      case 'timeout':
        return {
          title: t('errorHandler.timeout.title'),
          message: t('errorHandler.timeout.message'),
          icon: AlertTriangle,
          color: 'yellow',
          showRetry: true,
        };
      case 'auth':
        return {
          title: t('errorHandler.auth.title'),
          message: t('errorHandler.auth.message'),
          icon: AlertTriangle,
          color: 'red',
          showRetry: false,
        };
      case 'permission':
        return {
          title: t('errorHandler.permission.title'),
          message: t('errorHandler.permission.message'),
          icon: AlertTriangle,
          color: 'red',
          showRetry: false,
        };
      case 'notfound':
        return {
          title: t('errorHandler.notFound.title'),
          message: t('errorHandler.notFound.message'),
          icon: AlertTriangle,
          color: 'yellow',
          showRetry: false,
        };
      case 'server':
        return {
          title: t('errorHandler.server.title'),
          message: t('errorHandler.server.message'),
          icon: AlertTriangle,
          color: 'red',
          showRetry: true,
        };
      default:
        return {
          title: t('errorHandler.generic.title'),
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
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      text: 'text-destructive',
      icon: 'text-destructive',
      button: 'bg-destructive hover:bg-destructive/90',
    },
    yellow: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      text: 'text-warning',
      icon: 'text-warning',
      button: 'bg-warning hover:bg-warning/90',
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
                {t('errorHandler.tryAgain')}
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
        <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
          </div>
          <p className="text-muted-foreground mb-6">{config.message}</p>
          <div className="flex space-x-3">
            {config.showRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`flex-1 ${colors.button} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('errorHandler.tryAgain')}</span>
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                {t('errorHandler.close')}
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
              <span>{t('errorHandler.tryAgain')}</span>
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

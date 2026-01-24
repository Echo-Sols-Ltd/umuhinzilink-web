'use client';

import { Toaster as HotToaster, ToastBar, toast as hotToast, ToastOptions } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import React, { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

// Re-export the toast function from react-hot-toast
export const toast = hotToast;

// Enhanced Toast Components
export const Toast = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn(
    "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 animate-slide-right",
    className
  )}>
    {children}
  </div>
);

export const ToastTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("text-sm font-medium text-gray-900 dark:text-gray-100", className)}>{children}</p>
);

export const ToastDescription = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("mt-1 text-sm text-gray-500 dark:text-gray-400", className)}>{children}</p>
);

const ToastClose = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  ({ className, ...props }, ref) => (
    <button 
      ref={ref} 
      className={cn(
        "inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors",
        className
      )} 
      {...props}
    >
      <span className="sr-only">Close</span>
      <X className="h-5 w-5" />
    </button>
  )
);
ToastClose.displayName = 'ToastClose';

export { ToastClose };

export const ToastViewport = () => (
  <div className="fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-sm" />
);

// Enhanced Toast Action Element
const ToastActionElement = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    altText: string;
  }
>(({ className, altText, ...props }, ref) => (
  <Button 
    ref={ref} 
    className={cn("h-8 px-3 text-xs", className)} 
    variant="outline" 
    size="sm" 
    {...props}
  >
    {altText}
  </Button>
));

ToastActionElement.displayName = 'ToastActionElement';

export { ToastActionElement };

// Enhanced Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';

export interface EnhancedToastOptions extends ToastOptions {
  type?: ToastType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

// Enhanced Toast Functions
export const showToast = {
  success: (message: string, options?: EnhancedToastOptions) => {
    return toast.success(message, {
      duration: options?.persistent ? Infinity : 4000,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      style: {
        background: 'var(--bg-success)',
        color: 'var(--success-dark)',
        border: '1px solid var(--success)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  error: (message: string, options?: EnhancedToastOptions) => {
    return toast.error(message, {
      duration: options?.persistent ? Infinity : 6000,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      style: {
        background: 'var(--bg-error)',
        color: 'var(--error-dark)',
        border: '1px solid var(--error)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  warning: (message: string, options?: EnhancedToastOptions) => {
    return toast(message, {
      duration: options?.persistent ? Infinity : 5000,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      style: {
        background: 'var(--bg-warning)',
        color: 'var(--warning-dark)',
        border: '1px solid var(--warning)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  info: (message: string, options?: EnhancedToastOptions) => {
    return toast(message, {
      duration: options?.persistent ? Infinity : 4000,
      icon: <Info className="h-5 w-5 text-blue-500" />,
      style: {
        background: 'var(--bg-info)',
        color: 'var(--info-dark)',
        border: '1px solid var(--info)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  loading: (message: string, options?: EnhancedToastOptions) => {
    return toast.loading(message, {
      icon: (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      ),
      style: {
        background: 'var(--bg-info)',
        color: 'var(--info-dark)',
        border: '1px solid var(--info)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
      },
      ...options,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
      ...options
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    } & EnhancedToastOptions
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }, {
      success: {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        style: {
          background: 'var(--bg-success)',
          color: 'var(--success-dark)',
          border: '1px solid var(--success)',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
        },
      },
      error: {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: 'var(--bg-error)',
          color: 'var(--error-dark)',
          border: '1px solid var(--error)',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
        },
      },
      loading: {
        icon: (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        ),
        style: {
          background: 'var(--bg-info)',
          color: 'var(--info-dark)',
          border: '1px solid var(--info)',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        },
      },
      ...options,
    });
  },
};

// Enhanced Toaster Component
export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      containerClassName="!top-4 !right-4"
      toastOptions={{
        duration: 4000,
        style: {
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'var(--font-primary)',
        },
        success: {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            background: 'var(--bg-success)',
            color: 'var(--success-dark)',
            border: '1px solid var(--success)',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
          },
        },
        error: {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            background: 'var(--bg-error)',
            color: 'var(--error-dark)',
            border: '1px solid var(--error)',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
          },
        },
        loading: {
          icon: (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          ),
          style: {
            background: 'var(--bg-info)',
            color: 'var(--info-dark)',
            border: '1px solid var(--info)',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
          },
        },
      }}
    >
      {t => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-start w-full">
              <div className="shrink-0 pt-0.5">{icon}</div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {typeof message === 'string' ? message : message}
                </div>
              </div>
              <div className="ml-4 flex shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  onClick={() => {
                    hotToast.dismiss(t.id);
                  }}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
};

// For backward compatibility
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | 'success';
};

// Export useToast hook for backward compatibility and enhanced functionality
export const useToast = () => {
  return {
    toast: showToast,
    dismiss: toast.dismiss,
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    info: showToast.info,
    loading: showToast.loading,
    promise: showToast.promise,
  };
};

// Re-export toast as default for backward compatibility
export default toast;

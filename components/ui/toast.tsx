"use client";

import { Toaster as HotToaster, ToastBar, toast as hotToast, ToastOptions } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import React, { ReactNode } from 'react';
import { Button } from './button';

// Re-export the toast function from react-hot-toast
export const toast = hotToast;

// Toast Components
export const Toast = ({ children }: { children: ReactNode }) => (
  <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
    {children}
  </div>
);

export const ToastTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-medium text-gray-900">{children}</p>
);

export const ToastDescription = ({ children }: { children: ReactNode }) => (
  <p className="mt-1 text-sm text-gray-500">{children}</p>
);

const ToastClose = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={className}
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

// For backward compatibility
const ToastActionElement = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    altText: string;
  }
>(({ className, altText, ...props }, ref) => (
  <Button
    ref={ref}
    className={className}
    variant="outline"
    size="sm"
    {...props}
  >
    {altText}
  </Button>
));

ToastActionElement.displayName = 'ToastActionElement';

export { ToastActionElement };

// For backward compatibility
export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive' | 'success';
};

// Create a custom toast component that wraps react-hot-toast
export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        success: {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        error: {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        loading: {
          icon: <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />,
          style: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        custom: {
          icon: <Info className="h-5 w-5 text-blue-500" />,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">{icon}</div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {typeof message === 'string' ? message : null}
                </div>
              </div>
              <div className="ml-4 flex shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    hotToast.dismiss(t.id);
                  }}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
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
  React.useEffect(() => {
    console.warn('ToastProvider is deprecated. Use the `toast` function directly from `components/ui/toast`.');
  }, []);

  return <>{children}</>;
};

// For backward compatibility
type ToastType = 'success' | 'error' | 'loading' | 'default';

type ToastOptionsType = ToastOptions & {
  type?: ToastType;
};

// Export useToast hook for backward compatibility
export const useToast = () => {
  return {
    toast: (message: string, options: ToastOptionsType = {}) => {
      const { type = 'default', ...rest } = options;
      switch (type) {
        case 'success':
          return toast.success(message, rest);
        case 'error':
          return toast.error(message, rest);
        case 'loading':
          return toast.loading(message, rest);
        default:
          return toast(message, { ...rest, icon: <Info className="h-5 w-5 text-blue-500" /> });
      }
    },
    dismiss: toast.dismiss,
  };
};

// Re-export toast as default for backward compatibility
export default toast;

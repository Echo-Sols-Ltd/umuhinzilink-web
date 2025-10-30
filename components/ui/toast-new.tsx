"use client";

import { Toaster as HotToaster, ToastBar, toast as hotToast, ToastOptions } from 'react-hot-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import React from 'react';

// Re-export the toast function from react-hot-toast
export const toast = hotToast;

// Create a custom toast component that wraps react-hot-toast
export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        success: {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        },
        error: {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        },
        loading: {
          icon: <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />,
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
              <div className="flex-shrink-0 pt-0.5">{icon}</div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {typeof message === 'string' ? message : null}
                </div>
              </div>
              <div className="ml-4 flex flex-shrink-0">
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
  };
};

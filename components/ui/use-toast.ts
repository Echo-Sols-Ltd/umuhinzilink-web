"use client";

import { toast as hotToast, ToastOptions as HotToastOptions } from 'react-hot-toast';

// Extended options to support title and variant
interface ToastOptions extends HotToastOptions {
  title?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  description?: string;
}

type ToastFunction = (message: string | ToastOptions, options?: ToastOptions) => string;

interface ToastWithMethods extends ToastFunction {
  success: ToastFunction;
  error: ToastFunction;
  loading: ToastFunction;
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
  promise: typeof hotToast.promise;
}

const createToastOptions = (options: ToastOptions = {}): ToastOptions => ({
  duration: 4000,
  position: 'top-right',
  ...options,
});

const toast = ((message: string | ToastOptions, options: ToastOptions = {}) => {
  if (typeof message === 'object') {
    options = message;
    message = options.description || '';
  }
  
  const toastOptions = createToastOptions(options);
  
  if (options.variant === 'success') {
    return hotToast.success(message, toastOptions);
  } else if (options.variant === 'error') {
    return hotToast.error(message, toastOptions);
  } else if (options.variant === 'warning') {
    return hotToast(message, { ...toastOptions, icon: '⚠️' });
  } else {
    return hotToast(message, toastOptions);
  }
}) as ToastWithMethods;

toast.success = (message: string | ToastOptions, options: ToastOptions = {}) => {
  if (typeof message === 'object') {
    options = { ...message, variant: 'success' };
    message = options.description || '';
  }
  return hotToast.success(message, createToastOptions({ ...options, variant: 'success' }));
};

toast.error = (message: string | ToastOptions, options: ToastOptions = {}) => {
  if (typeof message === 'object') {
    options = { ...message, variant: 'error' };
    message = options.description || '';
  }
  return hotToast.error(message, createToastOptions({ ...options, variant: 'error' }));
};

toast.loading = (message: string | ToastOptions, options: ToastOptions = {}) => {
  if (typeof message === 'object') {
    options = message;
    message = options.description || '';
  }
  return hotToast.loading(message, createToastOptions(options));
};

toast.dismiss = hotToast.dismiss;
toast.remove = hotToast.remove;
toast.promise = hotToast.promise;

// For backward compatibility
export const useToast = () => ({
  toast: (message: string | ToastOptions, options: ToastOptions = {}) => {
    if (typeof message === 'object') {
      options = message;
      message = options.description || '';
    }
    
    const { type = 'default', ...rest } = options as { type?: 'default' | 'success' | 'error' | 'loading' } & Omit<ToastOptions, 'type'>;
    
    switch (type) {
      case 'success':
        return toast.success(message, { ...rest, variant: 'success' });
      case 'error':
        return toast.error(message, { ...rest, variant: 'error' });
      case 'loading':
        return toast.loading(message, rest);
      default:
        return toast(message, rest);
    }
  },
  dismiss: toast.dismiss,
});

export { toast };

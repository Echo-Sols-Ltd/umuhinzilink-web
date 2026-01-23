'use client';

import React from 'react';
import { useModalToastActions } from './modal-toast';
import { toast as hotToast } from 'react-hot-toast';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'loading';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  // New option to choose between modal and traditional toast
  style?: 'modal' | 'toast';
}

// Enhanced toast function that supports both modal and traditional styles
export const toast = (message: string, options: ToastOptions = {}) => {
  const {
    title,
    description = message,
    variant = 'default',
    duration = 5000,
    action,
    onClose,
    style = 'modal', // Default to modal style
    ...rest
  } = options;

  if (style === 'modal') {
    // Use modal-style toast (requires provider)
    try {
      const modalToast = useModalToastActions();
      switch (variant) {
        case 'success':
          return modalToast.success(description, { title, duration, action, onClose });
        case 'error':
          return modalToast.error(description, { title, duration, action, onClose });
        case 'warning':
          return modalToast.warning(description, { title, duration, action, onClose });
        case 'loading':
          return modalToast.loading(description, { title, action, onClose });
        default:
          return modalToast.info(description, { title, duration, action, onClose });
      }
    } catch (error) {
      // Fallback to traditional toast if modal provider is not available
      console.warn('Modal toast provider not found, falling back to traditional toast');
      return fallbackToast(message, options);
    }
  } else {
    // Use traditional toast
    return fallbackToast(message, options);
  }
};

// Fallback to traditional toast
const fallbackToast = (message: string, options: ToastOptions = {}) => {
  const { variant = 'default', duration = 5000 } = options;
  
  switch (variant) {
    case 'success':
      return hotToast.success(message, { duration });
    case 'error':
      return hotToast.error(message, { duration });
    case 'loading':
      return hotToast.loading(message);
    default:
      return hotToast(message, { duration });
  }
};

// Convenience methods
toast.success = (message: string, options: Omit<ToastOptions, 'variant'> = {}) =>
  toast(message, { ...options, variant: 'success' });

toast.error = (message: string, options: Omit<ToastOptions, 'variant'> = {}) =>
  toast(message, { ...options, variant: 'error' });

toast.warning = (message: string, options: Omit<ToastOptions, 'variant'> = {}) =>
  toast(message, { ...options, variant: 'warning' });

toast.info = (message: string, options: Omit<ToastOptions, 'variant'> = {}) =>
  toast(message, { ...options, variant: 'default' });

toast.loading = (message: string, options: Omit<ToastOptions, 'variant'> = {}) =>
  toast(message, { ...options, variant: 'loading' });

// Hook for using toast in components
export const useToast = () => {
  return {
    toast,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    loading: toast.loading,
  };
};

// Component for creating toasts with modal style
export const ModalToastTrigger: React.FC<{
  children: React.ReactNode;
  message: string;
  options?: ToastOptions;
}> = ({ children, message, options = {} }) => {
  const handleClick = () => {
    toast(message, { ...options, style: 'modal' });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default toast;
'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalToastData {
  id: string;
  title?: string;
  description: string;
  variant: 'default' | 'success' | 'error' | 'warning' | 'loading';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ModalToastContextType {
  toasts: ModalToastData[];
  addToast: (toast: Omit<ModalToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ModalToastContext = createContext<ModalToastContextType | undefined>(undefined);

export const useModalToast = () => {
  const context = useContext(ModalToastContext);
  if (!context) {
    throw new Error('useModalToast must be used within a ModalToastProvider');
  }
  return context;
};

const getVariantStyles = (variant: ModalToastData['variant']) => {
  switch (variant) {
    case 'success':
      return {
        container: 'border-green-200 bg-green-50',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        title: 'text-green-800',
        description: 'text-green-700',
        button: 'text-green-600 hover:text-green-800',
      };
    case 'error':
      return {
        container: 'border-red-200 bg-red-50',
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        title: 'text-red-800',
        description: 'text-red-700',
        button: 'text-red-600 hover:text-red-800',
      };
    case 'warning':
      return {
        container: 'border-yellow-200 bg-yellow-50',
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        title: 'text-yellow-800',
        description: 'text-yellow-700',
        button: 'text-yellow-600 hover:text-yellow-800',
      };
    case 'loading':
      return {
        container: 'border-blue-200 bg-blue-50',
        icon: <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />,
        title: 'text-blue-800',
        description: 'text-blue-700',
        button: 'text-blue-600 hover:text-blue-800',
      };
    default:
      return {
        container: 'border-gray-200 bg-white',
        icon: <Info className="w-6 h-6 text-blue-600" />,
        title: 'text-gray-800',
        description: 'text-gray-700',
        button: 'text-gray-600 hover:text-gray-800',
      };
  }
};

interface ModalToastItemProps {
  toast: ModalToastData;
  onRemove: (id: string) => void;
}

const ModalToastItem: React.FC<ModalToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const styles = getVariantStyles(toast.variant);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && toast.variant !== 'loading') {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.variant]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
      toast.onClose?.();
    }, 200);
  }, [toast.id, toast.onClose, onRemove]);

  const handleAction = useCallback(() => {
    toast.action?.onClick();
    handleClose();
  }, [toast.action, handleClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200',
        isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
      )}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className={cn(
          'relative w-full max-w-md transform rounded-lg border p-6 shadow-xl transition-all duration-200',
          styles.container,
          isVisible && !isExiting
            ? 'scale-100 translate-y-0'
            : 'scale-95 translate-y-4'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'absolute right-4 top-4 rounded-full p-1 transition-colors',
            styles.button
          )}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="flex items-start space-x-4 pr-8">
          {/* Icon */}
          <div className="flex-shrink-0">
            {styles.icon}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h3 className={cn('text-lg font-semibold mb-2', styles.title)}>
                {toast.title}
              </h3>
            )}
            <p className={cn('text-sm leading-relaxed', styles.description)}>
              {toast.description}
            </p>

            {/* Action button */}
            {toast.action && (
              <div className="mt-4">
                <button
                  onClick={handleAction}
                  className={cn(
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-transparent transition-colors',
                    'bg-white shadow-sm hover:bg-gray-50',
                    styles.button
                  )}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModalToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ModalToastData[]>([]);

  const addToast = useCallback((toastData: Omit<ModalToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ModalToastData = {
      id,
      duration: 5000, // Default 5 seconds
      ...toastData,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ModalToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return (
    <ModalToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="modal-toast-container">
            {toasts.map(toast => (
              <ModalToastItem
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
              />
            ))}
          </div>,
          document.body
        )}
    </ModalToastContext.Provider>
  );
};

// Convenience hook for creating toasts
export const useModalToastActions = () => {
  const { addToast, removeToast, clearAll } = useModalToast();

  return {
    success: (description: string, options?: Partial<Omit<ModalToastData, 'id' | 'variant' | 'description'>>) =>
      addToast({ ...options, description, variant: 'success' }),
    
    error: (description: string, options?: Partial<Omit<ModalToastData, 'id' | 'variant' | 'description'>>) =>
      addToast({ ...options, description, variant: 'error' }),
    
    warning: (description: string, options?: Partial<Omit<ModalToastData, 'id' | 'variant' | 'description'>>) =>
      addToast({ ...options, description, variant: 'warning' }),
    
    info: (description: string, options?: Partial<Omit<ModalToastData, 'id' | 'variant' | 'description'>>) =>
      addToast({ ...options, description, variant: 'default' }),
    
    loading: (description: string, options?: Partial<Omit<ModalToastData, 'id' | 'variant' | 'description'>>) =>
      addToast({ ...options, description, variant: 'loading', duration: 0 }),
    
    custom: (data: Omit<ModalToastData, 'id'>) => addToast(data),
    
    dismiss: removeToast,
    dismissAll: clearAll,
  };
};
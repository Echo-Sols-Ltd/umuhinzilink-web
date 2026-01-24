'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast, ToastData } from './use-toast-new';

const getVariantStyles = (variant: ToastData['variant']) => {
  switch (variant) {
    case 'success':
      return {
        container: 'border-green-200 bg-green-50',
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        title: 'text-green-800',
        description: 'text-green-700',
        button: 'text-green-600 hover:text-green-800 border-green-200 hover:bg-green-100',
        closeButton: 'text-green-400 hover:text-green-600',
      };
    case 'error':
      return {
        container: 'border-red-200 bg-red-50',
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        title: 'text-red-800',
        description: 'text-red-700',
        button: 'text-red-600 hover:text-red-800 border-red-200 hover:bg-red-100',
        closeButton: 'text-red-400 hover:text-red-600',
      };
    case 'warning':
      return {
        container: 'border-yellow-200 bg-yellow-50',
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        title: 'text-yellow-800',
        description: 'text-yellow-700',
        button: 'text-yellow-600 hover:text-yellow-800 border-yellow-200 hover:bg-yellow-100',
        closeButton: 'text-yellow-400 hover:text-yellow-600',
      };
    case 'loading':
      return {
        container: 'border-blue-200 bg-blue-50',
        icon: <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />,
        title: 'text-blue-800',
        description: 'text-blue-700',
        button: 'text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-100',
        closeButton: 'text-blue-400 hover:text-blue-600',
      };
    default:
      return {
        container: 'border-gray-200 bg-white shadow-lg',
        icon: <Info className="w-6 h-6 text-blue-600" />,
        title: 'text-gray-800',
        description: 'text-gray-700',
        button: 'text-gray-600 hover:text-gray-800 border-gray-200 hover:bg-gray-100',
        closeButton: 'text-gray-400 hover:text-gray-600',
      };
  }
};

interface ModalToastItemProps {
  toast: ToastData;
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

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out',
        isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
      )}
      style={{ 
        backgroundColor: isVisible && !isExiting ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isVisible && !isExiting ? 'blur(4px)' : 'blur(0px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'relative w-full max-w-md transform rounded-xl border p-6 transition-all duration-300 ease-out',
          styles.container,
          isVisible && !isExiting
            ? 'scale-100 translate-y-0'
            : 'scale-95 translate-y-8'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'absolute right-4 top-4 rounded-full p-1.5 transition-colors duration-200',
            styles.closeButton
          )}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="flex items-start space-x-4 pr-10">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {styles.icon}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h3 className={cn('text-lg font-semibold mb-2 leading-tight', styles.title)}>
                {toast.title}
              </h3>
            )}
            <p className={cn('text-sm leading-relaxed', styles.description)}>
              {toast.description}
            </p>

            {/* Action button */}
            {toast.action && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAction}
                  className={cn(
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200',
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

export const ModalToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="modal-toast-container">
      {toasts.map(toast => (
        <ModalToastItem
          key={toast.id}
          toast={toast}
          onRemove={dismiss}
        />
      ))}
    </div>,
    document.body
  );
};

export default ModalToastContainer;
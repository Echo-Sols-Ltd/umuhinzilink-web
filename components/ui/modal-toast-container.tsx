'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast, ToastData } from './use-toast';

const getVariantStyles = (variant: ToastData['variant']) => {
  switch (variant) {
    case 'success':
      return {
        container: 'bg-white rounded-2xl shadow-2xl border border-green-200',
        icon: <div className="bg-linear-to-br from-green-400 to-green-600 p-2 rounded-xl shadow-md"><CheckCircle className="w-5 h-5 text-white" /></div>,
        title: 'text-gray-900 font-semibold',
        description: 'text-gray-600',
        button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md',
        closeButton: 'text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl',
      };
    case 'error':
      return {
        container: 'bg-white rounded-2xl shadow-2xl border border-red-200',
        icon: <div className="bg-linear-to-br from-red-400 to-red-600 p-2 rounded-xl shadow-md"><AlertCircle className="w-5 h-5 text-white" /></div>,
        title: 'text-gray-900 font-semibold',
        description: 'text-gray-600',
        button: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md',
        closeButton: 'text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl',
      };
    case 'warning':
      return {
        container: 'bg-white rounded-2xl shadow-2xl border border-yellow-200',
        icon: <div className="bg-linear-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-md"><AlertTriangle className="w-5 h-5 text-white" /></div>,
        title: 'text-gray-900 font-semibold',
        description: 'text-gray-600',
        button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md',
        closeButton: 'text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl',
      };
    case 'loading':
      return {
        container: 'bg-white rounded-2xl shadow-2xl border border-blue-200',
        icon: <div className="bg-linear-to-br from-blue-400 to-blue-600 p-2 rounded-xl shadow-md"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>,
        title: 'text-gray-900 font-semibold',
        description: 'text-gray-600',
        button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md',
        closeButton: 'text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl',
      };
    default:
      return {
        container: 'bg-white rounded-2xl shadow-2xl border border-gray-200',
        icon: <div className="bg-linear-to-br from-gray-400 to-gray-600 p-2 rounded-xl shadow-md"><Info className="w-5 h-5 text-white" /></div>,
        title: 'text-gray-900 font-semibold',
        description: 'text-gray-600',
        button: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-md',
        closeButton: 'text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl',
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

  return (
    <div
      className={cn(
        'transform transition-all duration-300 ease-out',
        isVisible && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      <div
        className={cn(
          'relative w-80 transform p-4 transition-all duration-300 ease-out',
          styles.container,
          isVisible && !isExiting
            ? 'scale-100 translate-y-0'
            : 'scale-95 translate-y-2'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'absolute right-2 top-2 rounded-full transition-colors duration-200',
            styles.closeButton
          )}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="flex items-start space-x-3 pr-8">
          {/* Icon */}
          <div className="shrink-0">
            {styles.icon}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h3 className={cn('text-base font-bold mb-1 leading-tight', styles.title)}>
                {toast.title}
              </h3>
            )}
            <p className={cn('text-xs leading-relaxed', styles.description)}>
              {toast.description}
            </p>

            {/* Action button */}
            {toast.action && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleAction}
                  className={cn(
                    'inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200',
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

const ModalToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ModalToastItem
            toast={toast}
            onRemove={dismiss}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ModalToastContainer;
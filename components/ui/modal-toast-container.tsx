'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useToast, ToastData } from './use-toast';

const getVariantStyles = (variant: ToastData['variant']) => {
  switch (variant) {
    case 'success':
      return {
        container: 'bg-card rounded-2xl shadow-2xl border border-success/20',
        icon: <div className="bg-gradient-to-br from-success to-success/80 p-2 rounded-xl shadow-md"><CheckCircle className="w-5 h-5 text-success-foreground" /></div>,
        title: 'text-foreground font-semibold',
        description: 'text-muted-foreground',
        button: 'bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success text-success-foreground shadow-md',
        closeButton: 'text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-xl',
      };
    case 'error':
      return {
        container: 'bg-card rounded-2xl shadow-2xl border border-destructive/20',
        icon: <div className="bg-gradient-to-br from-destructive to-destructive/80 p-2 rounded-xl shadow-md"><AlertCircle className="w-5 h-5 text-destructive-foreground" /></div>,
        title: 'text-foreground font-semibold',
        description: 'text-muted-foreground',
        button: 'bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive text-destructive-foreground shadow-md',
        closeButton: 'text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-xl',
      };
    case 'warning':
      return {
        container: 'bg-card rounded-2xl shadow-2xl border border-warning/20',
        icon: <div className="bg-gradient-to-br from-warning to-warning/80 p-2 rounded-xl shadow-md"><AlertTriangle className="w-5 h-5 text-warning-foreground" /></div>,
        title: 'text-foreground font-semibold',
        description: 'text-muted-foreground',
        button: 'bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning text-warning-foreground shadow-md',
        closeButton: 'text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-xl',
      };
    case 'loading':
      return {
        container: 'bg-card rounded-2xl shadow-2xl border border-info/20',
        icon: <div className="bg-gradient-to-br from-info to-info/80 p-2 rounded-xl shadow-md"><Loader2 className="w-5 h-5 text-info-foreground animate-spin" /></div>,
        title: 'text-foreground font-semibold',
        description: 'text-muted-foreground',
        button: 'bg-gradient-to-r from-info to-info/80 hover:from-info/90 hover:to-info text-info-foreground shadow-md',
        closeButton: 'text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-xl',
      };
    default:
      return {
        container: 'bg-card rounded-2xl shadow-2xl border border-border',
        icon: <div className="bg-gradient-to-br from-muted to-muted/80 p-2 rounded-xl shadow-md"><Info className="w-5 h-5 text-muted-foreground" /></div>,
        title: 'text-foreground font-semibold',
        description: 'text-muted-foreground',
        button: 'bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary text-secondary-foreground shadow-md',
        closeButton: 'text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-xl',
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
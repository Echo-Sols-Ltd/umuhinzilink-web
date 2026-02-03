'use client';

import React, { useState, useCallback } from 'react';

export interface ToastData {
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

// Global toast state
let globalToasts: ToastData[] = [];
let globalListeners: Array<(toasts: ToastData[]) => void> = [];

const notifyListeners = () => {
  globalListeners.forEach(listener => listener([...globalToasts]));
};

const addGlobalToast = (toastData: Omit<ToastData, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: ToastData = {
    id,
    duration: 5000,
    ...toastData,
  };

  globalToasts = [...globalToasts, newToast];
  notifyListeners();

  // Auto-remove toast after duration (except loading toasts)
  if (newToast.duration && newToast.duration > 0 && newToast.variant !== 'loading') {
    setTimeout(() => {
      removeGlobalToast(id);
    }, newToast.duration);
  }

  return id;
};

const removeGlobalToast = (id: string) => {
  globalToasts = globalToasts.filter(toast => toast.id !== id);
  notifyListeners();
};

const clearAllGlobalToasts = () => {
  globalToasts = [];
  notifyListeners();
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>(globalToasts);

  // Subscribe to global toast changes
  const subscribe = useCallback((listener: (toasts: ToastData[]) => void) => {
    globalListeners.push(listener);
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);

  // Subscribe to changes when component mounts
  React.useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, [subscribe]);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    return addGlobalToast(data);
  }, []);

  const dismiss = useCallback((id: string) => {
    removeGlobalToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    clearAllGlobalToasts();
  }, []);

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
    // Convenience methods
    success: useCallback((description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) => 
      toast({ ...options, description, variant: 'success' }), [toast]),
    
    error: useCallback((description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) => 
      toast({ ...options, description, variant: 'error' }), [toast]),
    
    warning: useCallback((description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) => 
      toast({ ...options, description, variant: 'warning' }), [toast]),
    
    info: useCallback((description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) => 
      toast({ ...options, description, variant: 'default' }), [toast]),
    
    loading: useCallback((description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) => 
      toast({ ...options, description, variant: 'loading', duration: 0 }), [toast]),
  };
};

// Standalone toast functions that can be used without hooks
export const toast = {
  success: (description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) =>
    addGlobalToast({ ...options, description, variant: 'success' }),
  
  error: (description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) =>
    addGlobalToast({ ...options, description, variant: 'error' }),
  
  warning: (description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) =>
    addGlobalToast({ ...options, description, variant: 'warning' }),
  
  info: (description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) =>
    addGlobalToast({ ...options, description, variant: 'default' }),
  
  loading: (description: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'description'>>) =>
    addGlobalToast({ ...options, description, variant: 'loading', duration: 0 }),
  
  custom: (data: Omit<ToastData, 'id'>) => addGlobalToast(data),
  
  dismiss: removeGlobalToast,
  dismissAll: clearAllGlobalToasts,
};
'use client';

import React from 'react';
import { Loader2, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, message = 'Loading...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" className="text-green-600" />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${className} ${
            index > 0 ? 'mt-2' : ''
          }`}
          style={{ height: '1rem' }}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  showImage?: boolean;
  lines?: number;
}

export function CardSkeleton({ showImage = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      )}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        {Array.from({ length: lines - 1 }).map((_, index) => (
          <div key={index} className="h-3 bg-gray-200 rounded w-full" />
        ))}
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, className = '', showPercentage = true }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Progress</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{Math.round(clampedProgress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  isSlowConnection?: boolean;
  className?: string;
}

export function NetworkStatusIndicator({ 
  isOnline, 
  isSlowConnection = false, 
  className = '' 
}: NetworkStatusIndicatorProps) {
  if (isOnline && !isSlowConnection) {
    return null; // Don't show anything when connection is good
  }

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg ${
      !isOnline 
        ? 'bg-red-100 text-red-800' 
        : 'bg-yellow-100 text-yellow-800'
    } ${className}`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">No internet connection</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Slow connection detected</span>
        </>
      )}
    </div>
  );
}

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function StatusMessage({ type, message, className = '' }: StatusMessageProps) {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${styles[type]} ${className}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
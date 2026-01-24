'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Archive,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';

// ===== SHIMMER EFFECTS =====

interface ShimmerLoadingImageProps {
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function ShimmerLoadingImage({ 
  aspectRatio = '16:9', 
  className,
  rounded = 'lg'
}: ShimmerLoadingImageProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%] animate-shimmer',
        'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        roundedClasses[rounded],
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}

// ===== PROGRESS BARS =====

interface BeautifulProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

function BeautifulProgressBar({
  progress,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = true,
  className
}: BeautifulProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const backgroundClasses = {
    default: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
    info: 'bg-info/10'
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className="text-muted-foreground font-mono">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress bar */}
      <div className={cn(
        'w-full rounded-full overflow-hidden',
        backgroundClasses[variant],
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

// ===== FILE UPLOAD PROGRESS =====

interface FileUploadProgressProps {
  files: Array<{
    id: string;
    name: string;
    size: number;
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'paused';
    type?: string;
  }>;
  onCancel?: (fileId: string) => void;
  onRetry?: (fileId: string) => void;
  className?: string;
}

function FileUploadProgress({
  files,
  onCancel,
  onRetry,
  className
}: FileUploadProgressProps) {
  const getFileIcon = (fileName: string, type?: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeType = type?.toLowerCase();
    
    if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    if (mimeType?.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
      return <Video className="w-5 h-5" />;
    }
    if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) {
      return <Music className="w-5 h-5" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'error': return 'text-error';
      case 'paused': return 'text-warning';
      default: return 'text-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-error" />;
      case 'paused': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {files.map((file) => (
        <div key={file.id} className="border rounded-lg p-4 bg-card">
          <div className="flex items-start space-x-3">
            {/* File icon */}
            <div className={cn('flex-shrink-0 p-2 rounded-md', getStatusColor(file.status))}>
              {getFileIcon(file.name, file.type)}
            </div>
            
            {/* File info and progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(file.status)}
                  {onCancel && file.status === 'uploading' && (
                    <button
                      onClick={() => onCancel(file.id)}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {onRetry && file.status === 'error' && (
                    <button
                      onClick={() => onRetry(file.id)}
                      className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              {file.status !== 'completed' && (
                <BeautifulProgressBar
                  progress={file.progress}
                  variant={file.status === 'error' ? 'error' : 'default'}
                  size="sm"
                  showPercentage={false}
                  animated={file.status === 'uploading'}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== ANIMATED PLACEHOLDER CARDS =====

interface AnimatedPlaceholderCardProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
  showActions?: boolean;
  variant?: 'metric' | 'chart' | 'list' | 'content';
  className?: string;
}

function AnimatedPlaceholderCard({
  title,
  description,
  showIcon = true,
  showActions = false,
  variant = 'content',
  className
}: AnimatedPlaceholderCardProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const renderMetricCard = () => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className={cn(
            'h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
            'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
            'bg-[length:200px_100%] animate-shimmer',
            animationPhase === 0 ? 'w-20' : animationPhase === 1 ? 'w-24' : 'w-16'
          )} />
          <div className={cn(
            'h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
            'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
            'bg-[length:200px_100%] animate-shimmer',
            animationPhase === 0 ? 'w-16' : animationPhase === 1 ? 'w-20' : 'w-12'
          )} />
        </div>
        {showIcon && (
          <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
        )}
      </div>
      <div className={cn(
        'h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
        'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        'bg-[length:200px_100%] animate-shimmer',
        animationPhase === 0 ? 'w-24' : animationPhase === 1 ? 'w-20' : 'w-28'
      )} />
    </div>
  );

  const renderChartCard = () => (
    <div className="p-6 space-y-4">
      <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      <div className="flex justify-center space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
            <div className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderListCard = () => (
    <div className="p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
          <div className="flex-1 space-y-2">
            <div className={cn(
              'h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
              'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
              'bg-[length:200px_100%] animate-shimmer',
              i % 2 === 0 ? 'w-3/4' : 'w-2/3'
            )} />
            <div className={cn(
              'h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
              'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
              'bg-[length:200px_100%] animate-shimmer',
              i % 2 === 0 ? 'w-1/2' : 'w-2/5'
            )} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderContentCard = () => (
    <div className="p-6 space-y-4">
      <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded',
              'dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
              'bg-[length:200px_100%] animate-shimmer',
              i === 2 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <div className="h-9 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
          <div className="h-9 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md bg-[length:200px_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
        </div>
      )}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'metric': return renderMetricCard();
      case 'chart': return renderChartCard();
      case 'list': return renderListCard();
      default: return renderContentCard();
    }
  };

  return (
    <div className={cn(
      'border rounded-lg bg-card shadow-sm',
      'animate-fade-in',
      className
    )}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      {renderVariant()}
    </div>
  );
}

// ===== NETWORK STATUS INDICATOR =====

interface NetworkStatusProps {
  isOnline: boolean;
  isSlowConnection?: boolean;
  className?: string;
}

function NetworkStatus({ 
  isOnline, 
  isSlowConnection = false, 
  className 
}: NetworkStatusProps) {
  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
      !isOnline 
        ? 'bg-error/10 text-error border border-error/20' 
        : 'bg-warning/10 text-warning border border-warning/20',
      className
    )}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>No internet connection</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span>Slow connection detected</span>
        </>
      )}
    </div>
  );
}

// ===== SMOOTH PAGE TRANSITION =====

interface PageTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

function PageTransition({ 
  isLoading, 
  children, 
  className 
}: PageTransitionProps) {
  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100'
      )}>
        {children}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export {
  ShimmerLoadingImage,
  BeautifulProgressBar,
  FileUploadProgress,
  AnimatedPlaceholderCard,
  NetworkStatus,
  PageTransition
};
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { 
  Heart, 
  Share, 
  Bookmark, 
  MoreVertical,
  Trash2,
  Edit,
  Archive,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Swipeable Card with actions
interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  onAction: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  threshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight,
  className,
  threshold = 100
}) => {
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const leftActionWidth = leftActions.length * 80;
  const rightActionWidth = rightActions.length * 80;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && leftActions.length > 0) {
        // Swipe right - reveal left actions
        setIsRevealed('left');
        x.set(leftActionWidth);
      } else if (offset.x < 0 && rightActions.length > 0) {
        // Swipe left - reveal right actions
        setIsRevealed('right');
        x.set(-rightActionWidth);
      } else {
        // Complete swipe
        if (offset.x > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (offset.x < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
        setIsRevealed(null);
        x.set(0);
      }
    } else {
      // Snap back
      setIsRevealed(null);
      x.set(0);
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    action.onAction();
    setIsRevealed(null);
    x.set(0);
  };

  // Close actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsRevealed(null);
        x.set(0);
      }
    };

    if (isRevealed) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isRevealed, x]);

  return (
    <div ref={cardRef} className={cn('relative overflow-hidden', className)}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                'w-20 flex flex-col items-center justify-center',
                'text-white font-medium text-sm',
                'touch-manipulation'
              )}
              style={{ backgroundColor: action.backgroundColor }}
              initial={{ x: -80 }}
              animate={{ 
                x: isRevealed === 'left' ? 0 : -80,
                transition: { delay: index * 0.05 }
              }}
            >
              {action.icon}
              <span className="mt-1 text-xs">{action.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                'w-20 flex flex-col items-center justify-center',
                'text-white font-medium text-sm',
                'touch-manipulation'
              )}
              style={{ backgroundColor: action.backgroundColor }}
              initial={{ x: 80 }}
              animate={{ 
                x: isRevealed === 'right' ? 0 : 80,
                transition: { delay: index * 0.05 }
              }}
            >
              {action.icon}
              <span className="mt-1 text-xs">{action.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ 
          left: rightActions.length > 0 ? -rightActionWidth : 0, 
          right: leftActions.length > 0 ? leftActionWidth : 0 
        }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-white dark:bg-gray-900"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Pull to Refresh Component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const opacity = useTransform(y, [0, refreshThreshold], [0, 1]);
  const scale = useTransform(y, [0, refreshThreshold], [0.8, 1]);
  const rotate = useTransform(y, [0, refreshThreshold], [0, 180]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (containerRef.current?.scrollTop === 0 && info.offset.y > 0) {
      setPullDistance(info.offset.y);
    }
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > refreshThreshold && containerRef.current?.scrollTop === 0) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative overflow-auto', className)}>
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10"
        style={{ opacity, y: -40 }}
      >
        <motion.div
          className="flex items-center space-x-2 text-green-600 dark:text-green-400"
          style={{ scale }}
        >
          <motion.div style={{ rotate }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.div>
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : pullDistance > refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className={cn(
          'min-h-full',
          isRefreshing && 'pointer-events-none'
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Long Press Component
interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onPress?: () => void;
  duration?: number;
  className?: string;
}

export const LongPress: React.FC<LongPressProps> = ({
  children,
  onLongPress,
  onPress,
  duration = 500,
  className
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    setIsPressed(true);
    setProgress(0);

    // Progress animation
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 10));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 10);

    // Long press trigger
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      endPress();
    }, duration);
  };

  const endPress = () => {
    setIsPressed(false);
    setProgress(0);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleClick = () => {
    if (progress < 100) {
      onPress?.();
    }
    endPress();
  };

  return (
    <motion.div
      className={cn('relative touch-manipulation', className)}
      onMouseDown={startPress}
      onMouseUp={handleClick}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      
      {/* Progress Indicator */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-green-500 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-green-500/20 rounded-lg"
            style={{
              clipPath: `inset(0 ${100 - progress}% 0 0)`
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Touch Ripple Effect
interface TouchRippleProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  disabled?: boolean;
}

export const TouchRipple: React.FC<TouchRippleProps> = ({
  children,
  className,
  rippleColor = 'rgba(34, 197, 94, 0.3)',
  disabled = false
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden touch-manipulation', className)}
      onMouseDown={createRipple}
      onTouchStart={createRipple}
    >
      {children}
      
      {/* Ripples */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor
          }}
          initial={{
            width: 0,
            height: 0,
            x: '-50%',
            y: '-50%',
            opacity: 1
          }}
          animate={{
            width: 300,
            height: 300,
            opacity: 0
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};

// Floating Action Button with touch interactions
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  extended?: boolean;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  className,
  size = 'md',
  position = 'bottom-right',
  extended = false,
  label
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed z-50 flex items-center justify-center',
        'bg-green-600 hover:bg-green-700 text-white',
        'rounded-full shadow-lg',
        'touch-manipulation',
        'transition-colors duration-200',
        extended ? 'px-6 py-3 rounded-full' : sizeClasses[size],
        positionClasses[position],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
    >
      <TouchRipple rippleColor="rgba(255, 255, 255, 0.3)">
        <div className="flex items-center space-x-2">
          {icon}
          {extended && label && (
            <span className="font-medium">{label}</span>
          )}
        </div>
      </TouchRipple>
    </motion.button>
  );
};

export default {
  SwipeableCard,
  PullToRefresh,
  LongPress,
  TouchRipple,
  FloatingActionButton
};
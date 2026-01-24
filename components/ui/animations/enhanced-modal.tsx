'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { modalVariants, overlayVariants } from './index';

// Enhanced Dialog Root
function EnhancedDialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

// Enhanced Dialog Trigger
function EnhancedDialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

// Enhanced Dialog Portal
function EnhancedDialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

// Enhanced Dialog Close
function EnhancedDialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

// Enhanced Dialog Overlay with animations
function EnhancedDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay asChild {...props}>
      <motion.div
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
          className
        )}
      />
    </DialogPrimitive.Overlay>
  );
}

// Enhanced Dialog Content with multiple animation variants
interface EnhancedDialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  animation?: 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  fullscreen?: boolean;
  onFullscreenToggle?: (fullscreen: boolean) => void;
}

function EnhancedDialogContent({
  className,
  children,
  showCloseButton = true,
  animation = 'scale',
  size = 'md',
  position = 'center',
  fullscreen = false,
  onFullscreenToggle,
  ...props
}: EnhancedDialogContentProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(fullscreen);
  
  const handleFullscreenToggle = () => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    onFullscreenToggle?.(newFullscreen);
  };

  // Animation variants based on animation prop
  const getAnimationVariants = () => {
    switch (animation) {
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 100, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 100, scale: 0.95 }
        };
      case 'slide-down':
        return {
          initial: { opacity: 0, y: -100, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -100, scale: 0.95 }
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 100, scale: 0.95 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: 100, scale: 0.95 }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -100, scale: 0.95 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -100, scale: 0.95 }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      default: // scale
        return modalVariants;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Position classes
  const positionClasses = {
    center: 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]',
    top: 'top-[10%] left-[50%] translate-x-[-50%]',
    bottom: 'bottom-[10%] left-[50%] translate-x-[-50%]'
  };

  return (
    <EnhancedDialogPortal>
      <EnhancedDialogOverlay />
      <DialogPrimitive.Content asChild {...props}>
        <motion.div
          variants={getAnimationVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={cn(
            'fixed z-50 grid w-full gap-4 rounded-lg border bg-background p-6 shadow-lg',
            isFullscreen 
              ? 'inset-4 max-w-none max-h-none' 
              : cn(sizeClasses[size], positionClasses[position]),
            className
          )}
        >
          {children}
          
          {/* Close button */}
          {showCloseButton && (
            <DialogPrimitive.Close asChild>
              <motion.button
                className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </motion.button>
            </DialogPrimitive.Close>
          )}
          
          {/* Fullscreen toggle button */}
          {onFullscreenToggle && (
            <motion.button
              onClick={handleFullscreenToggle}
              className="absolute top-4 right-12 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              </span>
            </motion.button>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </EnhancedDialogPortal>
  );
}

// Enhanced Dialog Header with animation
function EnhancedDialogHeader({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<'div'>) {
  // Filter out HTML drag and animation event handlers to avoid conflicts with Framer Motion
  const {
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...filteredProps
  } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

// Enhanced Dialog Footer with animation
function EnhancedDialogFooter({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<'div'>) {
  // Filter out HTML drag and animation event handlers to avoid conflicts with Framer Motion
  const {
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...filteredProps
  } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...filteredProps}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.2, 
            delay: 0.3 + (index * 0.1),
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Enhanced Dialog Title with animation
function EnhancedDialogTitle({ 
  className, 
  children,
  ...props 
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title asChild {...props}>
      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn('text-lg leading-none font-semibold', className)}
      >
        {children}
      </motion.h2>
    </DialogPrimitive.Title>
  );
}

// Enhanced Dialog Description with animation
function EnhancedDialogDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description asChild {...props}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className={cn('text-muted-foreground text-sm', className)}
      >
        {children}
      </motion.p>
    </DialogPrimitive.Description>
  );
}

// Enhanced Dialog Body with staggered animation for content
interface EnhancedDialogBodyProps extends React.ComponentProps<'div'> {
  stagger?: boolean;
}

function EnhancedDialogBody({ 
  className, 
  children,
  stagger = false,
  ...props 
}: EnhancedDialogBodyProps) {
  // Filter out HTML drag and animation event handlers to avoid conflicts with Framer Motion
  const {
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...filteredProps
  } = props;

  if (stagger) {
    return (
      <motion.div
        className={cn('py-4', className)}
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        {...filteredProps}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn('py-4', className)}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

// Confirmation Dialog with enhanced animations
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <EnhancedDialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <EnhancedDialogContent animation="scale" size="sm">
            <EnhancedDialogHeader>
              <EnhancedDialogTitle>{title}</EnhancedDialogTitle>
              <EnhancedDialogDescription>
                {description}
              </EnhancedDialogDescription>
            </EnhancedDialogHeader>
            
            <EnhancedDialogFooter>
              <motion.button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {cancelText}
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors',
                  variant === 'destructive' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)]'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Loading...
                  </motion.div>
                ) : (
                  confirmText
                )}
              </motion.button>
            </EnhancedDialogFooter>
          </EnhancedDialogContent>
        )}
      </AnimatePresence>
    </EnhancedDialog>
  );
}

// Modal with slide-in animation from different directions
interface SlideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  direction: 'up' | 'down' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function SlideModal({
  open,
  onOpenChange,
  direction,
  children,
  className
}: SlideModalProps) {
  const animationMap = {
    up: 'slide-up',
    down: 'slide-down',
    left: 'slide-left',
    right: 'slide-right'
  } as const;

  return (
    <EnhancedDialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <EnhancedDialogContent 
            animation={animationMap[direction]}
            className={className}
          >
            {children}
          </EnhancedDialogContent>
        )}
      </AnimatePresence>
    </EnhancedDialog>
  );
}

export {
  EnhancedDialog,
  EnhancedDialogClose,
  EnhancedDialogContent,
  EnhancedDialogDescription,
  EnhancedDialogFooter,
  EnhancedDialogHeader,
  EnhancedDialogOverlay,
  EnhancedDialogPortal,
  EnhancedDialogTitle,
  EnhancedDialogTrigger,
  EnhancedDialogBody,
};
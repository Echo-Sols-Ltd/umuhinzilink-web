'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const enhancedButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 
          'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-light)] text-white shadow-md hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]',
        destructive: 
          'bg-gradient-to-r from-[var(--error)] to-[var(--error-light)] text-white shadow-md hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]',
        outline:
          'border-2 border-[var(--primary-green)] bg-transparent text-[var(--primary-green)] shadow-sm hover:bg-[var(--primary-green)] hover:text-white hover:shadow-md hover:shadow-green-500/25 active:scale-[0.98]',
        secondary: 
          'bg-gradient-to-r from-[var(--gray-100)] to-[var(--gray-200)] text-[var(--gray-800)] shadow-sm hover:shadow-md hover:from-[var(--gray-200)] hover:to-[var(--gray-300)] active:scale-[0.98]',
        ghost: 
          'text-[var(--primary-green)] hover:bg-[var(--primary-green-50)] hover:text-[var(--primary-green-dark)] active:scale-[0.98]',
        link: 
          'text-[var(--primary-green)] underline-offset-4 hover:underline hover:text-[var(--primary-green-dark)]',
        success:
          'bg-gradient-to-r from-[var(--success)] to-[var(--success-light)] text-white shadow-md hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]',
        warning:
          'bg-gradient-to-r from-[var(--warning)] to-[var(--warning-light)] text-white shadow-md hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98]',
        info:
          'bg-gradient-to-r from-[var(--info)] to-[var(--info-light)] text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      animation: {
        none: '',
        hover: 'hover:scale-[1.02] hover:-translate-y-0.5',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        glow: 'hover:shadow-[0_0_20px_rgba(0,166,62,0.4)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'hover',
    },
  }
);

// Ripple effect component
const RippleEffect: React.FC<{ 
  isActive: boolean; 
  x: number; 
  y: number; 
  color?: string;
}> = ({ isActive, x, y, color = 'rgba(255, 255, 255, 0.6)' }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.span
          className="absolute rounded-full pointer-events-none"
          style={{
            left: x - 10,
            top: y - 10,
            width: 20,
            height: 20,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
};

// Success checkmark animation
const SuccessCheckmark: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.175, 0.885, 0.32, 1.275] 
          }}
          className="absolute inset-0 flex items-center justify-center bg-[var(--success)] rounded-lg"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading spinner with smooth animation
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      className={cn('inline-block', sizeClasses[size])}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
};

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  rippleColor?: string;
  loadingText?: string;
  successText?: string;
  successDuration?: number;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    success = false,
    icon,
    iconPosition = 'left',
    ripple = true,
    rippleColor,
    loadingText,
    successText,
    successDuration = 2000,
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [rippleState, setRippleState] = React.useState({ isActive: false, x: 0, y: 0 });
    const [showSuccess, setShowSuccess] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    
    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);
    
    const Comp = asChild ? Slot : motion.button;
    const isDisabled = disabled || loading;
    
    // Handle success state
    React.useEffect(() => {
      if (success) {
        setShowSuccess(true);
        const timer = setTimeout(() => {
          setShowSuccess(false);
        }, successDuration);
        return () => clearTimeout(timer);
      }
    }, [success, successDuration]);
    
    // Handle ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !isDisabled && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setRippleState({ isActive: true, x, y });
        
        // Reset ripple after animation
        setTimeout(() => {
          setRippleState(prev => ({ ...prev, isActive: false }));
        }, 600);
      }
      
      if (onClick && !isDisabled) {
        onClick(e);
      }
    };
    
    // Determine button content
    const getButtonContent = () => {
      if (showSuccess && successText) {
        return successText;
      }
      if (loading && loadingText) {
        return loadingText;
      }
      return children;
    };
    
    // Determine if we should show loading spinner
    const shouldShowSpinner = loading && !showSuccess;
    
    // Determine if we should show icon
    const shouldShowIcon = !shouldShowSpinner && !showSuccess && icon;
    
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
      <Comp 
        ref={buttonRef}
        className={cn(enhancedButtonVariants({ variant, size, animation, className }))} 
        disabled={isDisabled}
        onClick={handleClick}
        whileHover={animation === 'hover' ? { 
          scale: 1.02, 
          y: -2,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : undefined}
        whileTap={animation === 'hover' ? { 
          scale: 0.98,
          transition: { duration: 0.1, ease: 'easeInOut' }
        } : undefined}
        {...filteredProps}
      >
        {/* Ripple effect */}
        {ripple && (
          <RippleEffect 
            isActive={rippleState.isActive} 
            x={rippleState.x} 
            y={rippleState.y}
            color={rippleColor}
          />
        )}
        
        {/* Success overlay */}
        <SuccessCheckmark isVisible={showSuccess} />
        
        {/* Button content container */}
        <motion.div 
          className="relative z-10 flex items-center justify-center gap-2"
          animate={{
            opacity: showSuccess ? 0 : 1,
            scale: showSuccess ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Loading spinner */}
          <AnimatePresence>
            {shouldShowSpinner && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingSpinner size={size === 'sm' ? 'sm' : size === 'lg' || size === 'xl' ? 'lg' : 'md'} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Left icon */}
          <AnimatePresence>
            {shouldShowIcon && iconPosition === 'left' && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                {icon}
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Button text */}
          <motion.span
            className="transition-all duration-200"
            animate={{
              opacity: shouldShowSpinner ? 0.7 : 1,
            }}
          >
            {getButtonContent()}
          </motion.span>
          
          {/* Right icon */}
          <AnimatePresence>
            {shouldShowIcon && iconPosition === 'right' && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                {icon}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Hover glow effect */}
        {animation === 'glow' && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-light)]"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Comp>
    );
  }
);
EnhancedButton.displayName = 'EnhancedButton';

// Button group component for related actions
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'sm',
  className
}) => {
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };
  
  return (
    <motion.div
      className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing],
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Floating Action Button component
export interface FloatingActionButtonProps extends EnhancedButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offset?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  position = 'bottom-right',
  offset = 24,
  className,
  children,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': `fixed bottom-${offset} right-${offset}`,
    'bottom-left': `fixed bottom-${offset} left-${offset}`,
    'top-right': `fixed top-${offset} right-${offset}`,
    'top-left': `fixed top-${offset} left-${offset}`
  };
  
  return (
    <motion.div
      className={positionClasses[position]}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.175, 0.885, 0.32, 1.275] 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <EnhancedButton
        size="icon-lg"
        className={cn('rounded-full shadow-lg z-50', className)}
        {...props}
      >
        {children}
      </EnhancedButton>
    </motion.div>
  );
};

export { EnhancedButton, enhancedButtonVariants };
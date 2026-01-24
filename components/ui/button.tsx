import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 
          'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-light)] text-white shadow-md hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] hover:from-[var(--primary-green-dark)] hover:to-[var(--primary-green)]',
        destructive: 
          'bg-gradient-to-r from-[var(--error)] to-[var(--error-light)] text-white shadow-md hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] hover:from-[var(--error-dark)] hover:to-[var(--error)]',
        outline:
          'border-2 border-[var(--primary-green)] bg-transparent text-[var(--primary-green)] shadow-sm hover:bg-[var(--primary-green)] hover:text-white hover:shadow-md hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98]',
        secondary: 
          'bg-gradient-to-r from-[var(--gray-100)] to-[var(--gray-200)] text-[var(--gray-800)] shadow-sm hover:shadow-md hover:from-[var(--gray-200)] hover:to-[var(--gray-300)] hover:scale-[1.02] active:scale-[0.98]',
        ghost: 
          'text-[var(--primary-green)] hover:bg-[var(--primary-green-50)] hover:text-[var(--primary-green-dark)] hover:scale-[1.02] active:scale-[0.98]',
        link: 
          'text-[var(--primary-green)] underline-offset-4 hover:underline hover:text-[var(--primary-green-dark)]',
        success:
          'bg-gradient-to-r from-[var(--success)] to-[var(--success-light)] text-white shadow-md hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] hover:from-[var(--success-dark)] hover:to-[var(--success)]',
        warning:
          'bg-gradient-to-r from-[var(--warning)] to-[var(--warning-light)] text-white shadow-md hover:shadow-lg hover:shadow-yellow-500/25 hover:scale-[1.02] active:scale-[0.98] hover:from-[var(--warning-dark)] hover:to-[var(--warning)]',
        info:
          'bg-gradient-to-r from-[var(--info)] to-[var(--info-light)] text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] hover:from-[var(--info-dark)] hover:to-[var(--info)]',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    const isDisabled = disabled || loading;
    
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        disabled={isDisabled}
        {...props}
      >
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          <span className="absolute inset-0 rounded-lg bg-white/20 opacity-0 transition-opacity duration-200 hover:opacity-100" />
        </span>
        
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {/* Left icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-1">{icon}</span>
        )}
        
        {/* Button content */}
        <span className={cn(
          'relative z-10 transition-all duration-200',
          loading && 'opacity-70'
        )}>
          {children}
        </span>
        
        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-1">{icon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

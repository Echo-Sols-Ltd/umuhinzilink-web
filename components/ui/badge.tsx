import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 
          'border-transparent bg-[var(--primary-green)] text-white shadow-sm hover:bg-[var(--primary-green-dark)] hover:shadow-md',
        secondary:
          'border-transparent bg-[var(--gray-100)] text-[var(--gray-800)] hover:bg-[var(--gray-200)]',
        destructive:
          'border-transparent bg-[var(--error)] text-white shadow-sm hover:bg-[var(--error-dark)] hover:shadow-md',
        success:
          'border-transparent bg-[var(--success)] text-white shadow-sm hover:bg-[var(--success-dark)] hover:shadow-md',
        warning:
          'border-transparent bg-[var(--warning)] text-white shadow-sm hover:bg-[var(--warning-dark)] hover:shadow-md',
        info:
          'border-transparent bg-[var(--info)] text-white shadow-sm hover:bg-[var(--info-dark)] hover:shadow-md',
        outline: 
          'border border-[var(--primary-green)] text-[var(--primary-green)] bg-transparent hover:bg-[var(--primary-green-50)]',
        ghost:
          'border-transparent bg-transparent text-[var(--gray-600)] hover:bg-[var(--gray-100)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

function Badge({ 
  className, 
  variant, 
  size, 
  dismissible = false, 
  onDismiss, 
  icon, 
  children,
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}

// Status Badge Component
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft';
}

function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    inactive: { variant: 'secondary' as const, text: 'Inactive' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    completed: { variant: 'success' as const, text: 'Completed' },
    cancelled: { variant: 'destructive' as const, text: 'Cancelled' },
    draft: { variant: 'ghost' as const, text: 'Draft' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  );
}

// Priority Badge Component
export interface PriorityBadgeProps extends Omit<BadgeProps, 'variant'> {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const priorityConfig = {
    low: { variant: 'secondary' as const, text: 'Low' },
    medium: { variant: 'info' as const, text: 'Medium' },
    high: { variant: 'warning' as const, text: 'High' },
    urgent: { variant: 'destructive' as const, text: 'Urgent' },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  );
}

// Count Badge Component
export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
}

function CountBadge({ count, max = 99, ...props }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge variant="destructive" size="sm" {...props}>
      {displayCount}
    </Badge>
  );
}

export { Badge, StatusBadge, PriorityBadge, CountBadge, badgeVariants };

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
      variant: {
        default: 'border-2 border-background',
        outline: 'border-2 border-border',
        ghost: 'border-0',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  badge?: React.ReactNode;
  hover?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, status, showStatus = false, badge, hover = false, ...props }, ref) => {
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };

    return (
      <div className="relative inline-block">
        <div
          ref={ref}
          className={cn(
            avatarVariants({ size, variant }),
            hover && 'hover:scale-105 hover:shadow-lg cursor-pointer',
            className
          )}
          {...props}
        />
        
        {/* Status Indicator */}
        {showStatus && status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-background',
              statusColors[status],
              size === 'sm' && 'h-2.5 w-2.5',
              size === 'default' && 'h-3 w-3',
              size === 'lg' && 'h-3.5 w-3.5',
              size === 'xl' && 'h-4 w-4',
              size === '2xl' && 'h-5 w-5'
            )}
          />
        )}
        
        {/* Badge */}
        {badge && (
          <div
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium',
              size === 'sm' && 'h-4 w-4 text-xs',
              size === 'default' && 'h-5 w-5 text-xs',
              size === 'lg' && 'h-6 w-6 text-sm',
              size === 'xl' && 'h-7 w-7 text-sm',
              size === '2xl' && 'h-8 w-8 text-base'
            )}
          >
            {badge}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends Omit<ImageProps, 'alt' | 'src'> {
  alt?: string;
  src?: string | null;
  className?: string;
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  ({ className, alt = '', src, ...props }, ref) => (
    <div ref={ref} className={cn('relative aspect-square h-full w-full', className)}>
      {src && <Image fill src={src} alt={alt} className="object-cover" {...props} />}
    </div>
  )
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = 'AvatarFallback';

// Avatar Group Component
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, size = 'default', className }, ref) => {
    const avatars = React.Children.toArray(children);
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const sizeClasses = {
      sm: '-ml-2',
      default: '-ml-3',
      lg: '-ml-4',
      xl: '-ml-5',
      '2xl': '-ml-6',
    };

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        {visibleAvatars.map((avatar, index) => (
          <div
            key={index}
            className={cn(
              'relative',
              index > 0 && sizeClasses[size],
              'hover:z-10 transition-all duration-200'
            )}
            style={{ zIndex: visibleAvatars.length - index }}
          >
            {React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
              variant: 'outline',
            } as Partial<AvatarProps>)}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative',
              sizeClasses[size],
              'hover:z-10 transition-all duration-200'
            )}
            style={{ zIndex: 0 }}
          >
            <Avatar size={size} variant="outline">
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants };

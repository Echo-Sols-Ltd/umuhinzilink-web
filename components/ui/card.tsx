import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl bg-card text-card-foreground transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border shadow-sm hover:shadow-md',
        elevated: 'shadow-lg hover:shadow-xl border-0',
        outlined: 'border-2 border-border hover:border-[var(--primary-green)]/50',
        ghost: 'border-0 shadow-none hover:bg-accent/50',
        gradient: 'bg-gradient-to-br from-card to-accent border shadow-sm hover:shadow-md',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-[0_0_20px_rgba(0,166,62,0.15)]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'lift',
      padding: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, hover: interactive ? hover : 'none', padding }),
        interactive && 'cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground leading-relaxed', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pb-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 border-t border-border/50', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

// Enhanced Card Variants for specific use cases

export interface ProductCardProps extends CardProps {
  image?: string;
  title: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  badge?: string;
  onSave?: () => void;
  onShare?: () => void;
  saved?: boolean;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ 
    image, 
    title, 
    price, 
    originalPrice, 
    rating, 
    badge, 
    onSave, 
    onShare, 
    saved = false,
    className,
    children,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      hover="lift"
      padding="none"
      interactive
      className={cn('overflow-hidden group', className)}
      {...props}
    >
      {/* Image Container */}
      {image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {badge && (
            <div className="absolute top-2 left-2 bg-[var(--primary-green)] text-white px-2 py-1 rounded-md text-xs font-medium">
              {badge}
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <svg className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : 'text-gray-600')} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={cn('w-4 h-4', i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300')}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        )}
        
        {price && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--primary-green)]">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
        )}
        
        {children}
      </div>
    </Card>
  )
);
ProductCard.displayName = 'ProductCard';

export interface DashboardCardProps extends CardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ 
    title, 
    value, 
    change, 
    icon, 
    trend = 'neutral', 
    loading = false,
    className,
    ...props 
  }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      hover="glow"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/20" />
      
      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {change !== undefined && !loading && (
              <div className={cn(
                'flex items-center gap-1 text-sm mt-1',
                trend === 'up' && 'text-[var(--success)]',
                trend === 'down' && 'text-[var(--error)]',
                trend === 'neutral' && 'text-muted-foreground'
              )}>
                {trend === 'up' && <span>↗</span>}
                {trend === 'down' && <span>↘</span>}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-full',
            trend === 'up' && 'bg-[var(--success)]/10 text-[var(--success)]',
            trend === 'down' && 'bg-[var(--error)]/10 text-[var(--error)]',
            trend === 'neutral' && 'bg-[var(--primary-green)]/10 text-[var(--primary-green)]'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
DashboardCard.displayName = 'DashboardCard';

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ProductCard,
  DashboardCard,
  cardVariants
};

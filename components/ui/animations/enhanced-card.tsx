'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Heart, Share2, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { HoverLift, HoverGlow } from './index';

const enhancedCardVariants = cva(
  'rounded-xl bg-card text-card-foreground transition-all duration-300 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border shadow-sm',
        elevated: 'shadow-lg border-0',
        outlined: 'border-2 border-border',
        ghost: 'border-0 shadow-none',
        gradient: 'bg-gradient-to-br from-card to-accent border shadow-sm',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-[0_0_20px_rgba(0,166,62,0.15)]',
        tilt: 'hover:rotate-1 hover:scale-[1.02]',
        float: 'hover:-translate-y-2 hover:shadow-xl',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      animation: {
        none: '',
        fade: 'animate-fade-up',
        slide: 'animate-slide-up',
        scale: 'animate-scale-in',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'lift',
      padding: 'default',
      animation: 'none',
    },
  }
);

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardVariants> {
  interactive?: boolean;
  loading?: boolean;
  delay?: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    variant, 
    hover, 
    padding, 
    animation,
    interactive = false, 
    loading = false,
    delay = 0,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={cn(enhancedCardVariants({ variant, hover: 'none', padding }), className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay }}
        >
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </motion.div>
      );
    }

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
        ref={ref}
        className={cn(
          enhancedCardVariants({ variant, hover: interactive ? hover : 'none', padding, animation }),
          interactive && 'cursor-pointer',
          className
        )}
        initial={animation !== 'none' ? { opacity: 0, y: 20, scale: 0.95 } : false}
        animate={animation !== 'none' ? { opacity: 1, y: 0, scale: 1 } : false}
        transition={{ duration: 0.3, delay, ease: [0.4, 0, 0.2, 1] }}
        whileHover={interactive && hover === 'lift' ? { 
          y: -4, 
          scale: 1.02,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : interactive && hover === 'scale' ? {
          scale: 1.05,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : interactive && hover === 'glow' ? {
          boxShadow: '0 0 25px rgba(0, 166, 62, 0.2)',
          transition: { duration: 0.3, ease: 'easeOut' }
        } : interactive && hover === 'tilt' ? {
          rotate: 2,
          scale: 1.02,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : interactive && hover === 'float' ? {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.3, ease: 'easeOut' }
        } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...filteredProps}
      >
        {/* Gradient overlay for glass effect */}
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        )}
        
        {/* Hover glow effect */}
        {interactive && hover === 'glow' && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--primary-green)]/10 to-[var(--primary-green-light)]/10 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {children}
      </motion.div>
    );
  }
);
EnhancedCard.displayName = 'EnhancedCard';

// Enhanced Card Header
const EnhancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
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
        ref={ref} 
        className={cn('flex flex-col space-y-1.5 pb-4', className)} 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        {...filteredProps}
      >
        {children}
      </motion.div>
    );
  }
);
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

// Enhanced Card Title
const EnhancedCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
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
        ref={ref}
        className={cn('text-xl font-semibold leading-none tracking-tight', className)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        {...filteredProps}
      >
        {children}
      </motion.div>
    );
  }
);
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

// Enhanced Card Description
const EnhancedCardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
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
        ref={ref} 
        className={cn('text-sm text-muted-foreground leading-relaxed', className)} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        {...filteredProps}
      >
        {children}
      </motion.div>
    );
  }
);
EnhancedCardDescription.displayName = 'EnhancedCardDescription';

// Enhanced Card Content
const EnhancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
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
        ref={ref} 
        className={cn('pb-4', className)} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        {...filteredProps}
      >
        {children}
      </motion.div>
    );
  }
);
EnhancedCardContent.displayName = 'EnhancedCardContent';

// Enhanced Card Footer
const EnhancedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
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
        ref={ref} 
        className={cn('flex items-center pt-4 border-t border-border/50', className)} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        {...filteredProps}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.35 + (index * 0.05) }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);
EnhancedCardFooter.displayName = 'EnhancedCardFooter';

// Product Card with enhanced animations
export interface EnhancedProductCardProps extends EnhancedCardProps {
  image?: string;
  title: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  badge?: string;
  onSave?: () => void;
  onShare?: () => void;
  saved?: boolean;
  discount?: number;
}

const EnhancedProductCard = React.forwardRef<HTMLDivElement, EnhancedProductCardProps>(
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
    discount,
    className,
    children,
    ...props 
  }, ref) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    // Filter out Framer Motion specific props that shouldn't be passed to EnhancedCard
    const {
      onHoverStart,
      onHoverEnd,
      ...cardProps
    } = props;

    return (
      <EnhancedCard
        ref={ref}
        variant="elevated"
        hover="float"
        padding="none"
        interactive
        className={cn('overflow-hidden group', className)}
        {...cardProps}
      >
        {/* Image Container */}
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Image placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? (isHovered ? 1.05 : 1) : 1.1, 
                opacity: imageLoaded ? 1 : 0 
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Badge */}
            <AnimatePresence>
              {badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="absolute top-3 left-3 bg-[var(--primary-green)] text-white px-2 py-1 rounded-md text-xs font-medium"
                >
                  {badge}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Discount badge */}
            <AnimatePresence>
              {discount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -12 }}
                  className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold"
                >
                  -{discount}%
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action buttons */}
            <motion.div
              className="absolute top-3 right-3 flex gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {onSave && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : 'text-gray-600')} />
                </motion.button>
              )}
              {onShare && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          <motion.h3 
            className="font-semibold text-lg mb-2 line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {title}
          </motion.h3>
          
          {/* Rating */}
          {rating && (
            <motion.div 
              className="flex items-center gap-1 mb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  className={cn('w-4 h-4', i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300')}
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + (i * 0.05) }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </motion.svg>
              ))}
            </motion.div>
          )}
          
          {/* Price */}
          {price && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="text-xl font-bold text-[var(--primary-green)]">{price}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
              )}
            </motion.div>
          )}
          
          {children}
        </div>
      </EnhancedCard>
    );
  }
);
EnhancedProductCard.displayName = 'EnhancedProductCard';

// Dashboard Card with enhanced animations
export interface EnhancedDashboardCardProps extends EnhancedCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const EnhancedDashboardCard = React.forwardRef<HTMLDivElement, EnhancedDashboardCardProps>(
  ({ 
    title, 
    value, 
    change, 
    icon, 
    trend = 'neutral', 
    loading = false,
    className,
    ...props 
  }, ref) => {
    const [animatedValue, setAnimatedValue] = React.useState(0);
    
    React.useEffect(() => {
      if (typeof value === 'number' && !loading) {
        const timer = setTimeout(() => {
          setAnimatedValue(value);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [value, loading]);

    return (
      <EnhancedCard
        ref={ref}
        variant="elevated"
        hover="glow"
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/20" />
        
        <EnhancedCardContent className="relative">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.p 
                className="text-sm font-medium text-muted-foreground mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.p>
              
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <motion.p 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  {typeof value === 'number' ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {animatedValue.toLocaleString()}
                    </motion.span>
                  ) : (
                    value
                  )}
                </motion.p>
              )}
              
              {change !== undefined && !loading && (
                <motion.div 
                  className={cn(
                    'flex items-center gap-1 text-sm mt-1',
                    trend === 'up' && 'text-[var(--success)]',
                    trend === 'down' && 'text-[var(--error)]',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(change)}%</span>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className={cn(
                'p-3 rounded-full',
                trend === 'up' && 'bg-[var(--success)]/10 text-[var(--success)]',
                trend === 'down' && 'bg-[var(--error)]/10 text-[var(--error)]',
                trend === 'neutral' && 'bg-[var(--primary-green)]/10 text-[var(--primary-green)]'
              )}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {icon}
            </motion.div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }
);
EnhancedDashboardCard.displayName = 'EnhancedDashboardCard';

// Card Grid with staggered animations
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <motion.div
      className={cn('grid', columnClasses[columns], gapClasses[gap], className)}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, y: 20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardFooter, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent,
  EnhancedProductCard,
  EnhancedDashboardCard,
  enhancedCardVariants
};
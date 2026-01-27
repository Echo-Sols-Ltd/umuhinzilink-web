import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ===== ENHANCED HEADING COMPONENT WITH AGRICULTURAL FOCUS =====
const headingVariants = cva(
  'font-primary tracking-tight text-foreground transition-colors',
  {
    variants: {
      variant: {
        display: 'text-[var(--text-display)] font-extrabold leading-tight',
        h1: 'text-[var(--text-h1)] font-bold leading-tight',
        h2: 'text-[var(--text-h2)] font-bold leading-tight',
        h3: 'text-[var(--text-h3)] font-semibold leading-snug',
        h4: 'text-[var(--text-h4)] font-semibold leading-snug',
        h5: 'text-[var(--text-h5)] font-medium leading-snug',
        h6: 'text-[var(--text-h6)] font-medium leading-normal',
        subtitle: 'text-lg md:text-xl lg:text-2xl font-normal leading-relaxed',
      },
      color: {
        default: 'text-foreground',
        primary: 'text-[var(--agricultural-primary)]',
        secondary: 'text-muted-foreground',
        success: 'text-[var(--growth-success)]',
        warning: 'text-[var(--caution-yellow-dark)]',
        error: 'text-[var(--alert-red)]',
        info: 'text-[var(--info-blue-dark)]',
        gradient: 'bg-gradient-to-r from-[var(--agricultural-primary)] to-[var(--agricultural-primary-light)] bg-clip-text text-transparent',
        'gradient-success': 'bg-gradient-to-r from-[var(--growth-success)] to-[var(--growth-success-light)] bg-clip-text text-transparent',
        'gradient-info': 'bg-gradient-to-r from-[var(--info-blue)] to-[var(--info-blue-light)] bg-clip-text text-transparent',
        'gradient-harvest': 'bg-gradient-to-r from-[var(--harvest-gold)] to-[var(--sunrise-orange)] bg-clip-text text-transparent',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
      contrast: {
        normal: '',
        high: 'typography-high-contrast',
        outdoor: 'typography-outdoor',
      },
    },
    defaultVariants: {
      variant: 'h1',
      color: 'default',
      align: 'left',
      contrast: 'normal',
    },
  }
);

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, color, align, weight, contrast, as, gradient, ...props }, ref) => {
    const Comp = (as || (variant === 'display' ? 'h1' : variant) || 'h1') as React.ElementType;
    
    return (
      <Comp
        className={cn(
          headingVariants({ variant, color: gradient ? 'gradient' : color, align, weight, contrast }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// ===== ENHANCED TEXT COMPONENT WITH AGRICULTURAL STYLES =====
const textVariants = cva(
  'font-primary text-foreground transition-colors',
  {
    variants: {
      variant: {
        body: 'text-[var(--text-body)] leading-[var(--leading-outdoor-normal)] tracking-[var(--tracking-agricultural)]',
        'body-sm': 'text-[var(--text-body-sm)] leading-[var(--leading-outdoor-normal)] tracking-[var(--tracking-agricultural)]',
        'body-lg': 'text-[var(--text-body-lg)] leading-[var(--leading-outdoor-normal)] tracking-[var(--tracking-agricultural)]',
        caption: 'text-[var(--text-caption)] leading-normal tracking-wide',
        label: 'text-[var(--text-label)] font-medium leading-normal tracking-wide',
        overline: 'text-[var(--text-caption)] font-medium uppercase tracking-widest leading-normal',
        code: 'font-mono text-sm bg-[var(--agricultural-green-50)] text-[var(--agricultural-green-800)] px-1.5 py-0.5 rounded-md border border-[var(--agricultural-green-200)]',
        lead: 'text-xl leading-[var(--leading-outdoor-relaxed)] text-muted-foreground tracking-[var(--tracking-agricultural)]',
        muted: 'text-sm text-muted-foreground leading-normal',
        small: 'text-sm font-medium leading-none',
        large: 'text-lg font-semibold leading-normal',
        // Agricultural-specific variants
        price: 'text-[var(--text-price)] font-bold leading-tight text-[var(--agricultural-primary)] tracking-tight',
        'price-large': 'text-[var(--text-price-large)] font-extrabold leading-tight text-[var(--agricultural-primary)] tracking-tight',
        quantity: 'text-[var(--text-quantity)] font-semibold leading-normal tracking-normal',
        measurement: 'text-[var(--text-measurement)] font-medium leading-normal text-muted-foreground tracking-wide',
        'farmer-name': 'text-[var(--text-farmer-name)] font-semibold leading-snug text-[var(--agricultural-primary)] tracking-normal',
        location: 'text-[var(--text-location)] font-normal leading-normal text-muted-foreground tracking-[var(--tracking-agricultural)]',
        status: 'text-[var(--text-status)] font-medium leading-normal tracking-wider uppercase',
      },
      color: {
        default: 'text-foreground',
        primary: 'text-[var(--agricultural-primary)]',
        secondary: 'text-muted-foreground',
        success: 'text-[var(--growth-success)]',
        warning: 'text-[var(--caution-yellow-dark)]',
        error: 'text-[var(--alert-red)]',
        info: 'text-[var(--info-blue-dark)]',
        muted: 'text-muted-foreground',
        'on-primary': 'text-primary-foreground',
        'on-secondary': 'text-secondary-foreground',
        // Agricultural semantic colors
        'status-success': 'text-[var(--growth-success)]',
        'status-warning': 'text-[var(--caution-yellow-dark)]',
        'status-error': 'text-[var(--alert-red)]',
        'status-info': 'text-[var(--info-blue-dark)]',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      transform: {
        none: 'normal-case',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
      },
      contrast: {
        normal: '',
        high: 'typography-high-contrast',
        outdoor: 'typography-outdoor',
        critical: 'typography-critical',
        'mobile-outdoor': 'typography-mobile-outdoor',
      },
    },
    defaultVariants: {
      variant: 'body',
      color: 'default',
      align: 'left',
      weight: 'normal',
      transform: 'none',
      contrast: 'normal',
    },
  }
);

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'code';
  truncate?: boolean;
  currency?: string;
  unit?: string;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, color, align, weight, transform, contrast, as = 'p', truncate, currency, unit, children, ...props }, ref) => {
    const Comp = as as React.ElementType;
    
    // Handle price formatting with currency
    if (variant === 'price' || variant === 'price-large') {
      return (
        <Comp
          className={cn(
            textVariants({ variant, color, align, weight, transform, contrast }),
            truncate && 'truncate',
            className
          )}
          ref={ref as any}
          {...props}
        >
          {currency && <span className="typography-price-currency">{currency}</span>}
          {children}
        </Comp>
      );
    }
    
    // Handle quantity/measurement formatting with units
    if ((variant === 'quantity' || variant === 'measurement') && unit) {
      return (
        <Comp
          className={cn(
            textVariants({ variant, color, align, weight, transform, contrast }),
            truncate && 'truncate',
            className
          )}
          ref={ref as any}
          {...props}
        >
          {children}
          <span className="typography-unit">{unit}</span>
        </Comp>
      );
    }
    
    return (
      <Comp
        className={cn(
          textVariants({ variant, color, align, weight, transform, contrast }),
          truncate && 'truncate',
          className
        )}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

// ===== BLOCKQUOTE COMPONENT =====
const blockquoteVariants = cva(
  'border-l-4 border-[var(--primary-green)] pl-6 italic font-primary',
  {
    variants: {
      variant: {
        default: 'text-lg leading-relaxed text-muted-foreground',
        large: 'text-xl leading-relaxed text-muted-foreground',
        small: 'text-base leading-normal text-muted-foreground',
      },
      color: {
        default: 'border-[var(--primary-green)] text-muted-foreground',
        primary: 'border-[var(--primary-green)] text-[var(--primary-green)]',
        success: 'border-[var(--success)] text-[var(--success)]',
        warning: 'border-[var(--warning)] text-[var(--warning)]',
        error: 'border-[var(--error)] text-[var(--error)]',
        info: 'border-[var(--info)] text-[var(--info)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      color: 'default',
    },
  }
);

export interface BlockquoteProps
  extends Omit<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, 'color'>,
    VariantProps<typeof blockquoteVariants> {
  cite?: string;
  author?: string;
}

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, variant, color, cite, author, children, ...props }, ref) => {
    return (
      <figure className="my-6">
        <blockquote
          className={cn(blockquoteVariants({ variant, color }), className)}
          cite={cite}
          ref={ref}
          {...props}
        >
          {children}
        </blockquote>
        {author && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            — {author}
          </figcaption>
        )}
      </figure>
    );
  }
);
Blockquote.displayName = 'Blockquote';

// ===== LIST COMPONENT =====
const listVariants = cva(
  'font-primary space-y-2',
  {
    variants: {
      variant: {
        unordered: 'list-disc list-inside',
        ordered: 'list-decimal list-inside',
        none: 'list-none',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
      spacing: {
        tight: 'space-y-1',
        normal: 'space-y-2',
        relaxed: 'space-y-3',
      },
    },
    defaultVariants: {
      variant: 'unordered',
      size: 'default',
      spacing: 'normal',
    },
  }
);

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {
  as?: 'ul' | 'ol';
}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, variant, size, spacing, as, ...props }, ref) => {
    const Comp = as || (variant === 'ordered' ? 'ol' : 'ul');
    
    return (
      <Comp
        className={cn(listVariants({ variant, size, spacing }), className)}
        ref={ref as any}
        {...props}
      />
    );
  }
);
List.displayName = 'List';

// ===== LIST ITEM COMPONENT =====
export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <li
        className={cn(
          'flex items-start gap-2',
          !icon && 'list-item',
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0 mt-0.5 text-[var(--primary-green)]">
            {icon}
          </span>
        )}
        <span className={cn(!icon && 'list-item')}>{children}</span>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

// ===== AGRICULTURAL-SPECIFIC TYPOGRAPHY COMPONENTS =====

// Price Display Component
export interface PriceProps extends Omit<TextProps, 'variant'> {
  amount: number | string;
  currency?: string;
  size?: 'normal' | 'large';
  showCurrency?: boolean;
}

const Price = React.forwardRef<HTMLSpanElement, PriceProps>(
  ({ amount, currency = 'RWF', size = 'normal', showCurrency = true, className, ...props }, ref) => {
    const variant = size === 'large' ? 'price-large' : 'price';
    
    return (
      <Text
        as="span"
        variant={variant}
        className={cn('tabular-nums', className)}
        ref={ref}
        {...props}
      >
        {showCurrency && <span className="typography-price-currency">{currency}</span>}
        {typeof amount === 'number' ? amount.toLocaleString() : amount}
      </Text>
    );
  }
);
Price.displayName = 'Price';

// Quantity Display Component
export interface QuantityProps extends Omit<TextProps, 'variant'> {
  amount: number | string;
  unit: string;
  showUnit?: boolean;
}

const Quantity = React.forwardRef<HTMLSpanElement, QuantityProps>(
  ({ amount, unit, showUnit = true, className, ...props }, ref) => {
    return (
      <Text
        as="span"
        variant="quantity"
        className={cn('tabular-nums', className)}
        ref={ref}
        {...props}
      >
        {typeof amount === 'number' ? amount.toLocaleString() : amount}
        {showUnit && <span className="typography-unit">{unit}</span>}
      </Text>
    );
  }
);
Quantity.displayName = 'Quantity';

// Measurement Display Component
export interface MeasurementProps extends Omit<TextProps, 'variant'> {
  value: number | string;
  unit: string;
  precision?: number;
}

const Measurement = React.forwardRef<HTMLSpanElement, MeasurementProps>(
  ({ value, unit, precision = 2, className, ...props }, ref) => {
    const formattedValue = typeof value === 'number' 
      ? value.toFixed(precision).replace(/\.?0+$/, '')
      : value;
    
    return (
      <Text
        as="span"
        variant="measurement"
        className={cn('tabular-nums', className)}
        ref={ref}
        {...props}
      >
        {formattedValue}
        <span className="typography-unit">{unit}</span>
      </Text>
    );
  }
);
Measurement.displayName = 'Measurement';

// Farmer Name Component
export interface FarmerNameProps extends Omit<TextProps, 'variant'> {
  name: string;
  verified?: boolean;
}

const FarmerName = React.forwardRef<HTMLSpanElement, FarmerNameProps>(
  ({ name, verified = false, className, children, ...props }, ref) => {
    return (
      <Text
        as="span"
        variant="farmer-name"
        className={className}
        ref={ref}
        {...props}
      >
        {name}
        {verified && (
          <span className="ml-1 text-[var(--growth-success)]" title="Verified Farmer">
            ✓
          </span>
        )}
        {children}
      </Text>
    );
  }
);
FarmerName.displayName = 'FarmerName';

// Location Display Component
export interface LocationProps extends Omit<TextProps, 'variant'> {
  location: string;
  showIcon?: boolean;
}

const Location = React.forwardRef<HTMLSpanElement, LocationProps>(
  ({ location, showIcon = true, className, ...props }, ref) => {
    return (
      <Text
        as="span"
        variant="location"
        className={cn('flex items-center gap-1', className)}
        ref={ref}
        {...props}
      >
        {showIcon && (
          <span className="text-[var(--agricultural-primary-light)]" aria-hidden="true">
            📍
          </span>
        )}
        {location}
      </Text>
    );
  }
);
Location.displayName = 'Location';

// Status Badge Component
export interface StatusProps extends Omit<TextProps, 'variant' | 'color'> {
  status: 'available' | 'sold' | 'pending' | 'expired' | 'verified' | 'unverified';
  showIcon?: boolean;
}

const Status = React.forwardRef<HTMLSpanElement, StatusProps>(
  ({ status, showIcon = true, className, ...props }, ref) => {
    const statusConfig = {
      available: { color: 'status-success' as const, icon: '✓', label: 'Available' },
      sold: { color: 'status-error' as const, icon: '✗', label: 'Sold' },
      pending: { color: 'status-warning' as const, icon: '⏳', label: 'Pending' },
      expired: { color: 'status-error' as const, icon: '⚠', label: 'Expired' },
      verified: { color: 'status-success' as const, icon: '✓', label: 'Verified' },
      unverified: { color: 'status-warning' as const, icon: '?', label: 'Unverified' },
    };
    
    const config = statusConfig[status];
    
    return (
      <Text
        as="span"
        variant="status"
        color={config.color}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
          'bg-opacity-10 border border-current border-opacity-20',
          className
        )}
        ref={ref}
        {...props}
      >
        {showIcon && (
          <span aria-hidden="true">{config.icon}</span>
        )}
        {config.label}
      </Text>
    );
  }
);
Status.displayName = 'Status';

// ===== TYPOGRAPHY SECTION COMPONENT =====
export interface TypographySectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
}

const TypographySection = React.forwardRef<HTMLElement, TypographySectionProps>(
  ({ className, as = 'section', spacing = 'normal', ...props }, ref) => {
    const Comp = as;
    
    const spacingClasses = {
      tight: 'space-y-4',
      normal: 'space-y-6',
      relaxed: 'space-y-8',
      loose: 'space-y-12',
    };
    
    return (
      <Comp
        className={cn(
          'typography-section',
          spacingClasses[spacing],
          className
        )}
        ref={ref as any}
        {...props}
      />
    );
  }
);
TypographySection.displayName = 'TypographySection';

// ===== EXPORTS =====
export {
  Heading,
  Text,
  Blockquote,
  List,
  ListItem,
  TypographySection,
  // Agricultural-specific components
  Price,
  Quantity,
  Measurement,
  FarmerName,
  Location,
  Status,
  // Variant functions
  headingVariants,
  textVariants,
  blockquoteVariants,
  listVariants,
};
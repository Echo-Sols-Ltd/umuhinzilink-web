import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ===== HEADING COMPONENT =====
const headingVariants = cva(
  'font-primary tracking-tight text-foreground transition-colors',
  {
    variants: {
      variant: {
        h1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
        h2: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
        h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug',
        h4: 'text-xl md:text-2xl lg:text-3xl font-semibold leading-snug',
        h5: 'text-lg md:text-xl lg:text-2xl font-medium leading-snug',
        h6: 'text-base md:text-lg lg:text-xl font-medium leading-normal',
        display: 'text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight',
        subtitle: 'text-lg md:text-xl lg:text-2xl font-normal leading-relaxed',
      },
      color: {
        default: 'text-foreground',
        primary: 'text-[var(--primary-green)]',
        secondary: 'text-muted-foreground',
        success: 'text-[var(--success)]',
        warning: 'text-[var(--warning)]',
        error: 'text-[var(--error)]',
        info: 'text-[var(--info)]',
        gradient: 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-light)] bg-clip-text text-transparent',
        'gradient-success': 'bg-gradient-to-r from-[var(--success)] to-[var(--success-light)] bg-clip-text text-transparent',
        'gradient-info': 'bg-gradient-to-r from-[var(--info)] to-[var(--info-light)] bg-clip-text text-transparent',
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
    },
    defaultVariants: {
      variant: 'h1',
      color: 'default',
      align: 'left',
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
  ({ className, variant, color, align, weight, as, gradient, ...props }, ref) => {
    const Comp = (as || (variant === 'display' ? 'h1' : variant) || 'h1') as React.ElementType;
    
    return (
      <Comp
        className={cn(
          headingVariants({ variant, color: gradient ? 'gradient' : color, align, weight }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// ===== TEXT COMPONENT =====
const textVariants = cva(
  'font-primary text-foreground transition-colors',
  {
    variants: {
      variant: {
        body: 'text-base leading-relaxed',
        'body-sm': 'text-sm leading-normal',
        'body-lg': 'text-lg leading-relaxed',
        caption: 'text-xs leading-normal',
        label: 'text-sm font-medium leading-normal',
        overline: 'text-xs font-medium uppercase tracking-wider leading-normal',
        code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded-md',
        lead: 'text-xl leading-relaxed text-muted-foreground',
        muted: 'text-sm text-muted-foreground leading-normal',
        small: 'text-sm font-medium leading-none',
        large: 'text-lg font-semibold leading-normal',
      },
      color: {
        default: 'text-foreground',
        primary: 'text-[var(--primary-green)]',
        secondary: 'text-muted-foreground',
        success: 'text-[var(--success)]',
        warning: 'text-[var(--warning)]',
        error: 'text-[var(--error)]',
        info: 'text-[var(--info)]',
        muted: 'text-muted-foreground',
        'on-primary': 'text-primary-foreground',
        'on-secondary': 'text-secondary-foreground',
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
    },
    defaultVariants: {
      variant: 'body',
      color: 'default',
      align: 'left',
      weight: 'normal',
      transform: 'none',
    },
  }
);

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'code';
  truncate?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, color, align, weight, transform, as = 'p', truncate, ...props }, ref) => {
    const Comp = as as React.ElementType;
    
    return (
      <Comp
        className={cn(
          textVariants({ variant, color, align, weight, transform }),
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
  headingVariants,
  textVariants,
  blockquoteVariants,
  listVariants,
};
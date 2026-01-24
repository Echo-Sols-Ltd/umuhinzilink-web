# Enhanced Typography System

## Overview

The enhanced typography system provides a comprehensive set of components and utilities for creating consistent, accessible, and beautiful text across the UmuhinziLink platform. It follows the design requirements for Task 7: "Enhance Typography and Visual Hierarchy".

## Features

### ✅ Requirements Compliance

- **4.1**: Consistent typography scales with proper line heights
- **4.2**: Optimal contrast ratios for accessibility (WCAG AA compliant)
- **4.3**: Clear heading, subheading, and body text hierarchy
- **4.4**: Appropriate font weights for emphasis
- **4.5**: Mobile-optimized responsive typography
- **4.6**: Clear label typography with proper spacing
- **4.7**: Appropriate font families for readability
- **4.8**: Color and typography for status information

### 🎨 Design System Integration

- Uses existing CSS custom properties from the design system
- Maintains the primary green color scheme (#00A63E)
- Integrates with Tailwind CSS configuration
- Supports dark mode automatically

### 📱 Responsive Design

- Mobile-first approach with `clamp()` for fluid scaling
- Breakpoint-specific optimizations
- Touch-friendly sizing on mobile devices
- Maintains readability across all screen sizes

### ♿ Accessibility Features

- WCAG AA compliant contrast ratios
- Screen reader friendly semantic markup
- High contrast mode support
- Reduced motion preferences respected
- Proper focus indicators
- Print-optimized styles

## Components

### Heading Component

```tsx
import { Heading } from '@/components/ui/typography';

// Basic usage
<Heading variant="h1">Page Title</Heading>

// With color and gradient
<Heading variant="h2" color="primary">Section Title</Heading>
<Heading variant="h3" gradient>Gradient Title</Heading>

// Custom element
<Heading as="h2" variant="h1">Custom Semantic Element</Heading>
```

**Variants:**
- `display` - Hero sections (largest)
- `h1` - Page titles
- `h2` - Section headings
- `h3` - Subsection headings
- `h4` - Component headings
- `h5` - Card headings
- `h6` - Small headings
- `subtitle` - Subtitle text

**Colors:**
- `default` - Standard foreground color
- `primary` - Brand green color
- `secondary` - Muted foreground
- `success`, `warning`, `error`, `info` - Semantic colors
- `gradient` - Primary gradient effect
- `gradient-success`, `gradient-info` - Other gradients

### Text Component

```tsx
import { Text } from '@/components/ui/typography';

// Basic usage
<Text variant="body">Regular paragraph text</Text>

// Different variants
<Text variant="lead">Introductory text</Text>
<Text variant="caption">Small caption text</Text>
<Text variant="label">Form label</Text>

// With colors and styling
<Text variant="body" color="muted">Muted text</Text>
<Text variant="body" weight="bold">Bold text</Text>
<Text variant="body" truncate>Long text that will be truncated...</Text>
```

**Variants:**
- `body` - Default paragraph text
- `body-sm` - Small body text
- `body-lg` - Large body text
- `lead` - Introductory paragraphs
- `caption` - Image captions, footnotes
- `label` - Form labels, UI labels
- `overline` - Category labels
- `code` - Inline code
- `muted` - Secondary text
- `small` - Small emphasized text
- `large` - Large emphasized text

### List Components

```tsx
import { List, ListItem } from '@/components/ui/typography';
import { CheckCircle } from 'lucide-react';

// Basic list
<List variant="unordered">
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
</List>

// List with icons
<List variant="none">
  <ListItem icon={<CheckCircle className="w-4 h-4" />}>
    Item with icon
  </ListItem>
</List>
```

### Blockquote Component

```tsx
import { Blockquote } from '@/components/ui/typography';

<Blockquote 
  variant="default" 
  color="primary"
  author="John Doe"
>
  This is a beautiful blockquote with proper styling.
</Blockquote>
```

### Typography Section

```tsx
import { TypographySection } from '@/components/ui/typography';

<TypographySection spacing="normal">
  <Heading variant="h2">Section Title</Heading>
  <Text variant="body">Section content with proper spacing.</Text>
</TypographySection>
```

## CSS Utilities

### Typography Classes

```css
/* Heading styles */
.typography-display
.typography-h1
.typography-h2
.typography-h3
.typography-h4
.typography-h5
.typography-h6

/* Text styles */
.typography-lead
.typography-body
.typography-body-lg
.typography-body-sm
.typography-caption
.typography-label
.typography-overline
.typography-code

/* Color utilities */
.typography-primary
.typography-success
.typography-warning
.typography-error
.typography-info
.typography-muted

/* Gradient effects */
.typography-gradient-primary
.typography-gradient-success
.typography-gradient-info

/* Font weights */
.typography-light
.typography-normal
.typography-medium
.typography-semibold
.typography-bold
.typography-extrabold

/* Text alignment */
.typography-left
.typography-center
.typography-right
.typography-justify

/* Text truncation */
.typography-truncate
.typography-truncate-2
.typography-truncate-3
.typography-truncate-4
```

## Usage Examples

### Hero Section

```tsx
<TypographySection spacing="normal">
  <Heading variant="h1" className="max-w-2xl">
    Connect Farmers to{' '}
    <span className="typography-gradient-primary">Digital Markets</span>
  </Heading>
  
  <Text variant="lead" color="secondary" className="max-w-lg">
    Empowering smallholder farmers in Rwanda with Technology to access markets.
  </Text>
</TypographySection>
```

### Feature Card

```tsx
<div className="p-6 bg-card border rounded-lg">
  <Heading variant="h4" className="mb-2">
    Feature Title
  </Heading>
  <Text variant="overline" color="primary">
    Premium Feature
  </Text>
  <Text variant="body" className="mb-4">
    Feature description with proper typography hierarchy.
  </Text>
  <List variant="none" spacing="tight">
    <ListItem icon={<CheckCircle className="w-4 h-4" />}>
      Feature benefit one
    </ListItem>
    <ListItem icon={<CheckCircle className="w-4 h-4" />}>
      Feature benefit two
    </ListItem>
  </List>
</div>
```

### Form with Typography

```tsx
<form className="space-y-4">
  <div>
    <Text variant="label" as="label" htmlFor="email">
      Email Address
    </Text>
    <Input id="email" type="email" />
    <Text variant="caption" color="muted">
      We'll never share your email with anyone else.
    </Text>
  </div>
</form>
```

## Responsive Behavior

The typography system automatically scales across devices:

- **Mobile (< 640px)**: Smaller font sizes, tighter line heights
- **Tablet (641px - 1024px)**: Medium font sizes
- **Desktop (> 1024px)**: Full font sizes with optimal spacing

All scaling is handled automatically using CSS `clamp()` functions.

## Accessibility Features

### Contrast Ratios

All text colors meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: Enhanced contrast on focus

### Screen Reader Support

- Semantic HTML elements (`h1`, `h2`, `p`, etc.)
- Proper heading hierarchy
- ARIA labels where appropriate
- Meaningful text content

### Motion Preferences

- Respects `prefers-reduced-motion` setting
- Disables gradient animations when requested
- Maintains functionality without motion

## Performance Considerations

- CSS custom properties for efficient theming
- Minimal JavaScript footprint
- Tree-shakeable components
- Optimized for Core Web Vitals

## Migration Guide

### From Old Typography

```tsx
// Old way
<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
  Title
</h1>

// New way
<Heading variant="h1">
  Title
</Heading>
```

### From Tailwind Classes

```tsx
// Old way
<p className="text-lg text-gray-600 leading-relaxed">
  Description
</p>

// New way
<Text variant="lead" color="secondary">
  Description
</Text>
```

## Testing

The typography system includes:
- Visual regression tests
- Accessibility audits
- Cross-browser compatibility
- Mobile responsiveness tests

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new typography variants:
1. Follow the existing naming conventions
2. Ensure accessibility compliance
3. Test across all breakpoints
4. Update documentation
5. Add visual tests

## Related Files

- `components/ui/typography.tsx` - Main components
- `styles/typography.css` - CSS utilities and styles
- `app/globals.css` - Global typography integration
- `tailwind.config.js` - Tailwind configuration
- `components/ui/typography-showcase.tsx` - Demo component
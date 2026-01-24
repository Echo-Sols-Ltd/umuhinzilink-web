'use client';

import React from 'react';
import { 
  Heading, 
  Text, 
  Blockquote, 
  List, 
  ListItem, 
  TypographySection 
} from './typography';
import { CheckCircle, Star, ArrowRight, Zap } from 'lucide-react';

export function TypographyShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <TypographySection spacing="normal">
        <Heading variant="display" gradient className="text-center">
          Enhanced Typography System
        </Heading>
        <Text variant="lead" align="center" className="max-w-2xl mx-auto">
          A comprehensive typography system designed for accessibility, readability, 
          and visual hierarchy across all devices and contexts.
        </Text>
      </TypographySection>

      {/* Heading Hierarchy */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Heading Hierarchy
        </Heading>
        <Text variant="body" color="muted">
          Consistent heading styles that create clear visual hierarchy and improve content scanability.
        </Text>
        
        <div className="space-y-6 p-6 bg-muted/30 rounded-lg">
          <Heading variant="display">Display Heading</Heading>
          <Heading variant="h1">H1 - Page Title</Heading>
          <Heading variant="h2">H2 - Section Heading</Heading>
          <Heading variant="h3">H3 - Subsection Heading</Heading>
          <Heading variant="h4">H4 - Component Heading</Heading>
          <Heading variant="h5">H5 - Card Heading</Heading>
          <Heading variant="h6">H6 - Small Heading</Heading>
        </div>
      </TypographySection>

      {/* Text Variants */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Text Variants
        </Heading>
        <Text variant="body" color="muted">
          Various text styles for different content types and contexts.
        </Text>
        
        <div className="space-y-4 p-6 bg-muted/30 rounded-lg">
          <Text variant="lead">
            Lead text - Perfect for introductory paragraphs that need emphasis.
          </Text>
          <Text variant="body">
            Body text - The default paragraph text with optimal readability and line height.
          </Text>
          <Text variant="body-lg">
            Large body text - For emphasized content that needs more presence.
          </Text>
          <Text variant="body-sm">
            Small body text - For secondary information and supporting details.
          </Text>
          <Text variant="label">
            Label text - For form labels and UI elements.
          </Text>
          <Text variant="caption">
            Caption text - For image captions, footnotes, and fine print.
          </Text>
          <Text variant="overline">
            Overline text - For category labels and section markers.
          </Text>
          <Text variant="code" as="code">
            Code text - For inline code snippets and technical content.
          </Text>
        </div>
      </TypographySection>

      {/* Color Variants */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Color Variants
        </Heading>
        <Text variant="body" color="muted">
          Semantic colors that convey meaning and maintain accessibility standards.
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-lg">
          <Text variant="body" color="default">Default text color</Text>
          <Text variant="body" color="primary">Primary brand color</Text>
          <Text variant="body" color="secondary">Secondary muted color</Text>
          <Text variant="body" color="success">Success state color</Text>
          <Text variant="body" color="warning">Warning state color</Text>
          <Text variant="body" color="error">Error state color</Text>
          <Text variant="body" color="info">Information color</Text>
          <Text variant="body" color="muted">Muted text color</Text>
        </div>
      </TypographySection>

      {/* Gradient Text */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Gradient Text Effects
        </Heading>
        <Text variant="body" color="muted">
          Beautiful gradient text effects for special emphasis and branding.
        </Text>
        
        <div className="space-y-4 p-6 bg-muted/30 rounded-lg">
          <Heading variant="h3" gradient>
            Primary Gradient Heading
          </Heading>
          <Heading variant="h4" color="gradient-success">
            Success Gradient Heading
          </Heading>
          <Heading variant="h4" color="gradient-info">
            Info Gradient Heading
          </Heading>
        </div>
      </TypographySection>

      {/* Lists */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Enhanced Lists
        </Heading>
        <Text variant="body" color="muted">
          Well-structured lists with proper spacing and optional icons.
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-muted/30 rounded-lg">
            <Heading variant="h5" className="mb-4">Unordered List</Heading>
            <List variant="unordered" spacing="normal">
              <ListItem>First list item with proper spacing</ListItem>
              <ListItem>Second item with consistent formatting</ListItem>
              <ListItem>Third item maintaining visual hierarchy</ListItem>
            </List>
          </div>
          
          <div className="p-6 bg-muted/30 rounded-lg">
            <Heading variant="h5" className="mb-4">Icon List</Heading>
            <List variant="none" spacing="normal">
              <ListItem icon={<CheckCircle className="w-4 h-4" />}>
                Feature with checkmark icon
              </ListItem>
              <ListItem icon={<Star className="w-4 h-4" />}>
                Premium feature with star icon
              </ListItem>
              <ListItem icon={<Zap className="w-4 h-4" />}>
                Fast feature with lightning icon
              </ListItem>
            </List>
          </div>
        </div>
      </TypographySection>

      {/* Blockquotes */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Blockquotes
        </Heading>
        <Text variant="body" color="muted">
          Styled blockquotes for testimonials, quotes, and emphasized content.
        </Text>
        
        <div className="space-y-6">
          <Blockquote 
            variant="default" 
            color="default"
            author="John Doe, Farmer"
          >
            UmuhinziLink has transformed how I connect with buyers and manage my farm. 
            The AI-powered advice has increased my crop yields by 30%.
          </Blockquote>
          
          <Blockquote 
            variant="large" 
            color="primary"
            author="Jane Smith, Agricultural Expert"
          >
            This platform represents the future of agricultural technology in Rwanda, 
            bridging the gap between traditional farming and modern digital solutions.
          </Blockquote>
        </div>
      </TypographySection>

      {/* Responsive Design */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Responsive & Accessible
        </Heading>
        <Text variant="body" color="muted">
          All typography scales beautifully across devices and maintains accessibility standards.
        </Text>
        
        <div className="p-6 bg-muted/30 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <Text variant="body">WCAG AA compliant contrast ratios</Text>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <Text variant="body">Responsive font scaling with clamp()</Text>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <Text variant="body">Optimized line heights for readability</Text>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <Text variant="body">Screen reader friendly semantic markup</Text>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <Text variant="body">Print-optimized styles</Text>
          </div>
        </div>
      </TypographySection>

      {/* Usage Examples */}
      <TypographySection spacing="relaxed">
        <Heading variant="h2" color="primary">
          Real-World Usage
        </Heading>
        <Text variant="body" color="muted">
          Examples of how the typography system works in actual components.
        </Text>
        
        {/* Card Example */}
        <div className="p-6 bg-card border rounded-lg shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Heading variant="h4" className="mb-2">
                Fresh Tomatoes Available
              </Heading>
              <Text variant="overline" color="primary">
                Premium Quality
              </Text>
            </div>
            <Text variant="large" color="success" weight="bold">
              $2.50/kg
            </Text>
          </div>
          
          <Text variant="body" className="mb-4">
            High-quality organic tomatoes grown using sustainable farming practices. 
            Perfect for restaurants and local markets.
          </Text>
          
          <List variant="none" spacing="tight" className="mb-4">
            <ListItem icon={<CheckCircle className="w-4 h-4" />}>
              Organic certification
            </ListItem>
            <ListItem icon={<CheckCircle className="w-4 h-4" />}>
              Fresh harvest daily
            </ListItem>
            <ListItem icon={<CheckCircle className="w-4 h-4" />}>
              Bulk orders available
            </ListItem>
          </List>
          
          <div className="flex items-center justify-between">
            <Text variant="caption" color="muted">
              Available until: Dec 31, 2024
            </Text>
            <button className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              <Text variant="label" color="primary">View Details</Text>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </TypographySection>
    </div>
  );
}
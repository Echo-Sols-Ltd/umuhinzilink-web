'use client';

import React from 'react';
import { 
  Heading, 
  Text, 
  Price, 
  Quantity, 
  Measurement, 
  FarmerName, 
  Location, 
  Status,
  TypographySection 
} from './typography';

export function TypographyTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <TypographySection spacing="normal">
          <Heading variant="display" gradient className="text-center mb-4">
            Enhanced Agricultural Typography System
          </Heading>
          <Text variant="lead" align="center" color="muted">
            Optimized for outdoor usage, high contrast, and agricultural workflows
          </Text>
        </TypographySection>

        {/* Responsive Headings */}
        <TypographySection spacing="relaxed">
          <Heading variant="h2" color="primary">Responsive Heading Scale</Heading>
          <div className="space-y-4">
            <Heading variant="display">Display Heading (clamp 2.5rem - 4rem)</Heading>
            <Heading variant="h1">H1 Page Title (clamp 2rem - 3rem)</Heading>
            <Heading variant="h2">H2 Section Heading (clamp 1.5rem - 2.25rem)</Heading>
            <Heading variant="h3">H3 Subsection Heading (clamp 1.25rem - 1.875rem)</Heading>
            <Heading variant="h4">H4 Component Heading (clamp 1.125rem - 1.5rem)</Heading>
            <Heading variant="h5">H5 Card Heading (clamp 1rem - 1.25rem)</Heading>
            <Heading variant="h6">H6 Small Heading (clamp 0.875rem - 1.125rem)</Heading>
          </div>
        </TypographySection>

        {/* Agricultural-Specific Components */}
        <TypographySection spacing="relaxed">
          <Heading variant="h2" color="primary">Agricultural Typography Components</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Display */}
            <div className="space-y-4">
              <Heading variant="h4">Price Display</Heading>
              <div className="space-y-2">
                <div>
                  <Text variant="label">Normal Price:</Text>
                  <Price amount={15000} currency="RWF" />
                </div>
                <div>
                  <Text variant="label">Large Price:</Text>
                  <Price amount={250000} currency="RWF" size="large" />
                </div>
                <div>
                  <Text variant="label">Without Currency:</Text>
                  <Price amount={5000} showCurrency={false} />
                </div>
              </div>
            </div>

            {/* Quantity Display */}
            <div className="space-y-4">
              <Heading variant="h4">Quantity & Measurements</Heading>
              <div className="space-y-2">
                <div>
                  <Text variant="label">Quantity:</Text>
                  <Quantity amount={50} unit="kg" />
                </div>
                <div>
                  <Text variant="label">Large Quantity:</Text>
                  <Quantity amount={2500} unit="bags" />
                </div>
                <div>
                  <Text variant="label">Farm Size:</Text>
                  <Measurement value={2.5} unit="hectares" />
                </div>
                <div>
                  <Text variant="label">Yield:</Text>
                  <Measurement value={1250.75} unit="kg/hectare" precision={1} />
                </div>
              </div>
            </div>

            {/* Farmer Information */}
            <div className="space-y-4">
              <Heading variant="h4">Farmer Information</Heading>
              <div className="space-y-2">
                <div>
                  <Text variant="label">Verified Farmer:</Text>
                  <FarmerName name="Jean Baptiste Uwimana" verified={true} />
                </div>
                <div>
                  <Text variant="label">Unverified Farmer:</Text>
                  <FarmerName name="Marie Claire Mukamana" verified={false} />
                </div>
                <div>
                  <Text variant="label">Location:</Text>
                  <Location location="Musanze District, Northern Province" />
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-4">
              <Heading variant="h4">Status Indicators</Heading>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Status status="available" />
                  <Status status="sold" />
                  <Status status="pending" />
                  <Status status="expired" />
                  <Status status="verified" />
                  <Status status="unverified" />
                </div>
              </div>
            </div>
          </div>
        </TypographySection>

        {/* High Contrast & Outdoor Readability */}
        <TypographySection spacing="relaxed">
          <Heading variant="h2" color="primary">Outdoor Readability Enhancement</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Heading variant="h4">Normal Text</Heading>
              <Text variant="body">
                This is regular body text optimized for agricultural content with enhanced 
                letter spacing and line height for better readability.
              </Text>
            </div>
            
            <div className="space-y-4">
              <Heading variant="h4">High Contrast Text</Heading>
              <Text variant="body" contrast="high">
                This is high contrast text with enhanced font weight and text shadow 
                for better visibility in bright outdoor conditions.
              </Text>
            </div>
            
            <div className="space-y-4">
              <Heading variant="h4">Outdoor Optimized</Heading>
              <Text variant="body" contrast="outdoor">
                This text is specifically optimized for outdoor usage with enhanced 
                shadows and contrast for sunlight readability.
              </Text>
            </div>
            
            <div className="space-y-4">
              <Heading variant="h4">Mobile Outdoor</Heading>
              <Text variant="body" contrast="mobile-outdoor">
                This text is optimized for mobile devices used in outdoor agricultural 
                settings with enhanced sizing and contrast.
              </Text>
            </div>
          </div>
        </TypographySection>

        {/* Gradient Text Examples */}
        <TypographySection spacing="relaxed">
          <Heading variant="h2" color="primary">Agricultural Gradient Text</Heading>
          <div className="space-y-4">
            <Heading variant="h3" color="gradient">Primary Agricultural Gradient</Heading>
            <Heading variant="h3" color="gradient-success">Growth Success Gradient</Heading>
            <Heading variant="h3" color="gradient-harvest">Harvest Gold Gradient</Heading>
            <Heading variant="h3" color="gradient-info">Sky Blue Gradient</Heading>
          </div>
        </TypographySection>

        {/* Responsive Behavior Demo */}
        <TypographySection spacing="relaxed">
          <Heading variant="h2" color="primary">Responsive Typography Behavior</Heading>
          <Text variant="body" color="muted">
            Resize your browser window to see how the typography scales smoothly using clamp functions.
            All text maintains readability across different screen sizes while preserving the agricultural aesthetic.
          </Text>
          
          <div className="mt-8 p-6 bg-[var(--agricultural-green-50)] rounded-lg border border-[var(--agricultural-green-200)]">
            <Heading variant="h3" color="primary" className="mb-4">
              Sample Product Card Typography
            </Heading>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Text variant="body" weight="semibold">Fresh Organic Tomatoes</Text>
                  <FarmerName name="Jean Baptiste Uwimana" verified={true} />
                  <Location location="Musanze District" />
                </div>
                <div className="text-right">
                  <Price amount={2500} currency="RWF" size="large" />
                  <Text variant="caption" color="muted">per kg</Text>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Quantity amount={150} unit="kg available" />
                <Status status="available" />
              </div>
              <Text variant="body-sm" color="muted">
                Freshly harvested organic tomatoes from our certified farm. 
                Perfect for restaurants and local markets.
              </Text>
            </div>
          </div>
        </TypographySection>

      </div>
    </div>
  );
}
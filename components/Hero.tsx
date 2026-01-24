import React from 'react';
import Image from 'next/image';
import { Heading, Text, TypographySection } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="bg-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <TypographySection spacing="normal">
          <Heading variant="h1" className="max-w-2xl">
            Connect Farmers to{' '}
            <span className="typography-gradient-primary">Digital Markets</span>
          </Heading>
          
          <Text variant="lead" color="secondary" className="max-w-lg">
            Empowering smallholder farmers in Rwanda with Technology to access markets, get
            AI-powered farming advice and secure agricultural loans
          </Text>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-4">
            <div className="text-center sm:text-left">
              <Heading variant="h4" color="primary" className="mb-1">
                500+
              </Heading>
              <Text variant="caption" color="muted">
                Registered Farmers
              </Text>
            </div>
            <div className="text-center sm:text-left">
              <Heading variant="h4" color="info" className="mb-1">
                50+
              </Heading>
              <Text variant="caption" color="muted">
                Input Suppliers
              </Text>
            </div>
            <div className="text-center sm:text-left">
              <Heading variant="h4" color="success" className="mb-1">
                1000+
              </Heading>
              <Text variant="caption" color="muted">
                Transactions Completed
              </Text>
            </div>
          </div>
        </TypographySection>

        <div className="flex justify-center">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/hero.png"
              alt="Farmer using digital technology in the field"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

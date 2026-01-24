'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/typography';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="UmuhinziLink Logo" className="h-8 w-8" />
              <Text variant="large" weight="bold" color="primary" as="span">
                UmuhinziLink
              </Text>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="transition-colors hover:text-green-600"
            >
              <Text variant="label" color="default" as="span">
                Home
              </Text>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="transition-colors hover:text-green-600"
            >
              <Text variant="label" color="default" as="span">
                Features
              </Text>
            </button>
            <button
              onClick={() => scrollToSection('agribusiness')}
              className="transition-colors hover:text-green-600"
            >
              <Text variant="label" color="default" as="span">
                Agribusiness
              </Text>
            </button>
            <button
              onClick={() => scrollToSection('lenders')}
              className="transition-colors hover:text-green-600"
            >
              <Text variant="label" color="default" as="span">
                Lenders
              </Text>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="transition-colors hover:text-green-600"
            >
              <Text variant="label" color="default" as="span">
                Contact Us
              </Text>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href="/auth/signin">
              <Button className="hidden md:inline-flex">
                Get Started
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border/40">
              <button
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 transition-colors hover:text-green-600"
              >
                <Text variant="body" color="default" as="span">
                  Home
                </Text>
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block px-3 py-2 transition-colors hover:text-green-600"
              >
                <Text variant="body" color="default" as="span">
                  Features
                </Text>
              </button>
              <button
                onClick={() => scrollToSection('agribusiness')}
                className="block px-3 py-2 transition-colors hover:text-green-600"
              >
                <Text variant="body" color="default" as="span">
                  Agribusiness
                </Text>
              </button>
              <button
                onClick={() => scrollToSection('lenders')}
                className="block px-3 py-2 transition-colors hover:text-green-600"
              >
                <Text variant="body" color="default" as="span">
                  Lenders
                </Text>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 transition-colors hover:text-green-600"
              >
                <Text variant="body" color="default" as="span">
                  Contact Us
                </Text>
              </button>
              <div className="px-3 py-2">
                <Link href="/auth/signin">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

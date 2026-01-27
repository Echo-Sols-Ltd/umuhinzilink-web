import type { Metadata, Viewport } from 'next'; // Add Viewport import
import { Poppins } from 'next/font/google';
import { AppProviders } from '@/contexts/AppProviders';
import ModalToastContainer from '@/components/ui/modal-toast-container';
import { NotificationProvider } from '@/components/ui/enhanced-notification-system';
import { NotificationStackProvider } from '@/components/ui/notification-stack';
import { ErrorHandlerProvider } from '@/components/ui/enhanced-error-handler';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SkipLink } from '@/components/ui/accessibility';
import { OfflineIndicator } from '@/components/ui/progressive-loading';
import { BundleOptimizations } from '@/components/ui/bundle-optimization-script';
import './globals.css';

// Enhanced Poppins font configuration with proper loading strategies
const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'], // Optimized weight selection
  subsets: ['latin', 'latin-ext'], // Extended Latin support for international names
  display: 'swap', // Prevent layout shift during font loading
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true, // Preload for better performance
  adjustFontFallback: true, // Adjust fallback metrics to reduce layout shift
});

export const metadata: Metadata = {
  title: 'UmuhinziLink - Agricultural Platform',
  description: 'Connecting farmers, buyers, and agricultural resources in Rwanda with modern digital solutions.',
  keywords: ['agriculture', 'farming', 'Rwanda', 'marketplace', 'farmers', 'buyers'],
  authors: [{ name: 'UmuhinziLink Team' }],
  themeColor: '#2D5016', // Agricultural primary color
  colorScheme: 'light dark',
  robots: 'index, follow',
  openGraph: {
    title: 'UmuhinziLink - Agricultural Platform',
    description: 'Connecting farmers, buyers, and agricultural resources in Rwanda',
    type: 'website',
    locale: 'en_US',
  },
  // Mobile-first optimization
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2D5016', // Agricultural primary color
  colorScheme: 'light dark',
  // Mobile-first viewport optimizations
  viewportFit: 'cover', // Support for devices with notches
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <head>
        {/* Font preload for better performance */}
        <link
          rel="preload"
          href="/_next/static/media/poppins-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/poppins-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.umuhinzi-backend.echo-solution.com" />
        
        {/* Preconnect for critical external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.umuhinzi-backend.echo-solution.com" />
        
        {/* Mobile-first meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Prevent zoom on input focus (iOS) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media screen and (max-width: 767px) {
              input[type="text"],
              input[type="email"],
              input[type="password"],
              input[type="tel"],
              input[type="number"],
              input[type="search"],
              textarea,
              select {
                font-size: 16px !important;
              }
            }
            
            /* Critical CSS for immediate rendering */
            .critical-css {
              font-family: ${poppins.style.fontFamily};
              color: #1a1a1a;
              background-color: #ffffff;
              line-height: 1.6;
            }
            
            /* Loading state for better perceived performance */
            .initial-loading {
              opacity: 0;
              animation: fadeIn 0.3s ease-in-out forwards;
            }
            
            @keyframes fadeIn {
              to { opacity: 1; }
            }
          `
        }} />
      </head>
      <body className={`bg-white text-black font-primary antialiased touch-optimized initial-loading ${poppins.variable}`}>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <OfflineIndicator />
        <ErrorBoundary>
          <AppProviders>
            <NotificationProvider>
              <NotificationStackProvider maxVisible={5} position="top-right">
                <ErrorHandlerProvider>
                  <main id="main-content" tabIndex={-1} className="min-h-screen">
                    {children}
                  </main>
                  <ModalToastContainer />
                </ErrorHandlerProvider>
              </NotificationStackProvider>
            </NotificationProvider>
          </AppProviders>
        </ErrorBoundary>
        <BundleOptimizations />
      </body>
    </html>
  );
}
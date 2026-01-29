import type { Metadata, Viewport } from 'next'; // Add Viewport import
import { Poppins } from 'next/font/google';
import { AppProviders } from '@/contexts/AppProviders';
import ModalToastContainer from '@/components/ui/modal-toast-container';
import { OfflineIndicator } from '@/components/ui/progressive-loading';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'], // Add subsets
});

export const metadata: Metadata = {
  title: 'UmuhinziLink',
  description: 'UmuhinziLink is a platform for farmers to sell their products to buyers.',
};


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#10b981',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body className="bg-white text-black">
        <OfflineIndicator />
        <AppProviders>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ModalToastContainer />
        </AppProviders>
      </body>
    </html>
  );
}
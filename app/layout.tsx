'use client';
import { Outfit } from 'next/font/google';
import './globals.css';
import React, { useEffect } from 'react';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import ClientProviders from '@/components/ClientProviders';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';
import SimplePreloader from '@/components/preloaders/SimplePreloader';
import { PreloaderProvider } from '@/components/context/PreloaderContext';
import { useBankingData } from '@/components/context/BankingDataProvider';

// Simple component to log fresh install status
function FreshInstallLogger() {
  const { isLoading } = useBankingData();
  
  useEffect(() => {
    if (!isLoading && !localStorage.getItem('appInitialized')) {
      console.log('Fresh installation detected');
    }
  }, [isLoading]);

  return null;
}

// Font setup
const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// Viewport
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#121212',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="196x196" href="/images/icons/favicon-196.png" />
        <link rel="apple-touch-icon" href="/images/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preload" href="/fonts/ocrastd.woff" as="font" type="font/woff" crossOrigin="" />
        <link rel="preload" href="/fonts/ocrastd.otf" as="font" type="font/otf" crossOrigin="" />
      </head>
      <body className="font-sans bg-[#1d1d1d] text-white overflow-x-hidden">
        <RegisterServiceWorker />
        <ClientProviders>
          <FreshInstallLogger />
          <PreloaderProvider>
            <main className="min-h-screen">
              <SimplePreloader>
                {children}
              </SimplePreloader>
            </main>
            <PWAInstallPrompt />
          </PreloaderProvider>
        </ClientProviders>
      </body>
    </html>
  );
}

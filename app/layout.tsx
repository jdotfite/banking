// app/layout.tsx
'use client';

import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import AppContainer from '@/components/layout/AppContainer';
import Script from 'next/script';
import { useEffect } from 'react';
import { setupIOSFullscreen } from '@/lib/utils/iosFullscreen';

// Properly load and configure the Outfit font
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Banking App',
  description: 'A modern banking app UI',
  manifest: '/manifest.json',
  themeColor: '#121212',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Banking App'
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Setup iOS fullscreen handling
  useEffect(() => {
    setupIOSFullscreen();
  }, []);

  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Additional meta tag to help with iOS fullscreen */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${outfit.className} bg-gray-900 min-h-screen font-outfit`}>
        <ThemeProvider>
          <AppContainer>{children}</AppContainer>
        </ThemeProvider>
        
        {/* Register service worker */}
        <Script id="service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
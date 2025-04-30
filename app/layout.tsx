// ✅ This is now a server component – DO NOT add "use client"

import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import IOSFullscreen from '@/components/IOSFullscreen';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import AppContainer from '@/components/layout/AppContainer';
import Script from 'next/script';

// Font config
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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Banking App',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupIOSFullscreen();
  }, []);

  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} bg-gray-900 min-h-screen font-outfit`}>
        <ThemeProvider>
          <AppContainer>{children}</AppContainer>
        </ThemeProvider>
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
        <AppContainer>{children}</AppContainer>
<IOSFullscreen />
      </body>
    </html>
  );
}

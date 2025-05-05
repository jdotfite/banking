// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';
import AppContainer from '@/components/layout/AppContainer';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Banking App',
  description: 'A modern banking app UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#121212" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Banking App" />
      </head>
      <body className={`${outfit.className} bg-gray-900 min-h-screen font-outfit`}>
        <RegisterServiceWorker />
        <AppContainer>
          {children}
        </AppContainer>
      </body>
    </html>
  );
}

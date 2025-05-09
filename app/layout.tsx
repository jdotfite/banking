// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import React from 'react';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import ClientProviders from '@/components/ClientProviders';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';
import SimplePreloader from '@/components/preloaders/SimplePreloader';

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

// Metadata
export const metadata: Metadata = {
  title: 'Banking App',
  description: 'Modern online banking application',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icons/icon-192x192.png',
    apple: '/images/icons/icon-192x192.png'
  },
  openGraph: {
    type: 'website',
    url: 'https://banking.example.com',
    title: 'Banking App',
    description: 'Modern online banking application',
    siteName: 'Banking App',
    images: [{
      url: '/images/marketing/og-image.png',
    }],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <body className="font-sans bg-[#1d1d1d] text-white overflow-x-hidden">
        <RegisterServiceWorker />
        
        <ClientProviders>
          {/* ONLY main element in the entire app */}
          <main className="min-h-screen">
            <SimplePreloader>
              {children}
            </SimplePreloader>
          </main>
          <PWAInstallPrompt />
        </ClientProviders>
      </body>
    </html>
  );
}

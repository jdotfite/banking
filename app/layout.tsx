// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import React from 'react';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';
import ClientProviders from '@/components/ClientProviders';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';

// Font setup
const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

// Metadata
export const metadata: Metadata = {
  title: 'Banking App',
  description: 'Modern online banking application',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1d1d1d',
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
            {children}
          </main>
          <PWAInstallPrompt />
        </ClientProviders>
      </body>
    </html>
  );
}

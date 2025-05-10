// app/layout.tsx
'use client';
import { useRouter } from 'next/navigation';
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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  return (
    <html lang="en" className={`${outfit.variable} dark`}>
      <body className="font-sans bg-[#1d1d1d] text-white overflow-x-hidden">
        <RegisterServiceWorker />
        
        <ClientProviders>
          {/* ONLY main element in the entire app */}
          <main className="min-h-screen">
            {/* DISABLE ALL PRELOADING TEMPORARILY */}
            <div className="w-full h-full">
              {children}
            </div>
          </main>
          <PWAInstallPrompt />
        </ClientProviders>
      </body>
    </html>
  );
}

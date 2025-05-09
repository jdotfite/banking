// components/ClientProviders.tsx
'use client';

import React from 'react';
import { UserProvider } from '@/components/context/UserContext';
import { SimplifiedBankingDataProvider } from '@/components/preloaders/SimplifiedBankingDataProvider';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';
import TestingToolkit from '@/components/ui/common/TestingToolkit';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider>
          <SimplifiedBankingDataProvider>
            {/* Developer Tools */}
            {process.env.NODE_ENV === 'development' && (
              <TestingToolkit />
            )}
            
            {/* Loading Spinner Container */}
            <div className="fixed inset-0 z-[200] pointer-events-none">
              {/* Spinner will be rendered here when needed */}
            </div>
            
            {children}
          </SimplifiedBankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
}
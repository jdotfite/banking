// components/ClientProviders.tsx
'use client';

import React from 'react';
import { UserProvider } from '@/components/context/UserContext';
import { BankingDataProvider } from '@/components/context/BankingDataProvider';
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
          <BankingDataProvider>
            {/* Developer Tools - Available in all environments */}
            <TestingToolkit />
            
            {/* Loading Spinner Container */}
            <div className="fixed inset-0 z-[200] pointer-events-none">
              {/* Spinner will be rendered here when needed */}
            </div>
            
            {children}
          </BankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
}

// components/layout/AppContainer.tsx
'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { UserProvider } from '@/components/context/UserContext';
import { EnhancedBankingDataProvider } from '@/components/preloaders/EnhancedBankingDataProvider';
import { BankingDataProvider } from '@/components/preloaders/BankingDataPreloader';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';
import PWAInstallPrompt from '@/components/ui/common/PWAInstallPrompt';

interface AppContainerProps {
  children: ReactNode;
}

/**
 * AppContainer component
 * Wraps the entire application and provides the bottom navigation
 * This ensures the bottom navigation is only loaded once and is consistent across all pages
 */
const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const showBottomNav = !['/onboarding', '/login', '/signup'].includes(pathname || '');

  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider>
          <BankingDataProvider>
            <EnhancedBankingDataProvider>
              <div className="min-h-screen bg-[#1d1d1d] text-white relative">
                {/* PWA Install Prompt */}
                <PWAInstallPrompt />
                
                {/* Loading Spinner Container - fixed position above everything */}
                <div className="fixed inset-0 z-[200] pointer-events-none">
                  {/* Spinner will be rendered here when needed */}
                </div>
                
                {/* Main content */}
                <div className="mx-auto max-w-md">
                  <main className="relative">
                    {children}
                  </main>
                </div>
                
                {/* Bottom navigation - fixed at the bottom */}
                {showBottomNav && (
                  <div className="fixed bottom-0 left-0 right-0 z-[100]">
                    <BottomNav />
                  </div>
                )}
              </div>
            </EnhancedBankingDataProvider>
          </BankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
};

export default AppContainer;

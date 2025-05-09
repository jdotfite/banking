'use client';

import React from 'react';
import Home from './components/Home';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { UserProvider } from '@/components/context/UserContext';
import { SimplifiedBankingDataProvider } from '@/components/preloaders/SimplifiedBankingDataProvider';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';

export default function HomePage() {
  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider initialAdminMode={false}>
          <SimplifiedBankingDataProvider>
            <div className="relative min-h-screen">
              <Home />
              <BottomNav />
            </div>
          </SimplifiedBankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
}
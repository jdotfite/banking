'use client';

import React from 'react';
import Card from './components/Card';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { UserProvider } from '@/components/context/UserContext';
import { SimplifiedBankingDataProvider } from '@/components/preloaders/SimplifiedBankingDataProvider';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';

export default function CreditCardPage() {
  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider initialAdminMode={false}>
          <SimplifiedBankingDataProvider>
            <div className="relative min-h-screen">
              <Card />
              <BottomNav />
            </div>
          </SimplifiedBankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
}

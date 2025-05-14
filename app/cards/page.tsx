'use client';

import React from 'react';
import Card from './components/Card';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { UserProvider } from '@/components/context/UserContext';
import { BankingDataProvider } from '@/components/context/BankingDataProvider';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';

export default function CreditCardPage() {
  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider initialAdminMode={false}>
          <BankingDataProvider>
            <div className="relative min-h-screen">
              <Card />
              <BottomNav />
            </div>
          </BankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );
}

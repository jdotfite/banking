'use client';

import React from 'react';
import Card from './components/Card';
import BottomNav from '@/components/ui/navigation/BottomNav';
import { UserProvider } from '@/components/context/UserContext';
import { EnhancedBankingDataProvider } from '@/components/preloaders/EnhancedBankingDataProvider';
import { BankingDataProvider } from '@/components/preloaders/BankingDataPreloader';
import ThemeContextProvider from '@/lib/context/ThemeContextProvider';
import IOSFullScreenProvider from '@/lib/utils/IOSFullScreenProvider';

export default function CreditCardPage() {
  return (
    <ThemeContextProvider>
      <IOSFullScreenProvider>
        <UserProvider initialAdminMode={false}>
          <BankingDataProvider>
            <EnhancedBankingDataProvider>
              <div className="relative min-h-screen">
                <Card />
                <BottomNav />
              </div>
            </EnhancedBankingDataProvider>
          </BankingDataProvider>
        </UserProvider>
      </IOSFullScreenProvider>
    </ThemeContextProvider>
  );

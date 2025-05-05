'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';
import { useUser } from '@/components/context/UserContext';
import { TransactionDateGroup } from '@/lib/types';

// Context type
interface EnhancedBankingDataContextType {
  data: BankingData | null;
  userData: {
    user: BankingUser | null;
    accounts: BankAccount[];
    creditCards: CreditCard[];
    loans: Loan[];
    transactions: Record<string, Transaction[]>;
    groupedTransactions: TransactionDateGroup[];
  } | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => void;
}

// Create the context
const EnhancedBankingDataContext = createContext<EnhancedBankingDataContextType | null>(null);

// Props for the provider component
interface EnhancedBankingDataProviderProps {
  children: ReactNode;
}

/**
 * Enhanced Banking Data Provider
 * Provides access to preloaded banking data throughout the app
 * Filters data based on selected user from UserContext
 */
export const EnhancedBankingDataProvider: React.FC<EnhancedBankingDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<BankingData | null>(null);
  const [userData, setUserData] = useState<{
    user: BankingUser | null;
    accounts: BankAccount[];
    creditCards: CreditCard[];
    loans: Loan[];
    transactions: Record<string, Transaction[]>;
    groupedTransactions: TransactionDateGroup[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get user context
  const { selectedUserId, isNewUser } = useUser();

  // Load data on mount and when selectedUserId changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get cached data if available
        const cachedData = localStorage.getItem('members1stBankingData');
        let bankingDataObj;
        
        if (cachedData) {
          bankingDataObj = JSON.parse(cachedData);
        } else {
          // Process and cache the data
          localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
          bankingDataObj = bankingData;
        }
        
        setData(bankingDataObj);
        
        // Filter data for selected user
        if (selectedUserId && selectedUserId !== 'new') {
          const user = bankingDataObj.users.find((u: any) => u.id === selectedUserId);
          const accounts = bankingDataObj.accounts.filter((a: any) => a.userId === selectedUserId);
          const creditCards = bankingDataObj.creditCards.filter((c: any) => c.userId === selectedUserId);
          const loans = bankingDataObj.loans.filter((l: any) => l.userId === selectedUserId);
          const transactions = bankingDataObj.transactions[selectedUserId as keyof typeof bankingDataObj.transactions] || {};
          const groupedTransactions = bankingDataObj.groupedTransactions[selectedUserId as keyof typeof bankingDataObj.groupedTransactions] || [];
          
          setUserData({
            user,
            accounts,
            creditCards,
            loans,
            transactions,
            groupedTransactions
          });
        } else if (isNewUser) {
          // For new user flow, provide empty data structure
          setUserData({
            user: null,
            accounts: [],
            creditCards: [],
            loans: [],
            transactions: {},
            groupedTransactions: []
          });
        } else {
          // No user selected, provide full data
          setUserData({
            user: null,
            accounts: bankingDataObj.accounts,
            creditCards: bankingDataObj.creditCards,
            loans: bankingDataObj.loans,
            transactions: bankingDataObj.transactions,
            groupedTransactions: []
          });
        }
      } catch (err) {
        console.error('Error loading banking data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading banking data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedUserId, isNewUser]);

  // Context value
  const value = {
    data,
    userData,
    isLoading,
    error,
    refreshData: () => {
      setIsLoading(true);
      localStorage.removeItem('members1stBankingData');
      localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
      setData(bankingData);
      
      // Re-filter data for selected user
      if (selectedUserId && selectedUserId !== 'new') {
        const user = bankingData.users.find((u: any) => u.id === selectedUserId);
        const accounts = bankingData.accounts.filter((a: any) => a.userId === selectedUserId);
        const creditCards = bankingData.creditCards.filter((c: any) => c.userId === selectedUserId);
        const loans = bankingData.loans.filter((l: any) => l.userId === selectedUserId);
        const transactions = bankingData.transactions[selectedUserId as keyof typeof bankingData.transactions] || {};
        const groupedTransactions = bankingData.groupedTransactions[selectedUserId as keyof typeof bankingData.groupedTransactions] || [];
        
        setUserData({
          user,
          accounts,
          creditCards,
          loans,
          transactions,
          groupedTransactions
        });
      } else {
        setUserData({
          user: null,
          accounts: bankingData.accounts,
          creditCards: bankingData.creditCards,
          loans: bankingData.loans,
          transactions: bankingData.transactions,
          groupedTransactions: []
        });
      }
      
      setIsLoading(false);
    }
  };

  return (
    <EnhancedBankingDataContext.Provider value={value}>
      {children}
    </EnhancedBankingDataContext.Provider>
  );
};

// Custom hook to access banking data
export const useEnhancedBankingData = () => {
  const context = useContext(EnhancedBankingDataContext);
  if (!context) {
    throw new Error('useEnhancedBankingData must be used within an EnhancedBankingDataProvider');
  }
  return context;
};

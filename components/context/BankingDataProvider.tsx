'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import generateFakeUsers from '@/lib/data/fakeBankingData';
import { useUser } from '@/components/context/UserContext';
import {
  BankingData,
  BankingUser,
  BankingAccount,
  BankingCreditCard,
  BankingLoan,
  BankingTransaction,
  TransactionDateGroup,
  FilteredUserData
} from '@/lib/types/bankingDataTypes';

type BankingDataContextType = {
  data: BankingData | null;
  userData: FilteredUserData | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  clearCache: () => void;
  preProcessData: (data: BankingData) => BankingData;
};

const BankingDataContext = createContext<BankingDataContextType | null>(null);

interface BankingDataProviderProps {
  children: ReactNode;
  cacheKey?: string;
  simulateApiDelay?: number;
  preProcess?: boolean;
}

export const BankingDataProvider: React.FC<BankingDataProviderProps> = ({
  children,
  cacheKey = 'bankingData',
  simulateApiDelay = 0,
  preProcess = false
}) => {
  const [data, setData] = useState<BankingData | null>(null);
  const [userData, setUserData] = useState<FilteredUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { selectedUserId, isNewUser } = useUser();
  const router = useRouter();

  const preProcessData = useCallback((rawData: BankingData): BankingData => {
    if (!preProcess) return rawData;
    
    const processedData = JSON.parse(JSON.stringify(rawData));
    
    // Calculate category totals
    processedData.users.forEach((user: BankingUser) => {
      const userTransactions: BankingTransaction[] = [];
      
      Object.values(processedData.transactions[user.id] || {}).forEach(accountTxs => {
        userTransactions.push(...(accountTxs as BankingTransaction[]));
      });
      
      const categoryTotals = userTransactions.reduce((totals: Record<string, number>, tx) => {
        if (!tx.isIncoming) {
          const category = tx.category || 'other';
          totals[category] = (totals[category] || 0) + tx.amount;
        }
        return totals;
      }, {});
      
      processedData.categoryTotals = processedData.categoryTotals || {};
      processedData.categoryTotals[user.id] = categoryTotals;
    });
    
    return processedData;
  }, [preProcess]);

  const filterUserData = useCallback((bankingData: BankingData) => {
    if (selectedUserId && selectedUserId !== 'new') {
      const user = bankingData.users.find(u => u.id === selectedUserId) || null;
      const accounts = bankingData.accounts.filter(a => a.userId === selectedUserId);
      const creditCards = bankingData.creditCards.filter(c => c.userId === selectedUserId);
      const loans = bankingData.loans.filter(l => l.userId === selectedUserId);
      const transactions = bankingData.transactions[selectedUserId] || {};
      const groupedTransactions = bankingData.groupedTransactions[selectedUserId] || [];
      const categoryTotals = bankingData.categoryTotals?.[selectedUserId];
      
      setUserData({
        user,
        accounts,
        creditCards,
        loans,
        transactions,
        groupedTransactions,
        categoryTotals
      });
    } else if (isNewUser) {
      setUserData({
        user: null,
        accounts: [],
        creditCards: [],
        loans: [],
        transactions: {},
        groupedTransactions: []
      });
    } else {
      setUserData({
        user: null,
        accounts: bankingData.accounts,
        creditCards: bankingData.creditCards,
        loans: bankingData.loans,
        transactions: {},
        groupedTransactions: []
      });
    }
  }, [selectedUserId, isNewUser]);

  const loadData = useCallback(async (forceDefault = false) => {
    try {
      setIsLoading(true);
      let bankingDataObj: BankingData;

      // Check for fresh install first
      const freshInstall = !localStorage.getItem('appInitialized');
      if (freshInstall) {
        console.log('Fresh installation detected - initializing with default data');
        localStorage.clear();
        localStorage.setItem('appInitialized', 'true');
        router.push('/onboarding');
        const generatedData = generateFakeUsers();
        console.log('Generated fresh banking data');
        bankingDataObj = preProcessData(structuredClone(generatedData));
      } else if (forceDefault) {
        const generatedData = generateFakeUsers();
        console.log('Generated fresh banking data (force default)');
        bankingDataObj = preProcessData(structuredClone(generatedData));
      } else {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          console.log('Loading cached banking data');
          bankingDataObj = preProcessData(JSON.parse(cachedData));
        } else {
          const generatedData = generateFakeUsers();
          console.log('Generated fresh banking data (no cache)');
          bankingDataObj = preProcessData(structuredClone(generatedData));
        }
      }

      setData(bankingDataObj);
      filterUserData(bankingDataObj);

      if (simulateApiDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simulateApiDelay));
      }

      if (!forceDefault) {
        localStorage.setItem(cacheKey, JSON.stringify(bankingDataObj));
      }
    } catch (err) {
      console.error('Error loading banking data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      const fallbackData = preProcessData(generateFakeUsers());
      setData(fallbackData);
      filterUserData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, filterUserData, preProcessData, simulateApiDelay]);

  const refreshData = useCallback(async () => {
    localStorage.removeItem(cacheKey);
    await loadData(true);
  }, [cacheKey, loadData]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
  }, [cacheKey]);

  useEffect(() => {
    // Only run once on mount
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    data,
    userData,
    isLoading,
    error,
    refreshData,
    clearCache,
    preProcessData
  };

  return (
    <BankingDataContext.Provider value={value}>
      {children}
    </BankingDataContext.Provider>
  );
};

export const useBankingData = () => {
  const context = useContext(BankingDataContext);
  if (!context) {
    throw new Error('useBankingData must be used within a BankingDataProvider');
  }
  return context;
};

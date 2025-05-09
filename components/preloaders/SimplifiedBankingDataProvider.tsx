'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';
import { useUser } from '@/components/context/UserContext';
import { 
  TransactionDateGroup,
  BankingDataType as BankingData,
  BankingUser,
  BankingAccount as BankAccount,
  BankingCreditCard as CreditCard,
  BankingLoan as Loan,
  BankingTransaction as Transaction
} from '@/lib/types';

interface BankingDataContextType {
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
  refreshData: () => Promise<void>;
}

// Single banking data context
const BankingDataContext = createContext<BankingDataContextType | null>(null);

interface BankingDataProviderProps {
  children: ReactNode;
}

/**
 * SimplifiedBankingDataProvider - Provides banking data to the application
 */
export const SimplifiedBankingDataProvider: React.FC<BankingDataProviderProps> = ({ 
  children 
}) => {
  const [data, setData] = useState<BankingData | null>(null);
  const [userData, setUserData] = useState<{
    user: BankingUser | null;
    accounts: BankAccount[];
    creditCards: CreditCard[];
    loans: Loan[];
    transactions: Record<string, Transaction[]>;
    groupedTransactions: TransactionDateGroup[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  const { selectedUserId, isNewUser } = useUser() as {
    selectedUserId: string | null;
    isNewUser: boolean;
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // First try to get data from localStorage
      const cachedData = localStorage.getItem('bankingData');
      let bankingDataObj: BankingData;
      
      if (cachedData) {
        bankingDataObj = JSON.parse(cachedData) as BankingData;
      } else {
        // Process data
        bankingDataObj = {...bankingData as unknown as BankingData};
        
        // Store in localStorage for future use
        try {
          localStorage.setItem('bankingData', JSON.stringify(bankingDataObj));
        } catch (err) {
          console.warn('Failed to cache banking data:', err);
        }
      }
      
      setData(bankingDataObj);
      filterUserData(bankingDataObj);
    } catch (err: unknown) {
      console.error('Error loading banking data:', err);
      const error = err instanceof Error ? err : new Error('Unknown error loading banking data');
      setError(error);
      
      // Fallback to basic data if processing failed
      const fallbackData = bankingData as unknown as BankingData;
      setData(fallbackData);
      filterUserData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUserData = (bankingDataObj: BankingData) => {
    if (selectedUserId && selectedUserId !== 'new') {
      const user = bankingDataObj.users.find((u) => u.id === selectedUserId) || null;
      const accounts = bankingDataObj.accounts.filter((a) => a.userId === selectedUserId);
      const creditCards = bankingDataObj.creditCards.filter((c) => c.userId === selectedUserId);
      const loans = bankingDataObj.loans.filter((l) => l.userId === selectedUserId);
      const userTransactions = bankingDataObj.transactions[selectedUserId] || {};
      const transactions: Record<string, Transaction[]> = {};
      
      Object.entries(userTransactions).forEach(([accountId, accountTransactions]) => {
        transactions[accountId] = accountTransactions as Transaction[];
      });

      const groupedTransactions = bankingDataObj.groupedTransactions?.[selectedUserId] || [];
      
      setUserData({
        user,
        accounts,
        creditCards,
        loans,
        transactions,
        groupedTransactions: groupedTransactions as TransactionDateGroup[]
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
        accounts: bankingDataObj.accounts || [],
        creditCards: bankingDataObj.creditCards || [],
        loans: bankingDataObj.loans || [],
        transactions: {},
        groupedTransactions: []
      });
    }
  };

  const refreshData = async () => {
    try {
      localStorage.removeItem('bankingData');
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    if (!hasMounted) return;
    loadData();
  }, [selectedUserId, isNewUser, hasMounted]);

  // Provide a value that matches both the original providers
  const value = {
    data,
    userData,
    isLoading,
    error,
    refreshData
  };

  return (
    <BankingDataContext.Provider value={value}>
      {children}
    </BankingDataContext.Provider>
  );
};

// Single clean hook export
export const useBankingData = () => {
  const context = useContext(BankingDataContext);
  if (!context) {
    throw new Error('useBankingData must be used within a SimplifiedBankingDataProvider');
  }
  return context;
};
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';
import { useUser } from '@/components/context/UserContext';
// Import types but create a modified version for our actual data structure
import { BankingDataType as OriginalBankingDataType, BankingUser, BankingAccount, BankingCreditCard, BankingLoan, BankingTransaction, TransactionDateGroup } from '@/lib/types';

// Modified BankingDataType to match the actual structure in fakeBankingData.js
type ActualBankingDataType = {
  users: BankingUser[];
  accounts: BankingAccount[];
  creditCards: BankingCreditCard[];
  loans: BankingLoan[];
  transactions: {
    [userId: string]: {
      [accountId: string]: any[]; // Using any[] instead of BankingTransaction[] for flexibility
    };
  };
  groupedTransactions: {
    [userId: string]: TransactionDateGroup[];
  };
  categoryTotals?: {
    [userId: string]: Record<string, number>;
  };
};

// Define the context types
type UnifiedBankingDataContextType = {
  // Raw data
  data: ActualBankingDataType | null;
  
  // Filtered data for the selected user
  userData: {
    user: BankingUser | undefined;
    accounts: BankingAccount[];
    creditCards: BankingCreditCard[];
    loans: BankingLoan[];
    transactions: any;
    groupedTransactions: TransactionDateGroup[];
  } | null;
  
  // Loading and error states
  isLoading: boolean;
  error: Error | null;
  
  // Functions
  refreshData: () => void;
  clearCache: () => void;
};

// Create the context
const UnifiedBankingDataContext = createContext<UnifiedBankingDataContextType | null>(null);

// Props for the provider component
interface UnifiedBankingDataProviderProps {
  children: ReactNode;
  cacheKey?: string;
  simulateApiDelay?: number;
  preProcessData?: boolean;
}

/**
 * Unified Banking Data Provider
 * 
 * Combines functionality from BankingDataProvider and EnhancedBankingDataProvider
 * - Provides access to preloaded banking data throughout the app
 * - Filters data based on selected user from UserContext
 * - Handles caching, loading states, and error handling
 */
export const UnifiedBankingDataProvider: React.FC<UnifiedBankingDataProviderProps> = ({ 
  children,
  cacheKey = 'members1stBankingData',
  simulateApiDelay = 0,
  preProcessData = false
}) => {
  // State for raw data
  const [data, setData] = useState<ActualBankingDataType | null>(null);
  
  // State for user-filtered data
  const [userData, setUserData] = useState<any>(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get user context
  const { selectedUserId, isNewUser } = useUser();

  // Process data for the selected user
  const processUserData = (bankingDataObj: ActualBankingDataType) => {
    if (selectedUserId && selectedUserId !== 'new') {
      const user = bankingDataObj.users.find((u: BankingUser) => u.id === selectedUserId);
      const accounts = bankingDataObj.accounts.filter((a: BankingAccount) => a.userId === selectedUserId);
      const creditCards = bankingDataObj.creditCards.filter((c: BankingCreditCard) => c.userId === selectedUserId);
      const loans = bankingDataObj.loans.filter((l: BankingLoan) => l.userId === selectedUserId);
      const transactions = bankingDataObj.transactions[selectedUserId] || {};
      const groupedTransactions = bankingDataObj.groupedTransactions[selectedUserId] || [];
      
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
  };

  // Pre-process data if needed
  const preProcess = (rawData: any): ActualBankingDataType => {
    if (!preProcessData) return rawData as ActualBankingDataType;
    
    // Create a deep copy to avoid mutations
    const processedData = JSON.parse(JSON.stringify(rawData)) as any;
    
    // Example: Add transaction totals by category
    processedData.users.forEach((user: BankingUser) => {
      const userTransactions: any[] = [];
      
      // Collect all user transactions
      Object.values(processedData.transactions[user.id] || {}).forEach(accountTxs => {
        userTransactions.push(...(accountTxs as any[]));
      });
      
      // Calculate category totals
      const categoryTotals = userTransactions.reduce((totals: Record<string, number>, tx: any) => {
        if (!tx.isIncoming) {
          const category = tx.category || 'other';
          totals[category] = (totals[category] || 0) + tx.amount;
        }
        return totals;
      }, {});
      
      // Add to user data
      (processedData as any).categoryTotals = (processedData as any).categoryTotals || {};
      (processedData as any).categoryTotals[user.id] = categoryTotals;
    });
    
    return processedData;
  };

  // Load data on mount and when selectedUserId changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay if needed
        if (simulateApiDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, simulateApiDelay));
        }
        
        // Get cached data if available
        const cachedData = localStorage.getItem(cacheKey);
        let bankingDataObj: ActualBankingDataType;
        
        if (cachedData) {
          bankingDataObj = JSON.parse(cachedData);
        } else {
          // Process and cache the data
          bankingDataObj = preProcess(bankingData as any);
          localStorage.setItem(cacheKey, JSON.stringify(bankingDataObj));
        }
        
        setData(bankingDataObj);
        
        // Process data for the selected user
        processUserData(bankingDataObj);
      } catch (err) {
        console.error('Error loading banking data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading banking data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedUserId, isNewUser, cacheKey, simulateApiDelay, preProcessData]);

  // Refresh data function
  const refreshData = () => {
    setIsLoading(true);
    
    try {
      // Process and cache the data
      const processedData = preProcess(bankingData as any);
      localStorage.setItem(cacheKey, JSON.stringify(processedData));
      setData(processedData);
      
      // Process data for the selected user
      processUserData(processedData);
    } catch (err) {
      console.error('Error refreshing banking data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error refreshing banking data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cache function
  const clearCache = () => {
    localStorage.removeItem(cacheKey);
  };

  // Context value
  const value: UnifiedBankingDataContextType = {
    data,
    userData,
    isLoading,
    error,
    refreshData,
    clearCache
  };

  return (
    <UnifiedBankingDataContext.Provider value={value}>
      {children}
    </UnifiedBankingDataContext.Provider>
  );
};

// Custom hook to access banking data
export const useBankingData = () => {
  const context = useContext(UnifiedBankingDataContext);
  if (!context) {
    throw new Error('useBankingData must be used within a UnifiedBankingDataProvider');
  }
  return context;
};

'use client';

/**
 * NOTE: This hook requires the SWR package to be installed.
 * Before using this hook, install SWR with:
 * 
 * npm install swr
 * 
 * or
 * 
 * yarn add swr
 */

import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { useUser } from '@/components/context/UserContext';
import { BankingUser, BankingAccount, BankingCreditCard, BankingLoan, TransactionDateGroup } from '@/lib/types';

// Define the shape of the user-specific banking data
interface UserBankingData {
  user: BankingUser | undefined;
  accounts: BankingAccount[];
  creditCards: BankingCreditCard[];
  loans: BankingLoan[];
  transactions: any;
  groupedTransactions: TransactionDateGroup[];
  categoryTotals?: Record<string, number>;
}

// Define the options for the hook
interface UseBankingDataOptions extends SWRConfiguration {
  shouldFetch?: boolean;
  mockDelay?: number;
}

/**
 * Custom hook for fetching banking data with SWR
 * 
 * This hook provides optimized data fetching with caching, revalidation,
 * error handling, and loading states.
 */
export const useBankingData = (options: UseBankingDataOptions = {}) => {
  const { shouldFetch = true, mockDelay = 0, ...swrOptions } = options;
  
  // Get user context
  const { selectedUserId, isNewUser } = useUser();
  
  // Define the API endpoint based on the selected user
  const apiEndpoint = selectedUserId 
    ? `/api/banking-data/${selectedUserId}` 
    : '/api/banking-data';
  
  // Mock fetcher function (in a real app, this would be a real API call)
  const fetcher = async (url: string) => {
    // Simulate API delay if needed
    if (mockDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockDelay));
    }
    
    // In a real app, this would be a fetch call to the API
    // For now, we'll simulate it by getting data from localStorage
    const cachedData = localStorage.getItem('members1stBankingData');
    
    if (!cachedData) {
      throw new Error('No banking data found');
    }
    
    const bankingData = JSON.parse(cachedData);
    
    // If a specific user is selected, filter the data
    if (selectedUserId && selectedUserId !== 'new') {
      const user = bankingData.users.find((u: any) => u.id === selectedUserId);
      const accounts = bankingData.accounts.filter((a: any) => a.userId === selectedUserId);
      const creditCards = bankingData.creditCards.filter((c: any) => c.userId === selectedUserId);
      const loans = bankingData.loans.filter((l: any) => l.userId === selectedUserId);
      const transactions = bankingData.transactions[selectedUserId] || {};
      const groupedTransactions = bankingData.groupedTransactions[selectedUserId] || [];
      const categoryTotals = bankingData.categoryTotals?.[selectedUserId] || {};
      
      return {
        user,
        accounts,
        creditCards,
        loans,
        transactions,
        groupedTransactions,
        categoryTotals
      };
    }
    
    // If no user is selected, return all data
    return bankingData;
  };
  
  // Use SWR for data fetching
  const { 
    data, 
    error, 
    isLoading, 
    isValidating, 
    mutate 
  } = useSWR<any>(
    shouldFetch ? apiEndpoint : null, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      ...swrOptions
    }
  );
  
  // Process data for new user
  const [userData, setUserData] = useState<UserBankingData | null>(null);
  
  useEffect(() => {
    if (isNewUser) {
      // For new user flow, provide empty data structure
      setUserData({
        user: undefined,
        accounts: [],
        creditCards: [],
        loans: [],
        transactions: {},
        groupedTransactions: []
      });
    } else if (data) {
      // If we have data from SWR, use it
      if (selectedUserId) {
        // If a user is selected, the data is already filtered
        setUserData(data as UserBankingData);
      } else {
        // If no user is selected, provide full data
        setUserData({
          user: undefined,
          accounts: data.accounts || [],
          creditCards: data.creditCards || [],
          loans: data.loans || [],
          transactions: data.transactions || {},
          groupedTransactions: []
        });
      }
    } else {
      // If no data yet, set to null
      setUserData(null);
    }
  }, [data, selectedUserId, isNewUser]);
  
  // Function to refresh data
  const refreshData = async () => {
    try {
      await mutate();
    } catch (err) {
      console.error('Error refreshing banking data:', err);
    }
  };
  
  // Function to clear cache
  const clearCache = () => {
    localStorage.removeItem('members1stBankingData');
    mutate();
  };
  
  return {
    // Raw data from SWR
    data,
    
    // Processed user data
    userData,
    
    // Loading and error states
    isLoading,
    isValidating,
    error,
    
    // Functions
    refreshData,
    clearCache,
    mutate
  };
};

export default useBankingData;

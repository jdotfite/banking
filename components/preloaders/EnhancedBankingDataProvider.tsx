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

const EnhancedBankingDataContext = createContext<EnhancedBankingDataContextType | null>(null);

interface EnhancedBankingDataProviderProps {
  children: ReactNode;
}

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
  const [hasMounted, setHasMounted] = useState(false);
  
  const { selectedUserId, isNewUser } = useUser() as {
    selectedUserId: string | null;
    isNewUser: boolean;
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const cachedData = localStorage.getItem('members1stBankingData');
        let bankingDataObj: BankingData;
        
        if (cachedData) {
          bankingDataObj = JSON.parse(cachedData) as BankingData;
        } else {
          localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
          bankingDataObj = bankingData as unknown as BankingData;
        }
        
        setData(bankingDataObj);
        
        if (selectedUserId && selectedUserId !== 'new') {
          const user = bankingDataObj.users.find((u) => u.id === selectedUserId) || null;
          const accounts = bankingDataObj.accounts.filter((a) => a.userId === selectedUserId);
          const creditCards = bankingDataObj.creditCards.filter((c) => c.userId === selectedUserId);
          const loans = bankingDataObj.loans.filter((l) => l.userId === selectedUserId);
          const userTransactions = bankingDataObj.transactions[selectedUserId] || {};
          const transactions: Record<string, Transaction[]> = {};
          
          // Convert account transactions to proper type
          Object.entries(userTransactions).forEach(([accountId, accountTransactions]) => {
            transactions[accountId] = accountTransactions as Transaction[];
          });

          const groupedTransactions = bankingDataObj.groupedTransactions[selectedUserId] || [];
          
          setUserData({
            user: user || null,
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
            accounts: bankingDataObj.accounts,
            creditCards: bankingDataObj.creditCards,
            loans: bankingDataObj.loans,
            transactions: {},
            groupedTransactions: []
          });
        }
      } catch (err: unknown) {
        console.error('Error loading banking data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading banking data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedUserId, isNewUser, hasMounted]);

  const value = {
    data,
    userData,
    isLoading,
    error,
    refreshData: () => {
      setIsLoading(true);
      localStorage.removeItem('members1stBankingData');
      localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
      setData(bankingData as any);
      
      if (selectedUserId && selectedUserId !== 'new') {
        const user = bankingData.users.find((u) => u.id === selectedUserId) || null;
        const accounts = bankingData.accounts.filter((a: any) => a.userId === selectedUserId);
        const creditCards = bankingData.creditCards.filter((c: any) => c.userId === selectedUserId);
        const loans = bankingData.loans.filter((l: any) => l.userId === selectedUserId);
        const userTransactions = bankingData.transactions[selectedUserId as keyof typeof bankingData.transactions] || {};
        const transactions: Record<string, Transaction[]> = {};
        
        Object.entries(userTransactions).forEach(([accountId, accountTransactions]) => {
          transactions[accountId] = accountTransactions as Transaction[];
        });

        const groupedTransactions = bankingData.groupedTransactions[selectedUserId as keyof typeof bankingData.groupedTransactions] || [];
        
        setUserData({
          user,
          accounts,
          creditCards,
          loans,
          transactions,
          groupedTransactions: groupedTransactions as TransactionDateGroup[]
        });
      } else {
        setUserData({
          user: null,
          accounts: bankingData.accounts,
          creditCards: bankingData.creditCards,
          loans: bankingData.loans,
          transactions: {},
          groupedTransactions: []
        } as any);
      }
      
      setIsLoading(false);
    }
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <EnhancedBankingDataContext.Provider value={value}>
      {children}
    </EnhancedBankingDataContext.Provider>
  );
};

export const useEnhancedBankingData = () => {
  const context = useContext(EnhancedBankingDataContext);
  if (!context) {
    throw new Error('useEnhancedBankingData must be used within an EnhancedBankingDataProvider');
  }
  return context;
};

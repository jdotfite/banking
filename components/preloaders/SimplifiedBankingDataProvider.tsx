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

const BankingDataContext = createContext<BankingDataContextType | null>(null);

interface BankingDataProviderProps {
  children: ReactNode;
}

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
  
  const { selectedUserId, isNewUser } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const loadData = async (forceDefault = false) => {
    try {
      setIsLoading(true);
      let bankingDataObj: BankingData;

      if (forceDefault || isNewUser) {
        // Force load default data including user3 for new signups
        console.log('Loading default banking data (forceDefault or new user)');
        bankingDataObj = {...bankingData as unknown as BankingData};
      } else {
        // Check for guest data (only for non-new users)
        const guestData = localStorage.getItem('guestBankingData');
        if (guestData) {
          const guest = JSON.parse(guestData);
          bankingDataObj = {
            users: [{
              ...guest.user,
              id: 'guest-user',
              username: guest.user.username || 'guest',
              avatar: guest.user.avatar || '',
              phone: guest.user.phone || '',
              address: guest.user.address || '',
              ssn: guest.user.ssn || '',
              dob: guest.user.dob || guest.user.dateOfBirth || '',
              occupation: guest.user.occupation || '',
              income: guest.user.income || 0,
              joinDate: guest.user.joinDate || new Date().toISOString(),
              lastLogin: guest.user.lastLogin || new Date().toISOString()
            }],
            accounts: guest.accounts.map((a: any) => ({
              ...a,
              userId: 'guest-user',
              accountNumber: a.id,
              routingNumber: '000000000'
            })),
            creditCards: [],
            loans: [],
            transactions: {
              'guest-user': guest.accounts.reduce((acc: any, account: any) => {
                acc[account.id] = [];
                return acc;
              }, {})
            },
            groupedTransactions: {}
          };
        } else {
          // Check for cached data
          const cachedData = localStorage.getItem('bankingData');
          if (cachedData) {
            bankingDataObj = JSON.parse(cachedData) as BankingData;
          } else {
            // Load default data
            bankingDataObj = {...bankingData as unknown as BankingData};
            try {
              localStorage.setItem('bankingData', JSON.stringify(bankingDataObj));
            } catch (err) {
              console.warn('Failed to cache banking data:', err);
            }
          }
        }
      }

      setData(bankingDataObj);
      filterUserData(bankingDataObj);
    } catch (err: unknown) {
      console.error('Error loading banking data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
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
      await loadData(true); // Force load default data
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    if (!hasMounted) return;
    const shouldRefresh = localStorage.getItem('shouldRefreshBankingData') === 'true';
    if (shouldRefresh) {
      localStorage.removeItem('shouldRefreshBankingData');
    }
    console.log('Loading banking data for user:', selectedUserId, 'isNewUser:', isNewUser);
    loadData();
  }, [selectedUserId, isNewUser, hasMounted]);

  return (
    <BankingDataContext.Provider value={{
      data,
      userData,
      isLoading,
      error,
      refreshData
    }}>
      {children}
    </BankingDataContext.Provider>
  );
};

export const useBankingData = () => {
  const context = useContext(BankingDataContext);
  if (!context) {
    throw new Error('useBankingData must be used within a SimplifiedBankingDataProvider');
  }
  return context;
};

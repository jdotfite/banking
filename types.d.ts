import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface BankingUser {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    ssn: string;
    dob: string;
    occupation: string;
    income: number;
    joinDate: string;
    lastLogin: string;
    memberSince?: string;
  }

  interface BankAccount {
    id: string;
    userId: string;
    accountNumber: string;
    type: 'checking' | 'savings' | 'money-market';
    balance: number;
    availableBalance: number;
    nickname?: string;
  }

  interface CreditCard {
    id: string;
    userId: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    creditLimit: number;
    availableCredit: number;
    currentBalance: number;
    rewardsBalance: number;
    nickname?: string;
    minimumPayment: number;
    dueDate: string;
    color: string;
  }

  interface Loan {
    id: string;
    userId: string;
    loanNumber: string;
    type: 'mortgage' | 'auto' | 'personal';
    originalAmount: number;
    currentBalance: number;
    paymentDueDate: string;
    minimumPayment: number;
  }

  interface Transaction {
    id: string;
    accountId: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    pending: boolean;
  }

  interface GroupedTransaction {
    date: string;
    transactions: Transaction[];
    total: number;
  }

  interface BankingData {
    users: BankingUser[];
    accounts: BankAccount[];
    creditCards: CreditCard[];
    loans: Loan[];
    transactions: Record<string, Transaction[]>;
    groupedTransactions: Record<string, GroupedTransaction[]>;
  }

  interface EnhancedBankingDataContextType {
    data: BankingData | null;
    userData: {
      user: BankingUser | null;
      accounts: BankAccount[];
      creditCards: CreditCard[];
      loans: Loan[];
      transactions: Record<string, Transaction[]>;
      groupedTransactions: GroupedTransaction[];
    };
    isLoading: boolean;
    error: Error | null;
    refreshData: () => void;
  }
}

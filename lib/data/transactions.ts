// lib/data/transactions.ts
import { TransactionType, TransactionDateGroup } from '../types';

export const transactions: TransactionDateGroup[] = [
  {
    date: 'TODAY',
    transactions: [
      {
        id: '1',
        merchant: 'Zara',
        location: 'Harrisburg Mall',
        amount: 432.29,
        isIncoming: false,
        timestamp: '1:22PM',
        icon: 'shopping',
      },
      {
        id: '2',
        merchant: 'Mark Coleman',
        message: 'Thanks for the dinner!',
        amount: 128.00,
        isIncoming: true,
        timestamp: '12:32PM',
        icon: 'transfer',
      },
      {
        id: '3',
        merchant: 'Starbucks',
        location: 'Business Bay',
        amount: 18.50,
        isIncoming: false,
        timestamp: '10:15AM',
        icon: 'shopping',
      },
    ],
  },
  {
    date: 'YESTERDAY',
    transactions: [
      {
        id: '4',
        merchant: 'Netflix',
        message: 'Subscription',
        amount: 18.00,
        isIncoming: false,
        timestamp: '12:45PM',
        icon: 'subscription',
      },
      {
        id: '5',
        merchant: 'Damien Light',
        message: 'You won!',
        amount: 20.00,
        isIncoming: true,
        timestamp: '10:22AM',
        icon: 'entertainment',
      },
      {
        id: '6',
              merchant: 'Uber',
      location: 'Downtown Harrisburg',
      amount: 35.50,
      isIncoming: false,
      timestamp: '9:10AM',
      icon: 'car',
      },
    ],
  },
  {
    date: 'APR 23, 2025',
    transactions: [
      {
        id: '7',
        merchant: 'Spotify',
        message: 'Premium Subscription',
        amount: 9.99,
        isIncoming: false,
        timestamp: '3:20PM',
        icon: 'subscription',
      },
      {
        id: '8',
        merchant: 'Amazon',
        message: 'Online order',
        amount: 125.45,
        isIncoming: false,
        timestamp: '11:30AM',
        icon: 'shopping',
      },
      {
        id: '9',
        merchant: 'Payroll',
        message: 'Monthly salary',
        amount: 5280.00,
        isIncoming: true,
        timestamp: '9:00AM',
        icon: 'transfer',
      },
    ],
  },
];

export const getTransactions = (): TransactionDateGroup[] => {
  return transactions;
};


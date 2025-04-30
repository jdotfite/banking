// lib/data/transactions.ts
import { TransactionType, TransactionDateGroup } from '../types';

// Helper to generate transaction IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Today's date for reference
const currentDate = new Date();

// Helper to create a date string from days ago
const daysAgo = (days: number) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() - days);
  
  // For today and yesterday
  if (days === 0) return 'TODAY';
  if (days === 1) return 'YESTERDAY';
  
  // For other days - format as "MMM DD, YYYY"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();
};

// DAILY TRANSACTIONS - For "Day" filter view
export const dailyTransactions: TransactionDateGroup[] = [
  {
    date: 'TODAY',
    transactions: [
      {
        id: generateId(),
        merchant: 'Zara',
        location: 'Harrisburg Mall',
        amount: 432.29,
        isIncoming: false,
        timestamp: '1:22PM',
        icon: 'shopping',
        category: 'clothes',
      },
      {
        id: generateId(),
        merchant: 'Mark Coleman',
        message: 'Thanks for the dinner!',
        amount: 128.00,
        isIncoming: true,
        timestamp: '12:32PM',
        icon: 'transfer',
      },
      {
        id: generateId(),
        merchant: 'Starbucks',
        location: 'Business Bay',
        amount: 18.50,
        isIncoming: false,
        timestamp: '10:15AM',
        icon: 'coffee',
        category: 'dining',
      },
    ],
  }
];

// WEEKLY TRANSACTIONS - For "Week" filter view
export const weeklyTransactions: TransactionDateGroup[] = [
  {
    date: 'TODAY',
    transactions: [
      {
        id: generateId(),
        merchant: 'Zara',
        location: 'Harrisburg Mall',
        amount: 432.29,
        isIncoming: false,
        timestamp: '1:22PM',
        icon: 'shopping',
        category: 'clothes',
      },
      {
        id: generateId(),
        merchant: 'Mark Coleman',
        message: 'Thanks for the dinner!',
        amount: 128.00,
        isIncoming: true,
        timestamp: '12:32PM',
        icon: 'transfer',
      }
    ],
  },
  {
    date: 'YESTERDAY',
    transactions: [
      {
        id: generateId(),
        merchant: 'Netflix',
        message: 'Subscription',
        amount: 18.00,
        isIncoming: false,
        timestamp: '12:45PM',
        icon: 'subscription',
        category: 'entertainment',
      },
      {
        id: generateId(),
        merchant: 'Damien Light',
        message: 'You won!',
        amount: 20.00,
        isIncoming: true,
        timestamp: '10:22AM',
        icon: 'entertainment',
      }
    ],
  },
  {
    date: daysAgo(2),
    transactions: [
      {
        id: generateId(),
        merchant: 'Uber',
        location: 'Downtown Harrisburg',
        amount: 35.50,
        isIncoming: false,
        timestamp: '9:10AM',
        icon: 'car',
        category: 'transport',
      },
      {
        id: generateId(),
        merchant: 'Starbucks',
        location: 'Business Bay',
        amount: 12.75,
        isIncoming: false,
        timestamp: '8:30AM',
        icon: 'coffee',
        category: 'dining',
      }
    ],
  },
  {
    date: daysAgo(5),
    transactions: [
      {
        id: generateId(),
        merchant: 'Amazon',
        message: 'Prime Monthly',
        amount: 14.99,
        isIncoming: false,
        timestamp: '3:14PM',
        icon: 'subscription',
        category: 'subscription',
      },
      {
        id: generateId(),
        merchant: 'Chipotle',
        location: 'Market Street',
        amount: 22.45,
        isIncoming: false,
        timestamp: '1:20PM',
        icon: 'food',
        category: 'dining',
      }
    ],
  }
];

// MONTHLY TRANSACTIONS - For "Month" filter view
export const monthlyTransactions: TransactionDateGroup[] = [
  {
    date: 'TODAY',
    transactions: [
      {
        id: generateId(),
        merchant: 'Zara',
        location: 'Harrisburg Mall',
        amount: 432.29,
        isIncoming: false,
        timestamp: '1:22PM',
        icon: 'shopping',
        category: 'clothes',
      },
      {
        id: generateId(),
        merchant: 'Mark Coleman',
        message: 'Thanks for the dinner!',
        amount: 128.00,
        isIncoming: true,
        timestamp: '12:32PM',
        icon: 'transfer',
      },
      {
        id: generateId(),
        merchant: 'Starbucks',
        location: 'Business Bay',
        amount: 18.50,
        isIncoming: false,
        timestamp: '10:15AM',
        icon: 'coffee',
        category: 'dining',
      },
    ],
  },
  {
    date: 'YESTERDAY',
    transactions: [
      {
        id: generateId(),
        merchant: 'Netflix',
        message: 'Subscription',
        amount: 18.00,
        isIncoming: false,
        timestamp: '12:45PM',
        icon: 'subscription',
        category: 'entertainment',
      },
      {
        id: generateId(),
        merchant: 'Damien Light',
        message: 'You won!',
        amount: 20.00,
        isIncoming: true,
        timestamp: '10:22AM',
        icon: 'entertainment',
      },
      {
        id: generateId(),
        merchant: 'Uber',
        location: 'Downtown Harrisburg',
        amount: 35.50,
        isIncoming: false,
        timestamp: '9:10AM',
        icon: 'car',
        category: 'transport',
      },
    ],
  },
  {
    date: 'APR 23, 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Spotify',
        message: 'Premium Subscription',
        amount: 9.99,
        isIncoming: false,
        timestamp: '3:20PM',
        icon: 'subscription',
        category: 'entertainment',
      },
      {
        id: generateId(),
        merchant: 'Amazon',
        message: 'Online order',
        amount: 125.45,
        isIncoming: false,
        timestamp: '11:30AM',
        icon: 'shopping',
        category: 'shopping',
      },
      {
        id: generateId(),
        merchant: 'Payroll',
        message: 'Monthly salary',
        amount: 5280.00,
        isIncoming: true,
        timestamp: '9:00AM',
        icon: 'transfer',
        category: 'income',
      },
    ],
  },
  {
    date: 'APR 15, 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Target',
        location: 'Downtown',
        amount: 87.32,
        isIncoming: false,
        timestamp: '4:10PM',
        icon: 'shopping',
        category: 'shopping',
      },
      {
        id: generateId(),
        merchant: 'Home Depot',
        location: 'West Side',
        amount: 321.56,
        isIncoming: false,
        timestamp: '11:05AM',
        icon: 'shopping',
        category: 'home',
      }
    ],
  },
  {
    date: 'APR 8, 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Health Insurance',
        message: 'Monthly premium',
        amount: 320.00,
        isIncoming: false,
        timestamp: '9:00AM',
        icon: 'health',
        category: 'health',
      },
      {
        id: generateId(),
        merchant: 'Electricity Bill',
        message: 'Monthly utility',
        amount: 142.78,
        isIncoming: false,
        timestamp: '8:45AM',
        icon: 'utilities',
        category: 'utilities',
      }
    ],
  }
];

// YEARLY TRANSACTIONS - For "Year" filter view (summarized by month)
export const yearlyTransactions: TransactionDateGroup[] = [
  {
    date: 'APRIL 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '47 transactions',
        amount: 7856.32,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  },
  {
    date: 'MARCH 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '52 transactions',
        amount: 8123.45,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  },
  {
    date: 'FEBRUARY 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '39 transactions',
        amount: 6387.21,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  },
  {
    date: 'JANUARY 2025',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '43 transactions',
        amount: 7123.90,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  },
  {
    date: 'DECEMBER 2024',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '58 transactions',
        amount: 9842.76,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  },
  {
    date: 'NOVEMBER 2024',
    transactions: [
      {
        id: generateId(),
        merchant: 'Monthly Summary',
        message: '45 transactions',
        amount: 7432.18,
        isIncoming: false,
        timestamp: '',
        icon: 'insights',
        category: 'summary',
      }
    ],
  }
];

// Default transactions (monthly view)
export const transactions = monthlyTransactions;

// Function to get transactions based on period
export const getTransactionsByPeriod = (period: string): TransactionDateGroup[] => {
  switch (period) {
    case 'day':
      return dailyTransactions;
    case 'week':
      return weeklyTransactions;
    case 'year':
      return yearlyTransactions;
    case 'month':
    default:
      return monthlyTransactions;
  }
};

// Default getter function - returns monthly data
export const getTransactions = (): TransactionDateGroup[] => {
  return monthlyTransactions;
};
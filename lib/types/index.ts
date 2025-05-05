// lib/types/index.ts
export type CardType = {
  id: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
  number: string;
  expiry: string;
  cvv: string;
  color: string;
};

export type TransactionType = {
  id: string;
  merchant: string;
  location?: string;
  amount: number;
  isIncoming: boolean;
  timestamp: string;
  message?: string;
  icon: string;
  category?: string;
};

export type TransactionDateGroup = {
  date: 'TODAY' | 'YESTERDAY' | string;
  transactions: TransactionType[];
};

export type NavItemType = {
  name: string;
  icon: string;
  href: string;
};

// Add banking data types
export type BankingUser = {
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
  memberSince?: string; // Make optional to match fake data
};

export type BankingAccount = {
  id: string;
  userId: string;
  type: string; // Allow any string value
  name: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  availableBalance?: number;
  pendingTransactions?: number;
  interestRate: number;
  openDate: string;
  maturityDate?: string;
};

export type BankingCreditCard = {
  id: string;
  userId: string;
  type: string;
  name: string;
  cardNumber: string;
  expiry: string; // Alias for expirationDate
  cvv: string;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  dueDate: string;
  minimumPayment: number;
  rewardsBalance: number;
  rewardsType: string;
  rewardsRate: string;
  applyDate: string;
  color: string;
  expirationDate?: string; // Make optional
};

export type BankingLoan = {
  id: string;
  userId: string;
  type: string;
  name: string;
  loanNumber: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  originationDate: string;
  term: number;
  nextPaymentDate: string;
  paymentsMade: number;
  paymentsRemaining: number;
  availableCredit?: number;
  propertyAddress?: string;
  vehicle?: string;
  vin?: string;
  paymentDueDate?: string; // Make optional
  minimumPayment?: number; // Make optional
};

export type BankingTransaction = {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  merchant: string;
  category: string;
  icon: string;
  amount: number;
  isIncoming: boolean;
  status: string;
  location?: string;
  message?: string;
  timestamp: string;
};

export type BankingDataType = {
  users: BankingUser[];
  accounts: BankingAccount[];
  creditCards: BankingCreditCard[];
  loans: BankingLoan[];
  transactions: {
    [userId: string]: {
      [accountId: string]: BankingTransaction[];
    };
  };
  groupedTransactions: {
    [userId: string]: TransactionDateGroup[];
  };
};

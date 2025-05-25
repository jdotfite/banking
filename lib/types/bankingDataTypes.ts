// Unified banking data types
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
};

export type BankingAccount = {
  id: string;
  userId: string;
  type: 'checking' | 'savings' | 'moneyMarket' | 'cd';
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
  expiry: string;
  cvv: string;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  dueDate: string;
  minimumPayment: number;
  rewardsBalance?: number;
  rewardsType?: string;
  rewardsRate?: string;
  applyDate: string;
  color: string;
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
  propertyAddress?: string;
  vehicle?: string;
  vin?: string;
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

export type TransactionDateGroup = {
  date: string;
  transactions: BankingTransaction[];
};

export type BankingData = {
  users: BankingUser[];
  accounts: BankingAccount[];
  creditCards: BankingCreditCard[];
  loans: BankingLoan[];
  transactions: Record<string, Record<string, BankingTransaction[]>>;
  groupedTransactions: Record<string, TransactionDateGroup[]>;
  categoryTotals?: Record<string, Record<string, number>>;
  creditCardTransactions?: Record<string, BankingTransaction[]>;
};

export type FilteredUserData = {
  user: BankingUser | null;
  accounts: BankingAccount[];
  creditCards: BankingCreditCard[];
  loans: BankingLoan[];
  transactions: Record<string, BankingTransaction[]>;
  groupedTransactions: TransactionDateGroup[];
  categoryTotals?: Record<string, number>;
};

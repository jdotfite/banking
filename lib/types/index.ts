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
  icon: 'shopping' | 'transfer' | 'subscription' | 'entertainment';
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

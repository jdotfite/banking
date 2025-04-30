// components/ui/transactions/TransactionItem.tsx
import React from 'react';
import Icon from '../icons/Icon';
import { TransactionType } from '@/lib/types';

interface TransactionItemProps {
  transaction: TransactionType;
  isLastInGroup?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isLastInGroup = false }) => {
  // Use a consistent gray color for all icon backgrounds to match the inspiration
  const iconBgColor = 'bg-neutral-700'; // Closer to #3b3b3b // Subtle gray that matches the inspiration

  return (
    <div className={`flex items-center justify-between py-3 hover:bg-neutral-700/30 px-4 rounded-lg transition-colors ${!isLastInGroup ? 'border-b border-gray-700/30' : ''}`}>
      <div className="flex items-center">
        <div className={`${iconBgColor} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
          <Icon name={transaction.icon} className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-medium tracking-tight text-white">{transaction.merchant}</div>
          <div className="text-gray-400 text-sm">
            {transaction.location || transaction.message}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium tracking-tight ${transaction.isIncoming ? 'text-green-500' : 'text-white'}`}>
          {transaction.isIncoming ? '+' : ''}${transaction.amount.toFixed(2)}
        </div>
        <div className="text-gray-400 text-sm">{transaction.timestamp}</div>
      </div>
    </div>
  );
};

export default TransactionItem;

  
import React from 'react';
import TransactionItem from './TransactionItem';
import { TransactionDateGroup } from '@/lib/types';

interface TransactionListProps {
  transactionGroups: TransactionDateGroup[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactionGroups }) => {
  return (
    <div className="px-4 pt-2 pb-32">
      {transactionGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="text-gray-500 text-xs py-3">{group.date}</div>
          <div>
            {group.transactions.map((transaction, transactionIndex) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                isLastInGroup={transactionIndex === group.transactions.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;

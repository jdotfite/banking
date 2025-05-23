// components/ui/transactions/TransactionList.tsx
import { useState, useEffect } from 'react';
import * as React from 'react';
import { animated, useTransition } from 'react-spring';
import TransactionItem from './TransactionItem';
import type { TransactionItemProps } from './TransactionItem';
import { TransactionDateGroup, TransactionType } from '@/lib/types';
import { getTransactionsByPeriod } from '@/lib/data/transactions';
import { useBankingData } from '@/components/context/BankingDataProvider';

interface TransactionListProps {
  transactionGroups: TransactionDateGroup[];
  selectedPeriod: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactionGroups: initialGroups,
  selectedPeriod
}) => {
  const [transactionGroups, setTransactionGroups] = useState<TransactionDateGroup[]>(initialGroups);
  const { data } = useBankingData();

  // Update transactions when period changes
  useEffect(() => {
    // If banking data is available, try to use it first
    if (data && (data as any).groupedTransactions && (data as any).groupedTransactions.user1) {
      // Convert fake data to match TransactionDateGroup type
      const convertedGroups = (data as any).groupedTransactions.user1.map((group: any) => {
        return {
          date: group.date,
          transactions: group.transactions.map((tx: any) => ({
            id: tx.id,
            merchant: tx.merchant,
            location: tx.location,
            amount: tx.amount,
            isIncoming: tx.isIncoming,
            timestamp: tx.timestamp,
            message: tx.message,
            icon: tx.icon,
            category: tx.category
          }))
        } as TransactionDateGroup;
      });
      setTransactionGroups(convertedGroups);
    } else {
      // Fall back to predefined transactions
      const updatedTransactions = getTransactionsByPeriod(selectedPeriod);
      setTransactionGroups(updatedTransactions);
    }
  }, [selectedPeriod, data]);

  // React Spring transitions for period changes
  const transitions = useTransition(
    // Use the selected period as the item we're transitioning
    { period: selectedPeriod, groups: transactionGroups },
    {
      from: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
      enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
      leave: { opacity: 0, transform: 'translate3d(0,-20px,0)' },
      // Using a unique key based on the period to prevent old content from mixing with new
      keys: item => item.period,
      config: { mass: 1, tension: 280, friction: 25 }
    }
  );

  // Transitions for individual groups
  const groupTransitions = useTransition(
    transactionGroups,
    {
      from: { opacity: 0, transform: 'translate3d(0,20px,0)' },
      enter: { opacity: 1, transform: 'translate3d(0,0px,0)' },
      leave: { opacity: 0, transform: 'translate3d(0,20px,0)' },
      trail: 100, // Stagger the animations
      keys: group => group.date,
      config: { mass: 1, tension: 280, friction: 25 }
    }
  );

  return (
    <div className="pb-32">
      {/* Use the main transition for the entire list */}
      {transitions((style, item) => (
        <animated.div style={style}>
          {/* Then animate each group separately */}
          {groupTransitions((groupStyle, group) => (
            <animated.div 
              style={groupStyle}
              className="mb-4"
            >
              <div className="sticky top-0 bg-[#1a1a1a] px-6 py-2 text-neutral-400 text-xs uppercase font-semibold z-10 ">
                {group.date}
              </div>
              <div>
                {group.transactions.map((transaction: TransactionType, transactionIndex: number) => (
                  <div key={transaction.id}>
                    <TransactionItem 
                      transaction={transaction} 
                      isLastInGroup={transactionIndex === group.transactions.length - 1}
                    />
                  </div>
                ))}
              </div>
            </animated.div>
          ))}
        </animated.div>
      ))}
    </div>
  );
};

export default TransactionList;

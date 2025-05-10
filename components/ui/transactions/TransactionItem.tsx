// components/ui/transactions/TransactionItem.tsx
import React from 'react';
import { animated, useSpring } from 'react-spring';
import { getTransactionIcon } from '@/lib/config/iconMappings';
import { TransactionType } from '@/lib/types';

export interface TransactionItemProps {
  transaction: TransactionType;
  isLastInGroup?: boolean;
  index?: number;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  isLastInGroup = false,
  index = 0
}) => {
  // Use a consistent gray color for all icon backgrounds to match the inspiration
  const iconBgColor = 'bg-neutral-700'; // Closer to #3b3b3b // Subtle gray that matches the inspiration
  
  // Create a spring animation with a staggered delay based on index
  const springs = useSpring({
    from: { opacity: 0, x: -5 },
    to: { opacity: 1, x: 0 },
    delay: index * 50, // Stagger the animations
    config: { mass: 1, tension: 280, friction: 25 }
  });

  // Use smart icon selection - prioritizing brand icons first, then falling back to category icons
  const IconComponent = getTransactionIcon(
    transaction.merchant,   // Try to find a brand icon for this merchant first
    transaction.icon,       // Fall back to category icon if specified
    transaction.category    // Use category field as last resort before default
  );

  return (
    <animated.div 
      style={springs}
      className={`flex items-center justify-between py-3 hover:bg-neutral-700/30 px-4 rounded-lg transition-colors ${!isLastInGroup ? 'border-b border-neutral-700/30' : ''}`}
    >
      <div className="flex items-center">
        <div className={`${iconBgColor} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-medium tracking-tight text-white">{transaction.merchant}</div>
          <div className="text-neutral-400 text-sm">
            {transaction.location || transaction.message}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium tracking-tight ${transaction.isIncoming ? 'text-green-500' : 'text-white'}`}>
          {transaction.isIncoming ? '+' : ''}${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </div>
        <div className="text-neutral-400 text-sm">{transaction.timestamp}</div>
      </div>
    </animated.div>
  );
};

export default TransactionItem;

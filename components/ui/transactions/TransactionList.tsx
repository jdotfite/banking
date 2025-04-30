// components/ui/transactions/TransactionList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionItem from './TransactionItem';
import { TransactionDateGroup } from '@/lib/types';
import { getTransactionsByPeriod } from '@/lib/data/transactions';

interface TransactionListProps {
  transactionGroups: TransactionDateGroup[];
  selectedPeriod: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactionGroups: initialGroups,
  selectedPeriod
}) => {
  const [transactionGroups, setTransactionGroups] = useState<TransactionDateGroup[]>(initialGroups);

  // Update transactions when period changes
  useEffect(() => {
    const updatedTransactions = getTransactionsByPeriod(selectedPeriod);
    setTransactionGroups(updatedTransactions);
  }, [selectedPeriod]);

  // Define smoother animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    }
  };

  const groupVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="pb-32">
      {/* Use a key based on the period to force a clean transition */}
      <AnimatePresence mode="sync">
        <motion.div
          key={selectedPeriod}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {transactionGroups.map((group, groupIndex) => (
            <motion.div 
              key={group.date}
              variants={groupVariants}
              className="mb-4"
            >
              <div className="sticky top-0 bg-[#1a1a1a] px-6 py-3 text-gray-400 text-xs uppercase font-semibold z-10 border-t border-gray-800">
                {group.date}
              </div>
              <div>
                {group.transactions.map((transaction, transactionIndex) => (
                  <motion.div
                    key={transaction.id}
                    variants={itemVariants}
                  >
                    <TransactionItem 
                      transaction={transaction} 
                      isLastInGroup={transactionIndex === group.transactions.length - 1}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
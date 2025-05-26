'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CreditCardStack from '@/components/ui/CreditCardStack';
import PageTemplate from '@/components/layout/PageTemplate';
import Icon from '@/components/ui/icons/Icon';
import { useBankingData } from '@/components/context/BankingDataProvider';
import TransactionContainer from '@/components/ui/transactions/TransactionContainer';
import { TransactionDateGroup, TransactionType } from '@/lib/types';
import { BankingCreditCard, BankingTransaction } from '@/lib/types/bankingDataTypes';
import { ChevronRight } from 'lucide-react';

// Quick Actions Component  
const QuickActions = () => {  const actions = [
    { type: 'repeat', label: 'Pay', icon: 'repeat' },
    { type: 'lock', label: 'Lock', icon: 'lock' },
    { type: 'lost', label: 'Lost', icon: 'alert' },
    { type: 'statements', label: 'Statements', icon: 'fileText' },
    { type: 'more', label: 'More', icon: 'more' }
  ];

  return (
    <div className="px-4 py-6">
      <div className="flex justify-around">
        {actions.map((action) => (
          <button
            key={action.type}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#212121]">
              <Icon name={action.icon} className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Credit Limit Display Component
const CreditLimitDisplay = ({ selectedCard }: { selectedCard: BankingCreditCard | null }) => {
  if (!selectedCard) return null;

  const usagePercentage = (selectedCard.currentBalance / selectedCard.creditLimit) * 100;

  return (    <div className="px-4 py-4">
      <div className="bg-[#212121] rounded-xl p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-400">Current Balance</span>
            <span className="text-white font-bold text-lg">
              ${selectedCard.currentBalance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Available Credit</span>
            <span className="text-green-400 font-medium">
              ${selectedCard.availableCredit.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Due Date</span>
            <span className="text-white font-medium">
              {new Date(selectedCard.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Minimum Payment</span>
            <span className="text-white font-medium">
              ${selectedCard.minimumPayment.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-neutral-700 pt-2">
            <span className="text-neutral-400">Credit Limit</span>
            <span className="text-white font-medium">
              ${selectedCard.creditLimit.toLocaleString()}
            </span>
          </div>
            {/* Usage Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400">Usage</span>
              <span className="text-neutral-400">{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  usagePercentage > 80 ? 'bg-red-500' : 
                  usagePercentage > 60 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          {selectedCard.rewardsType !== 'none' && selectedCard.rewardsBalance > 0 && (
            <div className="flex justify-between text-sm border-t border-neutral-700 pt-2">
              <span className="text-neutral-400">Rewards Balance</span>
              <span className="text-yellow-400 font-medium">
                {selectedCard.rewardsType === 'cashback' ? '$' : ''}
                {selectedCard.rewardsBalance.toLocaleString()}
                {selectedCard.rewardsType === 'points' ? ' pts' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Recent Transactions Preview Component
const TransactionsPreview = ({ 
  selectedCardId, 
  onShowAllTransactions 
}: { 
  selectedCardId: string | null;
  onShowAllTransactions: () => void;
}) => {
  const { userData } = useBankingData();

  if (!selectedCardId || !userData) {
    return (
      <div className="px-4 py-4">
        <div className="bg-[#212121] rounded-xl p-6 text-center">
          <p className="text-neutral-400">Select a card to view transactions</p>
        </div>
      </div>
    );
  }
  
  // Get transactions for the selected card
  const creditCardTransactions = userData?.transactions?.[selectedCardId] || [];
  const recentTransactions = creditCardTransactions.slice(0, 3);
  
  if (recentTransactions.length === 0) {
    return (
      <div className="px-4 py-4">
        <div className="bg-[#212121] rounded-xl p-6 text-center">
          <p className="text-neutral-400">No recent transactions</p>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'dining': return 'food';
      case 'shopping': return 'shopping';
      case 'gas': return 'gas';
      case 'groceries': return 'groceries';
      case 'entertainment': return 'entertainment';
      case 'subscription': return 'subscription';
      case 'electronics': return 'phone';
      case 'payment': return 'credit-card';
      case 'books': return 'book';
      case 'home': return 'home';
      default: return 'credit-card';
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-white">Recent Transactions</h2>
        <button 
          className="text-sm text-neutral-400 flex items-center"
          onClick={onShowAllTransactions}
        >
          See all <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
        {/* Preview of recent transactions */}
      <div className="space-y-2">
        {recentTransactions.map((transaction: BankingTransaction) => (
          <div 
            key={transaction.id}
            className="bg-[#212121] rounded-lg p-3 flex items-center justify-between"
            onClick={onShowAllTransactions}
          >
            <div className="flex items-center">
              <div className="bg-neutral-700 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Icon name={getTransactionIcon(transaction.category)} className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium tracking-tight text-white">{transaction.merchant}</div>
                <div className="text-neutral-400 text-xs">
                  {transaction.location || transaction.message || transaction.timestamp}
                </div>
              </div>
            </div>            <div className="text-right">
              <div className={`font-medium tracking-tight ${transaction.isIncoming ? 'text-green-500' : 'text-white'}`}>
                {transaction.isIncoming ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CardsPage() {
  const searchParams = useSearchParams();
  const selectedCardId = searchParams?.get('selected');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [overrideCardIndex, setOverrideCardIndex] = useState<number | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true);
  const transactionsContainerRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  
  const { userData, data } = useBankingData();

  // Get the selected card data
  const creditCards = userData?.creditCards || [];
  
  // Determine which card to show:
  // 1. If user navigated via card stack, use overrideCardIndex
  // 2. If URL has selectedCardId, find that card's index
  // 3. Otherwise use currentCardIndex
  let effectiveCardIndex = currentCardIndex;
  
  if (overrideCardIndex !== null) {
    effectiveCardIndex = overrideCardIndex;
  } else if (selectedCardId) {
    const foundIndex = creditCards.findIndex(card => card.id === selectedCardId);
    if (foundIndex !== -1) {
      effectiveCardIndex = foundIndex;
    }
  }
  
  const selectedCard = creditCards[effectiveCardIndex];

  // Handle card selection from the stack
  const handleCardChange = (index: number, cardId?: string) => {
    setCurrentCardIndex(index);
    setOverrideCardIndex(index);
    console.log('Card changed:', { index, cardId, selectedCardId: creditCards[index]?.id });
  };

  // Calculate button positions for transaction container
  useEffect(() => {
    if (transactionsContainerRef.current) {
      const calculatePositions = () => {
        const rect = transactionsContainerRef.current?.getBoundingClientRect();
        if (rect && rect.bottom > 0) {
          setButtonBottomPosition(rect.bottom);
        }
      };
      
      calculatePositions();
      const animationDelay = setTimeout(calculatePositions, 350);
      window.addEventListener('resize', calculatePositions);
      
      return () => {
        clearTimeout(animationDelay);
        window.removeEventListener('resize', calculatePositions);
      };
    }
  }, [selectedCard]);

  // Handle transactions click
  const handleTransactionsClick = () => {
    setShowTransactions(true);
    setIsTransactionCollapsed(false);
  };

  // Handle collapse change from TransactionContainer
  const handleCollapseChange = (collapsed: boolean) => {
    setIsTransactionCollapsed(collapsed);
    if (collapsed) {
      setShowTransactions(false);
    }
  };

  // Transform credit card transactions into TransactionDateGroup format
  const getTransactionGroups = (): TransactionDateGroup[] => {
    if (!selectedCard?.id || !userData?.transactions?.[selectedCard.id]) {
      return [];
    }

    const transactions = userData.transactions[selectedCard.id];
    
    // Group transactions by date
    const grouped: { [key: string]: TransactionType[] } = {};
      transactions.forEach((transaction: BankingTransaction) => {
      // Convert transaction to proper format
      const formattedTransaction: TransactionType = {
        id: transaction.id,
        merchant: transaction.merchant,
        location: transaction.location,
        amount: transaction.amount,
        isIncoming: transaction.isIncoming || false,
        timestamp: transaction.timestamp,
        message: transaction.message,
        icon: getTransactionIcon(transaction.category),
        category: transaction.category
      };

      // Simple date grouping (you can enhance this)
      const date = 'TODAY'; // Simplified for now
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(formattedTransaction);
    });

    return Object.entries(grouped).map(([date, transactions]) => ({
      date: date as 'TODAY' | 'YESTERDAY' | string,
      transactions
    }));
  };

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'dining': return 'food';
      case 'shopping': return 'shopping';
      case 'gas': return 'gas';
      case 'groceries': return 'groceries';
      case 'entertainment': return 'entertainment';
      case 'subscription': return 'subscription';
      case 'electronics': return 'phone';
      case 'payment': return 'credit-card';
      case 'books': return 'book';
      case 'home': return 'home';
      default: return 'credit-card';
    }
  };

  const transactionGroups = getTransactionGroups();

  console.log('CardsPage Debug:', {
    currentCardIndex,
    overrideCardIndex,
    effectiveCardIndex,
    selectedCardIdFromURL: selectedCardId,
    selectedCardId: selectedCard?.id,
    creditCardsCount: creditCards.length,
    selectedCard: selectedCard ? {
      id: selectedCard.id,
      name: selectedCard.name
    } : null,
    transactionGroupsCount: transactionGroups.length
  });

  return (
    <PageTemplate>
      <div className="space-y-0">
        {/* Credit Card Stack */}
        <CreditCardStack onCardChange={handleCardChange} />
        
        {/* Quick Actions */}
        <QuickActions />
        
        {/* Credit Limit Display */}
        <CreditLimitDisplay selectedCard={selectedCard} />
        
        {/* Recent Transactions Preview */}
        <div ref={transactionsContainerRef}>
          <TransactionsPreview 
            selectedCardId={selectedCard?.id || null}
            onShowAllTransactions={handleTransactionsClick}
          />
        </div>

        {/* Transaction Container (same as Home page) */}
        {showTransactions && buttonBottomPosition > 0 && (
          <TransactionContainer 
            transactionGroups={transactionGroups}
            buttonBottomPosition={buttonBottomPosition}
            isCollapsed={isTransactionCollapsed}
            onCollapseChange={handleCollapseChange}
          />
        )}
      </div>
    </PageTemplate>
  );
}

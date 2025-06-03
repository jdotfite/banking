'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { animated, useSpring } from 'react-spring';
import CreditCardStack from '@/components/ui/CreditCardStack';
import PageTemplate from '@/components/layout/PageTemplate';
import Icon from '@/components/ui/icons/Icon';
import { useBankingData } from '@/components/context/BankingDataProvider';
import TransactionContainer from '@/components/ui/transactions/TransactionContainer';
import { TransactionDateGroup, TransactionType } from '@/lib/types';
import { BankingCreditCard, BankingTransaction } from '@/lib/types/bankingDataTypes';
import { ChevronRight } from 'lucide-react';
import { CustomBottomSheet } from '@/components/ui/BottomSheet';
import { PaymentOptionsMenu, PaymentOption } from '@/components/ui/menus/PaymentOptionsMenu';

// Quick Actions Component  
const QuickActions = ({ onMoreClick }: { onMoreClick: () => void }) => {
  const actions = [
    { type: 'repeat', label: 'Pay', icon: 'repeat' },
    { type: 'lock', label: 'Lock', icon: 'lock' },
    { type: 'lost', label: 'Lost', icon: 'alert' },
    { type: 'statements', label: 'Statements', icon: 'fileText' },
    { type: 'more', label: 'More', icon: 'more' }
  ];

  const handleActionClick = (actionType: string) => {
    if (actionType === 'more') {
      onMoreClick();
    } else {
      console.log(`${actionType} action clicked`);
      // Handle other actions here
    }
  };
  return (
    <div className="px-4 py-6">
      <div className="flex justify-around">
        {actions.map((action) => (
          <button
            key={action.type}
            className="flex flex-col items-center space-y-2"
            onClick={() => handleActionClick(action.type)}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#212121]">
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
  const [isExpanded, setIsExpanded] = useState(false);
  // Spring animation for the collapsible details section
  const detailsSpring = useSpring({
    height: isExpanded ? 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
    config: { tension: 280, friction: 25 }
  });

  // Spring animation for the chevron rotation
  const chevronSpring = useSpring({
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    config: { tension: 280, friction: 25 }
  });
  
  if (!selectedCard) return null;

  const usagePercentage = (selectedCard.currentBalance / selectedCard.creditLimit) * 100;

  return (
    <div className="px-4 py-4">      <div className="bg-[#212121] rounded-xl p-4">
        <div>
          {/* Always visible Current Balance */}
          <div className="flex justify-between items-center">
            <span className="text-neutral-200">Current Balance</span>
            <span className="text-white font-bold text-lg">
              ${selectedCard.currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
          </div>
          
          {/* Simple Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-3 text-neutral-400 border-t border-neutral-700 mt-3 pt-3"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </span>
            <animated.div style={chevronSpring}>
              <ChevronRight className="w-4 h-4" />
            </animated.div>
          </button>          {/* Collapsible details with React Spring animation */}
          {isExpanded && (
            <animated.div 
              style={{
                opacity: detailsSpring.opacity,
              }}
              className="space-y-4"
            >
              {/* Credit Information Group */}
              <div className="space-y-3 border-t border-neutral-700 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Available Credit</span>
                  <span className="text-neutral-300 font-medium">
                    ${selectedCard.availableCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Credit Limit</span>
                  <span className="text-neutral-300 font-medium">
                    ${selectedCard.creditLimit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                
                {/* Usage Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Credit Usage</span>
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
              </div>
              
              {/* Payment Information Group */}
              <div className="space-y-3 border-t border-neutral-700 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Due Date</span>
                  <span className="text-neutral-300 font-medium">
                    {new Date(selectedCard.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Minimum Payment</span>
                  <span className="text-neutral-300 font-medium">
                    ${selectedCard.minimumPayment.toFixed(2)}
                  </span>
                </div>
              </div>
            </animated.div>
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
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
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

  // Handle more button click to open payment options
  const handleMoreClick = () => {
    setShowPaymentOptions(true);
  };
  // Handle payment option selection
  const handlePaymentOptionClick = (option: PaymentOption) => {
    console.log(`Payment option selected: ${option.title}`);
    // Add navigation logic here based on the option
    switch (option.id) {
      case 'manage-pin':
        // Navigate to PIN management page
        console.log('Navigate to PIN management');
        break;
      case 'alerts-notifications':
        // Navigate to alerts and notifications settings
        console.log('Navigate to alerts and notifications');
        break;
      case 'merchant-settings':
        // Navigate to merchant settings
        console.log('Navigate to merchant settings');
        break;
      case 'transaction-settings':
        // Navigate to transaction settings
        console.log('Navigate to transaction settings');
        break;
      case 'card-support':
        // Navigate to card support
        console.log('Navigate to card support');
        break;
      default:
        break;
    }
    setShowPaymentOptions(false);
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
        <QuickActions onMoreClick={handleMoreClick} />
        
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
        )}        {/* Payment Options Bottom Sheet */}        <CustomBottomSheet
          open={showPaymentOptions}
          onDismiss={() => setShowPaymentOptions(false)}
          theme="dark"
          maxHeight={700}  // Slightly reduced to ensure it fits on more screens
          snapPoints={['content', 500]} // Adjusted snap points
          initialSnap={0}
          enableDynamicSizing={true}
          onSnap={(index) => console.log('Snapped to index:', index)}
          className="payment-options-sheet"
        >
          <PaymentOptionsMenu 
            onItemClick={handlePaymentOptionClick}
            onClose={() => setShowPaymentOptions(false)}
          />
        </CustomBottomSheet>
      </div>
    </PageTemplate>
  );
}

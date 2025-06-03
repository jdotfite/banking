'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { animated, useSpring } from 'react-spring';
import { useBankingData } from '@/components/context/BankingDataProvider';
import Header from '@/components/ui/navigation/Header';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import Icon from '@/components/ui/icons/Icon';
import TransactionContainer from '@/components/ui/transactions/TransactionContainer';
import PromotionalSlider from './PromotionalSlider';
import ToDo from './ToDo';
import { BankingAccount, TransactionDateGroup } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true);
  const transactionsContainerRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  
  // Get banking data from context - Updated import source, same API
  const { userData, isLoading: isBankingDataLoading } = useBankingData();
  
  // Debug logging for credit cards
  useEffect(() => {
    console.log('Home component - Credit cards:', userData?.creditCards);
    console.log('Home component - Card-5001 in all cards:', userData?.creditCards?.find(card => card.id === 'card-5001'));
  }, [userData?.creditCards]);
  
  // React Spring animations
  const headerSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(-20px)' : 'translateY(0px)',
    delay: 100,
    config: { tension: 280, friction: 25 }
  });
  
  const cardsSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    delay: 200,
    config: { tension: 280, friction: 25 }
  });
  
  const actionsSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    delay: 300,
    config: { tension: 280, friction: 25 }
  });
  
  const promotionsSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    delay: 400,
    config: { tension: 280, friction: 25 }
  });
  
  const transactionsSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    delay: 500,
    config: { tension: 280, friction: 25 }
  });

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate button positions for transaction container
  useEffect(() => {
    if (!isLoading && transactionsContainerRef.current) {
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
  }, [isLoading]); 

  // Handle transactions click
  const handleTransactionsClick = () => {
    setShowTransactions(true);
    setIsTransactionCollapsed(false);
  };

  // Handle collapse state changes
  const handleCollapseChange = (collapsed: boolean) => {
    setIsTransactionCollapsed(collapsed);
    
    if (collapsed) {
      setTimeout(() => {
        setShowTransactions(false);
      }, 300);
    }
  };

  // Show loading spinner if loading
  if (isLoading || isBankingDataLoading) {
    return (
      <LoadingSpinner size="large" fullScreen={true} />
    );
  }

  // Get user name and transactions from data
  const userName = userData?.user?.name?.split(' ')[0] || 'Guest';
  const bankingTransactions = userData?.groupedTransactions || [];
  const accounts = userData?.accounts || [];
  const creditCards = userData?.creditCards || [];

  // Combine accounts and credit cards for the account carousel
  const allAccounts = [
    ...accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      accountNumber: account.accountNumber,
      color: account.type === 'checking' ? '#3b82f6' : account.type === 'savings' ? '#10b981' : '#8b5cf6'
    })),
    ...creditCards.map(card => ({
      id: card.id,
      name: card.name,
      type: 'credit',
      balance: card.currentBalance,
      accountNumber: card.cardNumber,
      color: card.color || '#7b2528'
    }))  ];

  return (
    <>      {/* Header */}
      <Header userName={userName} />      
      
      {/* ToDo Component - New position */}
      <ToDo style={promotionsSpring} />
      
      {/* Accounts List */}
        <animated.div style={cardsSpring} className="mb-6">
          <div className="space-y-3">{allAccounts.map((account) => (
              <Link 
                key={account.id}
                href={account.type === 'credit' ? `/cards?selected=${account.id}` : '#'}
                className={account.type === 'credit' ? 'block cursor-pointer' : 'block cursor-default'}
                onClick={(e) => account.type !== 'credit' && e.preventDefault()}
              >
                <div 
                  className="bg-[#212121] rounded-lg p-4 flex items-center justify-between"
                >                  <div className="flex items-center">
                    <div>
                      <div className="font-medium tracking-tight text-white">{account.name}</div>
                      <div className="text-neutral-400 text-xs">
                        {account.accountNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium tracking-tight text-white">
                      ${account.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                    <div className="text-neutral-400 text-xs capitalize">
                      {account.type}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>        </animated.div>        
        
        {/* Promotional Banners - Moved from top */}
        <PromotionalSlider style={promotionsSpring} />
        
        {/* Recent Transactions */}
        <animated.div style={transactionsSpring} className="mb-4" ref={transactionsContainerRef}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Recent Transactions</h2>
            <button 
              className="text-sm text-neutral-400 flex items-center"
              onClick={handleTransactionsClick}
            >
              See all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {/* Preview of recent transactions */}
          <div className="space-y-2">
            {bankingTransactions.length > 0 && bankingTransactions[0].transactions.slice(0, 3).map((transaction, index) => (
              <div 
                key={transaction.id}
                className="bg-[#212121] rounded-lg p-3 flex items-center justify-between"
                onClick={handleTransactionsClick}
              >
                <div className="flex items-center">
                  <div className="bg-neutral-700 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Icon name={transaction.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium tracking-tight text-white">{transaction.merchant}</div>
                    <div className="text-neutral-400 text-xs">
                      {transaction.location || transaction.message || transaction.timestamp}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium tracking-tight ${transaction.isIncoming ? 'text-green-500' : 'text-white'}`}>
                    {transaction.isIncoming ? '+' : ''}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show a message if no transactions */}
            {(!bankingTransactions.length || !bankingTransactions[0].transactions.length) && (
              <div className="bg-[#212121] rounded-lg p-4 text-center">
                <p className="text-neutral-400">No recent transactions</p>
              </div>
            )}
          </div>
        </animated.div>
          {/* Transaction Container */}
        {showTransactions && buttonBottomPosition > 0 && (
          <TransactionContainer 
            transactionGroups={bankingTransactions}
            buttonBottomPosition={buttonBottomPosition}
            isCollapsed={isTransactionCollapsed}
            onCollapseChange={handleCollapseChange}
          />
        )}
    </>
  );
};

export default Home;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { useEnhancedBankingData } from '@/components/preloaders/EnhancedBankingDataProvider';
import Header from '@/components/ui/navigation/Header';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import Icon from '@/components/ui/icons/Icon';
import TransactionContainer from '@/components/ui/transactions/TransactionContainer';
import { BankingAccount, TransactionDateGroup } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [activePromotionIndex, setActivePromotionIndex] = useState(0);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true);
  const transactionsContainerRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  
  // Get banking data from context
  const { userData, isLoading: isBankingDataLoading } = useEnhancedBankingData();
  
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
    }))
  ];

  // Quick actions
  const quickActions = [
    { name: 'Send', icon: 'transfer', color: '#3b82f6' },
    { name: 'Pay', icon: 'repeat', color: '#ef4444' },
    { name: 'Deposit', icon: 'deposit', color: '#10b981' },
    { name: 'Withdraw', icon: 'withdraw', color: '#f59e0b' },
    { name: 'Invest', icon: 'insights', color: '#8b5cf6' }
  ];

  // Promotional banners
  const promotions = [
    {
      title: 'Refer and Earn',
      description: 'Share a referral link to your friend and get rewarded',
      buttonText: 'Learn more',
      image: '/images/marketing/refer-friend.png',
      color: 'from-gray-800 to-gray-900'
    },
    {
      title: 'Boost Your Savings',
      description: 'Open a high-yield savings account today',
      buttonText: 'Get started',
      image: '/images/marketing/refer-friend.png',
      color: 'from-blue-800 to-blue-900'
    },
    {
      title: 'Go Paperless',
      description: 'Switch to e-statements and help the environment',
      buttonText: 'Switch now',
      image: '/images/marketing/refer-friend.png',
      color: 'from-green-800 to-green-900'
    }
  ];
  
  return (
    <div className="relative min-h-screen bg-app-black text-white pb-20">
      {/* Header */}
      <Header userName={userName} />
      
      <div className="px-5 mx-auto max-w-md">
        {/* Accounts List */}
        <animated.div style={cardsSpring} className="mb-6">
          <div className="space-y-3">
            {allAccounts.map((account) => (
              <div 
                key={account.id}
                className="bg-[#212121] rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: account.color }}
                  >
                    <Icon 
                      name={account.type === 'credit' ? 'credit-card' : account.type} 
                      className="w-5 h-5 text-white" 
                    />
                  </div>
                  <div>
                    <div className="font-medium tracking-tight text-white">{account.name}</div>
                    <div className="text-gray-400 text-xs">
                      {account.accountNumber}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium tracking-tight text-white">
                    ${account.balance.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-xs capitalize">
                    {account.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </animated.div>
        
        {/* Quick Actions */}
        <animated.div style={actionsSpring} className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex justify-between w-full pb-2">
              {quickActions.map((action, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-[#212121]"
                  >
                    <Icon name={action.icon} className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white">{action.name}</span>
                </div>
              ))}
            </div>
          </div>
        </animated.div>
        
        {/* Promotional Banners */}
        <animated.div style={promotionsSpring} className="mb-6">
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {promotions.map((promo, index) => (
                <div 
                  key={index}
                  className="min-w-[90%] mr-4 snap-center first:pl-0 last:pr-5"
                  onClick={() => setActivePromotionIndex(index)}
                >
                  <div className={`rounded-xl p-4 bg-gradient-to-br ${promo.color} relative overflow-hidden`}>
                    <div className="flex justify-between">
                      <div className="max-w-[65%]">
                        <h3 className="text-white font-medium mb-1">{promo.title}</h3>
                        <p className="text-white/80 text-xs mb-3">
                          {promo.description}
                        </p>
                        <button className="text-xs text-white bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                          {promo.buttonText}
                        </button>
                      </div>
                      <div className="absolute right-2 bottom-2">
                        <img src={promo.image} alt={promo.title} className="h-20 object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-1">
              {promotions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${index === activePromotionIndex ? 'bg-white' : 'bg-gray-600'}`}
                  onClick={() => setActivePromotionIndex(index)}
                />
              ))}
            </div>
          </div>
        </animated.div>
        
        {/* Recent Transactions */}
        <animated.div style={transactionsSpring} className="mb-4" ref={transactionsContainerRef}>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Recent Transactions</h2>
            <button 
              className="text-sm text-gray-400 flex items-center"
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
                className="bg-[#212121] rounded-xl p-3 flex items-center justify-between"
                onClick={handleTransactionsClick}
              >
                <div className="flex items-center">
                  <div className="bg-neutral-700 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Icon name={transaction.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium tracking-tight text-white">{transaction.merchant}</div>
                    <div className="text-gray-400 text-xs">
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
              <div className="bg-[#212121] rounded-xl p-4 text-center">
                <p className="text-gray-400">No recent transactions</p>
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
      </div>
    </div>
  );
};

export default Home;

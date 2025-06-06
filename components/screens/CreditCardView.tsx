'use client';

import React, { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import { useBankingData } from '@/components/context/BankingDataProvider';
import CreditCardComponent from '@/components/ui/card/CreditCard'; 
import TransactionContainer from '@/components/ui/transactions/TransactionContainer';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import Icon from '@/components/ui/icons/Icon';
import { Lock, ArrowLeft, Bell } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CreditCardView: React.FC = () => {
  const params = useParams();
  if (!params || !params.id) {
    return <div className="p-4 text-red-500">Error: Missing card ID</div>;
  }
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const payButtonsRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const isManageClickRef = useRef(false);
  
  // Get banking data from context
  const { userData, isLoading: isBankingDataLoading, refreshData } = useBankingData();
  
  // React Spring animations
  const cardSpring = useSpring({
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? 'translateY(20px)' : 'translateY(0px)',
    delay: 100,
    config: { tension: 280, friction: 25 }
  });
  
  const sectionSpring = useSpring({
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

  // Find the selected card using the ID from the URL params
  const cardInfo = userData?.creditCards?.find(card => card.id === id);
  const rewardsBalance = cardInfo?.rewardsBalance || 0;

  // Debug logging
  useEffect(() => {
    console.log('Card ID from URL:', id);
    console.log('Available credit cards:', userData?.creditCards);
    console.log('Selected card info:', cardInfo);
  }, [id, userData?.creditCards, cardInfo]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate button positions for transaction container
  useEffect(() => {
    if (!isLoading) {
      const calculatePositions = () => {
        if (payButtonsRef.current) {
          const rect = payButtonsRef.current.getBoundingClientRect();
          if (rect.bottom > 0) {
            setButtonBottomPosition(rect.bottom);
          }
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
  }, [isLoading, showInfo]); 

  // Handle transactions click
  const handleTransactionsClick = () => {
    setShowTransactions(true);
    setIsTransactionCollapsed(false);
  };

  // Handle manage button click
  const handleManageClick = () => {
    isManageClickRef.current = true;
    setIsTransactionCollapsed(!isTransactionCollapsed);
    
    if (showTransactions === false && !isTransactionCollapsed) {
      setShowTransactions(true);
    }
    
    setTimeout(() => {
      isManageClickRef.current = false;
    }, 100);
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

  // Show error message if card not found
  if (!cardInfo) {
    return (
      <div className="relative min-h-screen bg-[#121212] text-white p-5">
        <div className="px-5 pt-8 pb-6 mx-auto max-w-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="mr-3">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="text-xl font-medium tracking-tight">Card Not Found</div>
            </div>
          </div>
        </div>
        
        <div className="px-5 mx-auto max-w-md mt-10 text-center">
          <div className="bg-[#212121] rounded-xl p-6">
            <p className="text-red-500 mb-4">
              The card with ID "{id}" could not be found.
            </p>
            <p className="text-neutral-400 mb-6">
              This could be due to a data loading issue or the card may not exist.
            </p>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user name and transactions from data
  const userName = userData?.user?.name?.split(' ')[0] || 'Guest';
  const bankingTransactions = userData?.groupedTransactions || [];

  return (
    <div className="relative min-h-screen bg-[#121212] text-white">
      {/* Custom header with back button */}
      <div className="px-5 pt-8 pb-6 mx-auto max-w-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="text-xl font-medium tracking-tight">{cardInfo.name}</div>
          </div>
          <button className="relative p-1">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/4 translate-x-1/4"></span>
          </button>
        </div>
      </div>
      
      <div className="px-5 mx-auto max-w-md">
        {/* Card with React Spring animation */}
        <animated.div style={cardSpring} className="mb-4">
          <CreditCardComponent 
            showInfoState={[showInfo, setShowInfo]}
            cardInfo={cardInfo}
          />
        </animated.div>
        
        {/* Main sections grid */}
        <animated.div style={sectionSpring} className="grid grid-cols-2 gap-4 mb-4">
          {/* Transactions section */}
          <div 
            className="bg-[#212121] rounded-xl p-4 cursor-pointer hover:bg-neutral-700 transition-colors"
            onClick={handleTransactionsClick}
          >
            <h3 className="text-sm font-medium mb-1">Transactions</h3>
            <p className="text-xs text-neutral-400 mb-2">Recent Activity</p>
            <div className="flex space-x-1 mb-1">
              <div className="h-4 w-1/4 rounded-full bg-purple-500"></div>
              <div className="h-4 w-1/4 rounded-full bg-red-500"></div>
              <div className="h-4 w-1/4 rounded-full bg-blue-500"></div>
              <div className="h-4 w-1/4 rounded-full bg-yellow-500"></div>
            </div>
          </div>
            {/* Rewards section - only show for cards that offer rewards */}
          {cardInfo?.rewardsType && cardInfo.rewardsType !== 'none' && (
            <div className="bg-[#212121] rounded-xl p-4">
              <h3 className="text-sm font-medium mb-1">Rewards</h3>
              <p className="text-xs text-neutral-400 mb-2">
                {cardInfo.rewardsType === 'cashback' ? 'Cash back earned' : 
                 cardInfo.rewardsType === 'points' ? 'Points earned' : 'Rewards earned'}
              </p>
              <p className="text-green-500 font-semibold">
                {cardInfo.rewardsType === 'cashback' ? '$' : ''}
                {rewardsBalance.toFixed(2)}
                {cardInfo.rewardsType === 'points' ? ' pts' : ''}
              </p>
            </div>
          )}
        </animated.div>
        
        {/* Action buttons */}
        <animated.div style={sectionSpring} className="grid grid-cols-2 gap-4 mb-4" ref={payButtonsRef}>
          <button 
            className="bg-[#212121] rounded-xl p-4 flex items-center justify-center hover:bg-neutral-700 transition-colors"
            onClick={handleTransactionsClick}
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
              <Icon name="repeat" className="w-5 h-5 text-neutral-200" />
            </div>
            <span className="text-sm text-neutral-300">Pay</span>
          </button>
          
          <Link href={`/cards/manage/${id}`} className="bg-[#212121] rounded-xl p-4 flex items-center justify-center hover:bg-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
              <Icon name="settings" className="w-5 h-5 text-neutral-200" />
            </div>
            <span className="text-sm text-neutral-300">Manage</span>
          </Link>
        </animated.div>
        
        {/* Refer and Earn section */}
        <animated.div style={actionsSpring} className="bg-[#212121] rounded-xl p-4 mb-4 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">Refer and Earn</h3>
              <p className="text-xs text-neutral-400 max-w-[70%]">
                Share a referral link to your friend and get rewarded
              </p>
              <button className="mt-2 text-xs text-white bg-neutral-700 px-3 py-1 rounded-full hover:bg-neutral-600 transition-colors">
                Learn more
              </button>
            </div>
            <div className="absolute right-2 bottom-2">
              <img src="/images/marketing/refer-friend.png" alt="Refer a friend" className="h-24 object-contain" />
            </div>
          </div>
        </animated.div>
        
        {/* Additional action buttons */}
        <animated.div style={actionsSpring} className="grid grid-cols-2 gap-4 mb-4">
          <button className="bg-[#212121] rounded-xl p-4 flex items-center justify-center hover:bg-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
              <Icon name="transfer" className="w-5 h-5 text-neutral-200" />
            </div>
            <span className="text-sm text-neutral-300">Balance Transfer</span>
          </button>
          
          <button className="bg-[#212121] rounded-xl p-4 flex items-center justify-center hover:bg-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
              <Lock className="w-5 h-5 text-neutral-200" />
            </div>
            <span className="text-sm text-neutral-300">Lock/Unlock</span>
          </button>
        </animated.div>
        
        {/* Statements section */}
        <animated.div style={actionsSpring} className="bg-[#212121] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Statements and Documents</h3>
            <button className="text-xs text-neutral-400 hover:text-white transition-colors">
              View All
            </button>
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

        {/* Debug button - temporary */}
        <button 
          onClick={() => refreshData()}
          className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default CreditCardView;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getDefaultCard } from '@/lib/data/cards';
import { getTransactions } from '@/lib/data/transactions';
import CreditCard from '../ui/card/CreditCard'; 
import TransactionContainer from '../ui/transactions/TransactionContainer';
import Header from '../ui/navigation/Header';
import LoadingSpinner from '../ui/common/LoadingSpinner';

const Home: React.FC = () => {
  const card = getDefaultCard();
  const transactions = getTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [balance] = useState(25552.92);
  const payButtonsRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(false);
  const isManageClickRef = useRef(false);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // When page loads or card info is toggled, calculate positions
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
      
      // Calculate immediately
      calculatePositions();
      
      // And after a short delay to account for animations
      const animationDelay = setTimeout(calculatePositions, 350);
      
      // Also listen for window resize events
      window.addEventListener('resize', calculatePositions);
      
      return () => {
        clearTimeout(animationDelay);
        window.removeEventListener('resize', calculatePositions);
      };
    }
  }, [isLoading, showInfo]); // Recalculate when info is toggled

  // Handle manage button click with debouncing
  const handleManageClick = () => {
    // Set a flag to indicate this is from manage button
    isManageClickRef.current = true;
    
    // Toggle the state
    setIsTransactionCollapsed(!isTransactionCollapsed);
    
    // Clear the flag after a delay
    setTimeout(() => {
      isManageClickRef.current = false;
    }, 100);
  };

  // Handle collapse state changes from the container
  const handleCollapseChange = (collapsed: boolean) => {
    // Only update if coming from the container (not from manage button)
    if (!isManageClickRef.current && collapsed !== isTransactionCollapsed) {
      setIsTransactionCollapsed(collapsed);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-app-black text-white animate-fade-in">
      <Header userName="Jess" />
      
      <div className="px-5">
        {/* Card with simple animation */}
        <motion.div 
          className="mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 120,
            delay: 0.1 
          }}
        >
          <CreditCard 
            card={card} 
            balance={balance} 
            showInfoState={[showInfo, setShowInfo]}
          />
        </motion.div>
        
        {/* Pay/Manage buttons with ref for positioning */}
        <div ref={payButtonsRef} className="flex gap-4 mb-4 z-10">
          <button className="flex-1 bg-[#212121] text-white py-3 px-4 rounded-full flex items-center">
            <div className="bg-card-red p-2 rounded-full mr-3">
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            Pay
          </button>
          <button 
            className="flex-1 bg-[#212121] text-white py-3 px-4 rounded-full flex items-center"
            onClick={handleManageClick}
          >
            <div className="bg-card-red p-2 rounded-full mr-3">
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            Manage
          </button>
        </div>
      </div>
      
      {/* Only render TransactionContainer when we have a valid position */}
      {buttonBottomPosition > 0 && (
        <TransactionContainer 
          transactionGroups={transactions}
          buttonBottomPosition={buttonBottomPosition}
          isCollapsed={isTransactionCollapsed}
          onCollapseChange={handleCollapseChange}
        />
      )}
    </div>
  );
};

export default Home;
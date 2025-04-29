'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as CreditCardIcon, Settings } from 'lucide-react';
import { getDefaultCard } from '@/lib/data/cards';
import { getTransactions } from '@/lib/data/transactions';
import CreditCardComponent from '../ui/card/CreditCard'; 
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
          <CreditCardComponent 
            card={card} 
            balance={balance} 
            showInfoState={[showInfo, setShowInfo]}
          />
        </motion.div>
        
        {/* Pay/Manage buttons with ref for positioning */}
        <div ref={payButtonsRef} className="flex gap-4 mb-4 z-10">
          <button className="flex-1 bg-[#212121] text-white py-3 px-4 rounded-full flex items-center">
            <div className="bg-card-red p-2 rounded-full mr-3">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            Pay
          </button>
          <button 
            className="flex-1 bg-[#212121] text-white py-3 px-4 rounded-full flex items-center"
            onClick={handleManageClick}
          >
            <div className="bg-card-red p-2 rounded-full mr-3">
              <Settings className="w-5 h-5" />
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
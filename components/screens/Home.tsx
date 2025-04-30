// components/screens/Home.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Settings, ArrowLeftRight, AlertCircle, Lock } from 'lucide-react';
import { getDefaultCard } from '@/lib/data/cards';
import { getTransactions } from '@/lib/data/transactions';
import CreditCardComponent from '../ui/card/CreditCard'; 
import TransactionContainer from '../ui/transactions/TransactionContainer';
import Header from '../ui/navigation/Header';
import LoadingSpinner from '../ui/common/LoadingSpinner';
import Icon from '../ui/icons/Icon';
import SpendingChart from '../ui/charts/SpendingChart';

const Home: React.FC = () => {
  const card = getDefaultCard();
  const transactions = getTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [balance] = useState(25552.92);
  const payButtonsRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true); // Start collapsed by default
  const [showTransactions, setShowTransactions] = useState(false); // Initially hidden
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
  }, [isLoading, showInfo]); 

  // Handle transactions card click - load full screen immediately
  const handleTransactionsClick = () => {
    // Show the transactions panel
    setShowTransactions(true);
    // Directly set to fullscreen
    setIsTransactionCollapsed(false);
  };

  // Handle manage button click with debouncing
  const handleManageClick = () => {
    isManageClickRef.current = true;
    setIsTransactionCollapsed(!isTransactionCollapsed);
    
    // If showing transactions and we're expanding
    if (showTransactions === false && !isTransactionCollapsed) {
      setShowTransactions(true);
    }
    
    setTimeout(() => {
      isManageClickRef.current = false;
    }, 100);
  };

  // Handle collapse state changes from the container
  const handleCollapseChange = (collapsed: boolean) => {
    console.log("Collapse state change:", collapsed); // Add debugging
    setIsTransactionCollapsed(collapsed);
    
    // If fully collapsed, hide the transaction container after a delay
    if (collapsed) {
      setTimeout(() => {
        setShowTransactions(false);
      }, 300); // Wait for collapse animation to finish
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
        
        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Transactions button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#212121] rounded-xl p-4 cursor-pointer h-28"
            onClick={handleTransactionsClick}
          >
            <h3 className="font-medium mb-1">Transactions</h3>
            <p className="text-gray-400 text-sm mb-3">Spent in April</p>
            <div className="flex space-x-1">
              <div className="w-10 h-3 bg-purple-600 rounded-md"></div>
              <div className="w-6 h-3 bg-red-500 rounded-md"></div>
              <div className="w-4 h-3 bg-blue-500 rounded-md"></div>
              <div className="w-8 h-3 bg-yellow-400 rounded-md"></div>
            </div>
          </motion.div>

          {/* Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#212121] rounded-xl p-4 h-28"
          >
            <h3 className="font-medium mb-1">Rewards</h3>
            <p className="text-gray-400 text-sm mb-2">Cash back earned</p>
            <p className="text-xl font-bold text-green-500">$342.89</p>
          </motion.div>
        </div>

        {/* Second row of buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Pay button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#212121] rounded-xl p-4 flex items-center cursor-pointer"
          >
            <div className="bg-neutral-700 p-2 rounded-full mr-3">
              <Icon name="repeat" className="w-5 h-5" />
            </div>
            <span>Pay</span>
          </motion.div>

          {/* Manage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#212121] rounded-xl p-4 flex items-center cursor-pointer"
            onClick={handleManageClick}
          >
            <div className="bg-neutral-700 p-2 rounded-full mr-3">
              <Settings className="w-5 h-5" />
            </div>
            <span>Manage</span>
          </motion.div>
        </div>

        {/* Refer and Earn card with image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#212121] rounded-xl p-4 mb-4 overflow-hidden relative"
        >
          <div className="flex justify-between items-center">
            <div className="w-3/5">
              <h3 className="font-medium mb-1">Refer and Earn</h3>
              <p className="text-gray-400 text-sm mb-3">Share a referral link to your friend and get rewarded</p>
              <button className="bg-neutral-800 text-white px-4 py-2 rounded-full text-sm">
                Learn more
              </button>
            </div>
            <div className="absolute right-0 bottom-0">
              <img 
                src="/images/refer/refer-friend.png" 
                alt="Refer a friend" 
                className="h-24 object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Action buttons row - Updated to match pay/manage styling */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Balance Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-[#212121] rounded-xl p-4 flex items-center cursor-pointer"
          >
            <div className="bg-neutral-700 p-2 rounded-full mr-3">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span>Balance Transfer</span>
          </motion.div>

          {/* Lock/Unlock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-[#212121] rounded-xl p-4 flex items-center cursor-pointer"
          >
            <div className="bg-neutral-700 p-2 rounded-full mr-3">
              <Lock className="w-5 h-5" />
            </div>
            <span>Lock/Unlock</span>
          </motion.div>
        </div>
        
        {/* Statements and Documents full-width card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-[#212121] rounded-xl p-4 mb-4 flex items-center justify-between cursor-pointer"
          ref={payButtonsRef}
        >
          <span className="font-medium">Statements and Documents</span>
          <span className="text-gray-400 text-sm">View All</span>
        </motion.div>
        
        {/* Adding bottom margin */}
        <div className="mb-20"></div>
      </div>
      
      {/* Transaction Container - Only show when showTransactions is true */}
      {showTransactions && buttonBottomPosition > 0 && (
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 120
          }}
        >
          <TransactionContainer 
            transactionGroups={transactions}
            buttonBottomPosition={buttonBottomPosition}
            isCollapsed={isTransactionCollapsed}
            onCollapseChange={handleCollapseChange}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
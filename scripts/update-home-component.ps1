Set-Content -Path './components/screens/Home.tsx' -Value '// components/screens/Home.tsx
''use client'';

import React, { useState, useEffect, useRef } from ''react'';
import { CreditCard, Settings, ArrowLeftRight, AlertCircle, Lock } from ''lucide-react'';
import { getDefaultCard } from ''@/lib/data/cards'';
import { getTransactions } from ''@/lib/data/transactions'';
import { useBankingData } from ''@/components/preloaders/BankingDataPreloader'';
import CreditCardComponent from ''../ui/card/CreditCard''; 
import TransactionContainer from ''../ui/transactions/TransactionContainer'';
import Header from ''../ui/navigation/Header'';
import LoadingSpinner from ''../ui/common/LoadingSpinner'';
import Icon from ''../ui/icons/Icon'';
import SpendingChart from ''../ui/charts/SpendingChart'';

const Home: React.FC = () => {
  const card = getDefaultCard();
  const transactions = getTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [balance, setBalance] = useState(25552.92);
  const payButtonsRef = useRef<HTMLDivElement>(null);
  const [buttonBottomPosition, setButtonBottomPosition] = useState(0);
  const [isTransactionCollapsed, setIsTransactionCollapsed] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const isManageClickRef = useRef(false);
  
  // Get banking data from context
  const { data, isLoading: isBankingDataLoading } = useBankingData();
  
  // Animation is complete flag
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  // Update balance from banking data if available
  useEffect(() => {
    if (data && data.creditCards && data.creditCards.length > 0) {
      // Find the first credit card for the current user
      const userCard = data.creditCards.find(card => card.userId === ''user1'');
      if (userCard) {
        setBalance(userCard.currentBalance);
      }
    }
  }, [data]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Enable animations after loading is complete
      setTimeout(() => {
        setAnimationsEnabled(true);
      }, 50);
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
      window.addEventListener(''resize'', calculatePositions);
      
      return () => {
        clearTimeout(animationDelay);
        window.removeEventListener(''resize'', calculatePositions);
      };
    }
  }, [isLoading, showInfo]); 

  // Handle transactions card click - load full screen immediately
  const handleTransactionsClick = () => {
    setShowTransactions(true);
    setIsTransactionCollapsed(false);
  };

  // Handle manage button click with debouncing
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

  // Handle collapse state changes from the container
  const handleCollapseChange = (collapsed: boolean) => {
    setIsTransactionCollapsed(collapsed);
    
    if (collapsed) {
      setTimeout(() => {
        setShowTransactions(false);
      }, 300);
    }
  };

  // Simple CSS animation classes instead of React Spring
  const getTransitionClass = (index: number) => {
    if (!animationsEnabled) return '''';
    return `animate-slide-up transition-opacity transition-transform duration-500 delay-${index}`;
  };

  // Show loading spinner if either local loading state or banking data is loading
  if (isLoading || isBankingDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Get user name from banking data if available
  const userName = data?.users?.[0]?.name?.split('' '')[0] || ''Jess'';
  
  // Get custom transactions from banking data if available
  const bankingTransactions = data?.groupedTransactions?.user1 || transactions;

  return (
    <div className="relative min-h-screen bg-app-black text-white">
      <Header userName={userName} />
      
      {/* Rest of your component remains the same */}
      <div className="px-5">
        {/* Card with simple CSS animation for now */}
        <div 
          className={`mb-4 ${animationsEnabled ? ''animate-slide-up'' : ''''}`}
          style={{ 
            animationDelay: ''100ms'',
            opacity: animationsEnabled ? 1 : 0,
            transform: animationsEnabled ? ''translateY(0)'' : ''translateY(50px)''
          }}
        >
          <CreditCardComponent 
            card={card} 
            balance={balance} 
            showInfoState={[showInfo, setShowInfo]}
          />
        </div>
        
        {/* Rest of your original JSX here... */}
        
        {/* Transaction Container - Only show when showTransactions is true */}
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

export default Home;' -Force

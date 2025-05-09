// components/ui/card/CreditCard.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring, config } from 'react-spring';
import { Info } from 'lucide-react';
import { CardType } from '@/lib/types';
import { useBankingData } from '@/components/preloaders/SimplifiedBankingDataProvider';
import { BankingDataType, BankingCreditCard } from '@/lib/types';

interface CreditCardProps {
  showInfoState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const CreditCard: React.FC<CreditCardProps> = ({ 
  showInfoState
}) => {
  // Use local or parent-controlled state for showInfo
  const [showInfo, setShowInfo] = showInfoState || React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  // Get banking data if available
  const { userData } = useBankingData();
  
  // Get card info from banking data
  const cardInfo = userData?.creditCards?.[0];
  
  // Measure the content height when it changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [userData, showInfo]);
  
  // Create spring animation for the info panel
  const infoSpring = useSpring({
    height: showInfo ? contentHeight : 0,
    opacity: showInfo ? 1 : 0,
    transform: showInfo ? 'translateY(0px)' : 'translateY(-8px)',
    marginTop: showInfo ? 8 : 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 26,
      clamp: false,
      velocity: 0.01
    },
    immediate: false
  });

  // Get card details from banking data with fallbacks
  const balance = cardInfo?.currentBalance || 0;
  const availableCredit = cardInfo?.availableCredit || 0;
  const minimumPayment = cardInfo?.minimumPayment || 0;
  const dueDate = cardInfo?.dueDate ? new Date(cardInfo.dueDate).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  }) : '';
  const cardNumber = cardInfo?.cardNumber || '';
  const cardColor = cardInfo?.color || '#7b2528';

  return (
    <div className="w-full" ref={cardRef}>
      {/* Credit Card with balance directly inside */}
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.01]"
        style={{
          backgroundColor: cardColor,
        }}
      >
        {/* Card content */}
        <div className="p-5 flex flex-col">
          {/* Card top section with balance and info button */}
          <div className="flex justify-between items-start">
            <div className="text-white">
              <p className="text-gray-300 text-sm">Your Balance</p>
              <h1 className="text-white text-4xl font-semibold">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h1>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-white/30 px-3 py-1 rounded-full text-white text-xs flex items-center transition-all hover:bg-white/40"
            >
              <Info className="w-4 h-4 mr-1" />
              Show info
            </button>
          </div>
          
          {/* Additional card info - Animated with React Spring */}
          <animated.div 
            style={infoSpring}
            className="text-white overflow-hidden"
          >
            <div ref={contentRef}>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-gray-300 text-sm">Available Credit:</div>
                <div className="text-right font-medium text-sm">${availableCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                
                <div className="text-gray-300 text-sm">Minimum Payment:</div>
                <div className="text-right font-medium text-sm">${minimumPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                
                <div className="text-gray-300 text-sm">Due Date:</div>
                <div className="text-right font-medium text-sm">{dueDate}</div>
                
                <div className="text-gray-300 text-sm">AutoPay:</div>
                <div className="text-right font-medium text-sm">
                  ON | <a href="#" className="text-neutral-400 hover:underline">Settings</a>
                </div>
              </div>
            </div>
          </animated.div>
          
          {/* VISA bar at bottom */}
          <div className="relative mt-4 -mx-5 -mb-5 bg-black/40 py-2 px-5 flex justify-between items-center">
            <div className="text-white text-xl font-bold">VISA</div>
            <div className="text-white text-base">{cardNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;

// components/ui/card/CreditCard.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardType } from '@/lib/types';

interface CreditCardProps {
  card: CardType;
  balance?: number;
  showInfoState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const CreditCard: React.FC<CreditCardProps> = ({ 
  card, 
  balance = 25552.92,
  showInfoState
}) => {
  // Use local or parent-controlled state for showInfo
  const [showInfo, setShowInfo] = showInfoState || React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full" ref={cardRef}>
      {/* Credit Card with balance directly inside */}
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.01]"
        style={{
          backgroundColor: '#7b2528', // Flat red color
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Show info
            </button>
          </div>
          
          {/* Additional card info - Animated slide down */}
          <AnimatePresence>
            {showInfo && (
              <motion.div 
                className="mt-4 text-white"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeInOut"
                }}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-gray-300">Available Credit:</div>
                  <div className="text-right font-medium">$3,914.65</div>
                  
                  <div className="text-gray-300">Minimum Payment:</div>
                  <div className="text-right font-medium">$0.00</div>
                  
                  <div className="text-gray-300">Due Date:</div>
                  <div className="text-right font-medium">5/25/2025</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* VISA bar at bottom */}
          <div className="relative mt-4 -mx-5 -mb-5 bg-black/40 py-3 px-5 flex justify-between items-center">
            <div className="text-white text-xl font-bold">VISA</div>
            <div className="text-white text-base">•••• 9891</div>
          </div>
        </div>
      </div>
      
      {/* REMOVED the Pay/Manage buttons from here */}
    </div>
  );
};

export default CreditCard;
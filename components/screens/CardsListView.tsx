'use client';

import React, { useState, useEffect } from 'react';
import { useBankingData } from '@/components/context/BankingDataProvider';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

const CardsListView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get banking data from context
  const { userData, isLoading: isBankingDataLoading } = useBankingData();
  
  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading spinner if loading
  if (isLoading || isBankingDataLoading) {
    return (
      <LoadingSpinner size="large" fullScreen={true} />
    );
  }

  const creditCards = userData?.creditCards || [];

  // Helper function to format expiry date
  const formatExpiry = (expiry: string) => {
    // Check if expiry is already in MM/YY format
    if (expiry && expiry.includes('/')) {
      return expiry;
    }
    
    // Default fallback
    return expiry;
  };

  return (
    <div className="relative min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="px-5 pt-8 pb-6 mx-auto max-w-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="text-xl font-medium tracking-tight">My Cards</div>
          </div>
          <button className="p-2 bg-[#212121] rounded-full">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="px-5 mx-auto max-w-md">
        {/* Cards list */}
        <div className="space-y-4">
          {creditCards.map((card) => (
            <Link 
              key={card.id}
              href={`/cards/${card.id}`}
              className="block bg-[#212121] rounded-xl p-4 hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: card.color }}
                >
                  <span className="text-white text-lg font-bold">
                    {card.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{card.name}</div>
                  <div className="text-neutral-400 text-sm">
                    •••• {card.cardNumber.slice(-4)}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-white font-medium">
                    ${card.currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                  <div className="text-neutral-400 text-xs">
                    Exp: {formatExpiry(card.expiry)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Show a message if no cards */}
          {!creditCards.length && (
            <div className="bg-[#212121] rounded-xl p-6 text-center">
              <p className="text-neutral-400 mb-4">You don't have any credit cards yet</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Apply for a Card
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardsListView;

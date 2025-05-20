'use client';

import React, { useState } from 'react';
import { useBankingData } from '@/lib/hooks/useBankingData';
import { useSpring, animated } from 'react-spring';
import { Eye, EyeOff } from 'lucide-react';

interface CreditCardComponentProps {
  showInfoState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  cardInfo?: any; // Using any here for flexibility, ideally should match your BankingCreditCard type
}

const CreditCardComponent: React.FC<CreditCardComponentProps> = ({ 
  showInfoState,
  cardInfo: propCardInfo 
}) => {
  // Use external state if provided, otherwise create internal state
  const [localShowInfo, setLocalShowInfo] = useState(false);
  const [showInfo, setShowInfo] = showInfoState || [localShowInfo, setLocalShowInfo];

  // Get banking data from context
  const { userData, isLoading } = useBankingData();
  
  // Use the provided card or default to the first card from userData
  const card = propCardInfo || userData?.creditCards?.[0];

  // Handle case where no card is available
  if (!card) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-5 h-56 flex items-center justify-center">
        <p className="text-neutral-400">Card not available</p>
      </div>
    );
  }

  // Flip animation
  const { transform, opacity } = useSpring({
    opacity: showInfo ? 1 : 0,
    transform: `perspective(600px) rotateY(${showInfo ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  
  // Format card number with dots
  const formatCardNumber = (cardNumber: string) => {
    return showInfo 
      ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() 
      : '•••• •••• •••• ' + cardNumber.slice(-4);
  };

  // Parse expiry into month and year if needed
  const parseExpiry = (expiry: string) => {
    // Format could be MM/YY or MM/YYYY
    if (!expiry) return { month: '••', year: '••' };
    
    const parts = expiry.split('/');
    if (parts.length === 2) {
      return {
        month: parts[0].padStart(2, '0'),
        year: parts[1].length === 2 ? parts[1] : parts[1].slice(-2)
      };
    }
    
    // Fallback for other formats
    return { month: '••', year: '••' };
  };

  // Format expiration date
  const formatValidThru = (expiry: string) => {
    const { month, year } = parseExpiry(expiry);
    return showInfo ? `${month}/${year}` : '••/••';
  };

  // Format CVV
  const formatCVV = (cvv: string) => {
    return showInfo ? cvv : '•••';
  };

  // Handle secondary color (fallback if not provided)
  const secondaryColor = card.secondaryColor || adjustColor(card.color, -20);

  return (
    <div className="relative" style={{ height: '220px' }}>
      {/* Toggle visibility button */}
      <button 
        className="absolute right-4 top-4 z-20 bg-white/10 p-2 rounded-full"
        onClick={() => setShowInfo(!showInfo)}
      >
        {showInfo ? (
          <EyeOff className="w-4 h-4 text-white" />
        ) : (
          <Eye className="w-4 h-4 text-white" />
        )}
      </button>
      
      {/* Front of card */}
      <animated.div
        className="bg-gradient-to-br absolute w-full h-full rounded-2xl p-5 backface-hidden"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          backgroundImage: `linear-gradient(to bottom right, ${card.color}, ${secondaryColor})`,
        }}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="text-xl font-semibold tracking-tight text-white">
              {card.name}
            </div>
            <div className="text-white opacity-80">
              {card.brand || 'VISA'}
            </div>
          </div>
          
          <div className="my-8">
            <div className="text-xl tracking-wider text-white font-medium">
              {formatCardNumber(card.cardNumber)}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-white opacity-70 mb-1">VALID THRU</div>
              <div className="text-sm text-white">
                {formatValidThru(card.expiry)}
              </div>
            </div>
            <div className="w-12 h-12">
              {/* Card network logo */}
              <div className="flex space-x-1">
                <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </animated.div>
      
      {/* Back of card */}
      <animated.div
        className="bg-gradient-to-br absolute w-full h-full rounded-2xl backface-hidden overflow-hidden"
        style={{
          opacity,
          transform: transform.to(t => `${t} rotateY(180deg)`),
          backgroundImage: `linear-gradient(to bottom right, ${adjustColor(card.color, 20)}, ${secondaryColor})`,
        }}
      >
        <div className="w-full h-12 bg-neutral-900 my-6" />
        <div className="px-5">
          <div className="bg-white/20 h-10 flex items-center justify-end pr-4 mb-4">
            <div className="text-white font-medium">
              {formatCVV(card.cvv)}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-white">
            <div>
              <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
              <div className="text-sm">{card.cardholderName || userData?.user?.name || 'Card Holder'}</div>
            </div>
            <div className="w-12 h-12">
              {/* Card network logo */}
              <div className="flex space-x-1">
                <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(hex: string, amount: number): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex color
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  
  // Adjust the brightness
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default CreditCardComponent;
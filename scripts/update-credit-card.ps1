Set-Content -Path './components/ui/card/CreditCard.tsx' -Value '// components/ui/card/CreditCard.tsx
''use client'';

import React, { useEffect, useRef } from ''react'';
import { animated, useSpring } from ''react-spring'';
import { Info } from ''lucide-react'';
import { CardType } from ''@/lib/types'';
import { useBankingData } from ''@/components/preloaders/BankingDataPreloader'';

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
  
  // Get banking data if available
  const { data } = useBankingData();
  
  // Create spring animation for the info panel
  const infoSpring = useSpring({
    height: showInfo ? ''auto'' : 0,
    opacity: showInfo ? 1 : 0,
    marginTop: showInfo ? 8 : 0,
    config: { 
      tension: 280, 
      friction: 25
    }
  });

  // Get card info from banking data if available
  const cardInfo = data?.creditCards?.find(c => c.userId === ''user1'');
  const availableCredit = cardInfo?.availableCredit || 3914.65;
  const minimumPayment = cardInfo?.minimumPayment || 0.00;
  const dueDate = cardInfo?.dueDate ? new Date(cardInfo.dueDate).toLocaleDateString(''en-US'', {
    month: ''numeric'',
    day: ''numeric'',
    year: ''numeric''
  }) : ''5/25/2025'';
  const cardNumber = cardInfo?.cardNumber || card.number;

  return (
    <div className="w-full" ref={cardRef}>
      {/* Credit Card with balance directly inside */}
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.01]"
        style={{
          backgroundColor: ''#7b2528'', // Keep original red color
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
            <div className="grid grid-cols-2">
              <div className="text-gray-300 text-sm">Available Credit:</div>
              <div className="text-right font-medium text-sm">${availableCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              
              <div className="text-gray-300 text-sm">Minimum Payment:</div>
              <div className="text-right font-medium text-sm">${minimumPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              
              <div className="text-gray-300 text-sm">Due Date:</div>
              <div className="text-right font-medium text-sm">{dueDate}</div>
              
              <div className="text-gray-300 text-sm mt-1">AutoPay:</div>
              <div className="text-right font-medium text-sm mt-1">
                ON | <a href="#" className="text-neutral-400 hover:underline">Settings</a>
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

export default CreditCard;' -Force

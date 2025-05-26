import React, { useState, useEffect, useRef } from 'react';
import { useBankingData } from '@/components/context/BankingDataProvider';

interface CreditCardStackProps {
  onCardChange?: (index: number, cardId?: string) => void;
}

const CreditCardStack = ({ onCardChange }: CreditCardStackProps) => {  const BASE_WIDTH = 767;
  const BASE_HEIGHT = 484;
  const SPACING = 30;
  const EXTRA_DOT_OFFSET = -51; // Adjusted to position dots at ~246px to align with bottom of card stack
  
  const { userData } = useBankingData();
  // Map card types to images - using local images
  const cardTypeImages = {
    "Visa Signature Rewards": "/images/cards/credit/card-sig-rewards.png",
    "Visa Platinum Low Rate": "/images/cards/credit/card-plat-low.png", 
    "Platinum Business Rewards": "/images/cards/credit/card-business-plat-rewards.png",
    "Platinum Rewards": "/images/cards/credit/card-plat-rewards.png",
    "Platinum Secured": "/images/cards/credit/card-plat-secured.png"
  };

  // Get credit cards from banking data
  const creditCards = userData?.creditCards || [];
  
  // Transform credit card data for display
  const cardsData = creditCards.map(card => ({
    cardType: card.name,
    cardImage: cardTypeImages[card.name as keyof typeof cardTypeImages] || cardTypeImages["Platinum Secured"],
    cardHolderName: userData?.user?.name?.toUpperCase() || "CARD HOLDER",
    cardNumber: card.cardNumber,
    expirationDate: card.expiry,
    creditLimit: card.creditLimit,
    currentBalance: card.currentBalance,
    availableCredit: card.availableCredit,
    color: card.color
  }));  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [dragState, setDragState] = useState<{ active: boolean; startX: number; currentX: number; cardIndex: number | null }>({ active: false, startX: 0, currentX: 0, cardIndex: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  // Generate dot colors from card colors or use defaults
  const dotColors = cardsData.length > 0 
    ? cardsData.map(card => card.color || "#95272b")
    : ["#95272b", "#581c5c", "#153366", "#1a6844", "#614b19"];
  // Notify parent when card changes
  useEffect(() => {
    if (onCardChange) {
      const selectedCardId = creditCards[current]?.id;
      onCardChange(current, selectedCardId);
    }
  }, [current, onCardChange, creditCards]);

  // Handle empty state
  if (cardsData.length === 0) {
    return (
      <div className="min-h-screen py-8 overflow-x-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-400 text-lg">No credit cards found</p>
            <p className="text-gray-500 text-sm mt-2">Apply for a credit card to get started</p>
          </div>
        </div>
      </div>
    );
  }// Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newScale = containerRef.current.clientWidth / BASE_WIDTH;
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateLeft = () => {
    setCurrent((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const navigateRight = () => {
    setCurrent((prev) => (prev + 1) % cardsData.length);
  };
  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    e.preventDefault();
    setDragState({
      active: true,
      startX: e.clientX,
      currentX: e.clientX,
      cardIndex: index
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.active) return;
    setDragState(prev => ({ ...prev, currentX: e.clientX }));
  };

  const handlePointerUp = () => {
    if (!dragState.active) return;
    
    const dx = dragState.currentX - dragState.startX;
    if (dx > 80) {
      navigateRight();
    } else if (dx < -80) {
      navigateLeft();
    }
    
    setDragState({ active: false, startX: 0, currentX: 0, cardIndex: null });
  };  const getCardTransform = (index: number) => {
    const pos = (index - current + cardsData.length) % cardsData.length;
    const baseTransform = `translateY(${pos * SPACING}px) scale(${1 - pos * 0.05})`;
    
    if (dragState.active && dragState.cardIndex === index) {
      const dx = dragState.currentX - dragState.startX;
      return `translateX(${dx}px) rotate(${dx / 20}deg)`;
    }
    
    return baseTransform;
  };  const styles = `
    @import url("https://fonts.cdnfonts.com/css/ocr-a-std");
    
    :root {
      --chrome-text-gradient: linear-gradient(
        180deg,
        #fafafa 0%,
        #e5e5e5 30%,
        #aaa 50%,
        #fff 100%
      );
    }
  `;  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="py-14">
        <div className="max-w-4xl mx-auto px-4">

          {/* Container that accounts for both cards and dots */}          <div 
            ref={containerRef}
            className="relative w-full mx-auto"
            style={{ aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}` }}
          ><div
              ref={swiperRef}
              className="absolute top-0 left-0"
              style={{
                width: `${BASE_WIDTH}px`,
                height: `${BASE_HEIGHT}px`,
                perspective: '1000px',
                transformOrigin: 'top left',
                transform: `scale(${scale})`
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >              {/* Cards */}
              {cardsData.map((card, index) => {
                const pos = (index - current + cardsData.length) % cardsData.length;
                const transform = getCardTransform(index);
                const zIndex = cardsData.length - pos;
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
                    style={{
                      zIndex: zIndex,
                      transform: transform,
                      transition: dragState.active && dragState.cardIndex === index ? 'none' : 'transform 0.5s ease',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handlePointerDown(e, index)}
                  >
                    <div className="relative w-full h-full" style={{ filter: 'drop-shadow(0px 10px 12px rgba(0, 0, 0, .15))' }}>
                      <div className="absolute inset-0">                        <img 
                          className="absolute inset-0 w-full h-full object-cover" 
                          src={card.cardImage} 
                          alt={card.cardType}
                          draggable={false}
                        />                        <div 
                          id={`card-number-${index}`}
                          style={{
                            position: 'absolute',
                            top: '58.7%',
                            left: '4.5%',
                            fontSize: '48px',
                            letterSpacing: '-0.3px',
                            fontFamily: '"OCR A Std", monospace',
                            background: 'linear-gradient(180deg, #fafafa 0%, #e5e5e5 30%, #aaa 50%, #fff 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                            filter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))'
                          }}
                        >
                          {card.cardNumber}
                        </div>
                        <div 
                          id={`card-expiration-${index}`}
                          style={{
                            position: 'absolute',
                            bottom: '11.4%',
                            left: '37.8%',
                            fontSize: '38px',
                            fontFamily: '"OCR A Std", monospace',
                            background: 'linear-gradient(180deg, #fafafa 0%, #e5e5e5 30%, #aaa 50%, #fff 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                            filter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))'
                          }}
                        >
                          {card.expirationDate}
                        </div>
                        <div 
                          id={`card-holder-${index}`}
                          style={{
                            position: 'absolute',
                            bottom: '1.5%',
                            left: '5%',
                            fontSize: '38px',
                            fontFamily: '"OCR A Std", monospace',
                            background: 'linear-gradient(180deg, #fafafa 0%, #e5e5e5 30%, #aaa 50%, #fff 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                            filter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))'
                          }}
                        >
                          {card.cardHolderName}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Navigation Arrows */}
              <button
                onClick={navigateLeft}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-20 h-20 bg-black bg-opacity-40 hover:bg-opacity-55 rounded-full flex items-center justify-center z-50 transition-colors"
              >
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path d="M15 19L8 12l7-7" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={navigateRight}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-20 h-20 bg-black bg-opacity-40 hover:bg-opacity-55 rounded-full flex items-center justify-center z-50 transition-colors"
              >
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
              </button>            </div>            {/* Dots */}            <div 
              className="absolute w-full left-0 flex justify-center select-none py-3"
              style={{
                top: `${(BASE_HEIGHT + SPACING * (cardsData.length - 1) + EXTRA_DOT_OFFSET) * scale}px`
              }}
            >              {cardsData.map((_, index) => {
                const dotSize = Math.round(56 * scale); // Doubled from 28 to 56
                return (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className="cursor-pointer transition-opacity duration-300"
                    style={{ 
                      opacity: current === index ? 1 : 0.6,
                      margin: `0 ${8 * scale}px`,
                      padding: `${4 * scale}px`
                    }}
                  >
                    <svg 
                      width={dotSize}
                      height={dotSize}
                      viewBox="0 0 18 18" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'block' }}
                    >
                      {/* Inner circle */}
                      <circle 
                        cx="9" 
                        cy="9" 
                        r="5" 
                        fill={dotColors[index]}
                      />
                      {/* Outer ring - only visible when active */}
                      {current === index && (
                        <circle 
                          cx="9" 
                          cy="9" 
                          r="8" 
                          fill="none" 
                          stroke="white" 
                          strokeWidth="2" 
                          opacity="0.5"
                        />
                      )}
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditCardStack;

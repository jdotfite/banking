'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBankingData } from '@/components/context/BankingDataProvider';

interface SimpleCardsViewProps {
  selectedCardId?: string | null;
}

const SimpleCardsView: React.FC<SimpleCardsViewProps> = ({ selectedCardId }) => {
  const { userData } = useBankingData();
  const creditCards = userData?.creditCards || [];
  
  const BASE_WIDTH = 767;
  const BASE_HEIGHT = 484;
  const SPACING = 30;
  const DOT_AREA_HEIGHT = 60; // Height reserved for dots and spacing
  const DOT_TOP_MARGIN = 20; // Space between last card and dots

  // Default card type images mapping
  const cardTypeImages = {
    "Platinum Secured": "/images/cards/credit/card-plat-secured.png",
    "Platinum Business Rewards": "/images/cards/credit/card-business-plat-rewards.png",
    "Platinum Low Rate": "/images/cards/credit/card-plat-low.png",
    "Signature Rewards": "/images/cards/credit/card-sig-rewards.png",
    "Platinum Rewards": "/images/cards/credit/card-plat-rewards.png",
    "Visa Signature Rewards": "/images/cards/credit/card-sig-rewards.png",
    "Visa Platinum Low Rate": "/images/cards/credit/card-plat-low.png"
  };

  // Map banking data to card stack format
  const cardsData = creditCards.map(card => ({
    id: card.id,
    cardType: card.name,
    cardImage: (cardTypeImages as Record<string, string>)[card.name] || cardTypeImages["Signature Rewards"],
    cardHolderName: userData?.user?.name?.toUpperCase() || "CARD HOLDER",
    cardNumber: card.cardNumber || "**** **** **** ****",
    expirationDate: card.expiry || "00/00",
    currentBalance: card.currentBalance,
    availableCredit: card.availableCredit,
    dueDate: card.dueDate,
    color: card.color
  }));

  // Calculate dynamic heights based on number of cards (after cardsData is defined)
  const calculateDimensions = () => {
    const stackHeight = BASE_HEIGHT + (SPACING * (cardsData.length - 1));
    const totalHeight = stackHeight + DOT_TOP_MARGIN + DOT_AREA_HEIGHT;
    const dotsTopPosition = stackHeight + DOT_TOP_MARGIN;
    
    return {
      stackHeight,
      totalHeight, 
      dotsTopPosition
    };
  };

  const { stackHeight, totalHeight, dotsTopPosition } = calculateDimensions();

  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(1);
  const [dragState, setDragState] = useState<{ 
    active: boolean; 
    startX: number; 
    currentX: number; 
    cardIndex: number | null;
  }>({ active: false, startX: 0, currentX: 0, cardIndex: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  const dotColors = ["#95272b", "#581c5c", "#153366", "#1a6844", "#614b19"];

  // Find initial card index based on selectedCardId
  useEffect(() => {
    if (selectedCardId && cardsData.length > 0) {
      const selectedIndex = cardsData.findIndex(card => card.id === selectedCardId);
      if (selectedIndex !== -1) {
        setCurrent(selectedIndex);
        console.log("🎯 Pre-selecting card:", selectedCardId, "at index:", selectedIndex);
      }
    }
  }, [selectedCardId, cardsData.length]);
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Account for horizontal padding
        const availableWidth = containerWidth - 32; // 16px padding on each side
        const scaleByWidth = availableWidth / BASE_WIDTH;
        
        // Also consider height constraints to prevent overflow
        const maxHeight = window.innerHeight * 0.7; // Use 70% of viewport height
        const scaleByHeight = maxHeight / totalHeight;
        
        // Use the smaller scale to ensure everything fits, but allow scaling up to 1
        const newScale = Math.min(scaleByWidth, scaleByHeight, 1);
        setScale(Math.max(newScale, 0.3)); // Minimum scale of 0.3
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [totalHeight]);

  if (cardsData.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No Credit Cards Found</h2>
          <p className="text-neutral-400">Please check your account or add a credit card.</p>
        </div>
      </div>
    );
  }

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
  };

  const getCardTransform = (index: number) => {
    const pos = (index - current + cardsData.length) % cardsData.length;
    const baseTransform = `translateY(${pos * SPACING}px) scale(${1 - pos * 0.05})`;
    
    if (dragState.active && dragState.cardIndex === index) {
      const dx = dragState.currentX - dragState.startX;
      return `translateX(${dx}px) rotate(${dx / 20}deg)`;
    }
    
    return baseTransform;
  };

  const styles = `
    :root {
      --chrome-text-gradient: linear-gradient(
        180deg,
        #fafafa 0%,
        #e5e5e5 30%,
        #aaa 50%,
        #fff 100%
      );
    }
  `;

  const currentCard = cardsData[current];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Header */}
      <div className="p-4 pb-2 border-b border-neutral-800 relative">
        <button 
          onClick={() => window.location.href = '/home'}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">My Cards</h1>
          <p className="text-neutral-400 text-sm">Swipe or drag to view your cards</p>
        </div>
      </div>      {/* Card Stack */}
      <div className="py-6">
        <div className="px-4 mx-auto max-w-6xl">
          <div 
            ref={containerRef}
            className="relative w-full mx-auto"
            style={{ 
              height: `${totalHeight * scale}px`,
              width: '100%'
            }}
          >
            <div
              ref={swiperRef}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{
                width: `${BASE_WIDTH}px`,
                height: `${stackHeight}px`,
                perspective: '1000px',
                transformOrigin: 'top center',
                transform: `scale(${scale})`
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Cards */}
              {cardsData.map((card, index) => {
                const pos = (index - current + cardsData.length) % cardsData.length;
                return (
                  <div
                    key={card.id}
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
                    style={{
                      zIndex: cardsData.length - pos,
                      transform: getCardTransform(index),
                      transition: dragState.active && dragState.cardIndex === index ? 'none' : 'transform 0.5s ease',
                      touchAction: 'none'
                    }}
                    onPointerDown={(e) => handlePointerDown(e, index)}
                  >
                    <div className="relative w-full h-full" style={{ filter: 'drop-shadow(0px 10px 12px rgba(0, 0, 0, .15))' }}>
                      <div className="absolute inset-0">
                        <img 
                          className="absolute inset-0 w-full h-full object-cover" 
                          src={card.cardImage} 
                          alt={card.cardType}
                          draggable={false}
                        />
                        
                        <div 
                          className="absolute ocr-font"
                          style={{
                            top: '58.7%',
                            left: '4.5%',
                            fontSize: '48px',
                            letterSpacing: '-0.3px',
                            background: 'var(--chrome-text-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitFilter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))',
                            willChange: 'transform'
                          }}
                        >
                          {card.cardNumber}
                        </div>
                        
                        <div 
                          className="absolute ocr-font"
                          style={{
                            bottom: '11.4%',
                            left: '37.8%',
                            fontSize: '38px',
                            background: 'var(--chrome-text-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitFilter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))',
                            willChange: 'transform'
                          }}
                        >
                          {card.expirationDate}
                        </div>
                        
                        <div 
                          className="absolute ocr-font"
                          style={{
                            bottom: '1.5%',
                            left: '5%',
                            fontSize: '38px',
                            background: 'var(--chrome-text-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitFilter: 'drop-shadow(0 0.7px 1.8px rgba(0, 0, 0, 1))',
                            willChange: 'transform'
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
                className="absolute left-3 bg-black bg-opacity-40 hover:bg-opacity-55 rounded-full flex items-center justify-center z-50 transition-colors"
                style={{
                  top: `${BASE_HEIGHT / 2 - 40}px`,
                  width: '80px',
                  height: '80px'
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path d="M15 19L8 12l7-7" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={navigateRight}
                className="absolute right-3 bg-black bg-opacity-40 hover:bg-opacity-55 rounded-full flex items-center justify-center z-50 transition-colors"
                style={{
                  top: `${BASE_HEIGHT / 2 - 40}px`,
                  width: '80px',
                  height: '80px'
                }}              >
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {/* Dots - positioned outside scaled container */}
            <div 
              className="absolute w-full left-0 flex justify-center select-none"
              style={{
                top: `${(stackHeight + DOT_TOP_MARGIN) * scale}px`
              }}
            >
              {cardsData.map((_, index) => {
                const dotSize = 28; // Fixed size, not scaled
                return (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className="cursor-pointer transition-opacity duration-300"
                    style={{ 
                      opacity: current === index ? 1 : 0.6,
                      margin: `0 8px`,
                      padding: `4px`
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
                        fill={dotColors[index % dotColors.length]}
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

      {/* Card Info */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">{currentCard.cardType}</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-neutral-400 mb-1">Current Balance</p>
                <p className="text-lg font-bold">
                  ${currentCard.currentBalance?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Available Credit</p>
                <p className="text-lg font-bold">
                  ${currentCard.availableCredit?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Due Date</p>
                <p className="font-medium">{currentCard.dueDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Credit Limit</p>
                <p className="font-medium">
                  ${((currentCard.currentBalance || 0) + (currentCard.availableCredit || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 rounded-xl p-4 font-medium transition-colors">
                Make Payment
              </button>
              <button className="bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 font-medium transition-colors">
                Manage Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCardsView;

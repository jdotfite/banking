import React, { useState, useEffect, useRef } from 'react';
import { useBankingData } from '@/components/context/BankingDataProvider';

interface CreditCardStackProps {
  onCardChange?: (index: number, cardId?: string) => void;
}

const CreditCardStack = ({ onCardChange }: CreditCardStackProps) => {
  const BASE_WIDTH = 767;
  const BASE_HEIGHT = 420;
  const SPACING = 30;
  const CARD_RADIUS = 20;
  
  const { userData } = useBankingData();

  // Card type configuration with colors matching CodePen
  const cardColors = {
    "Platinum Secured": "#732b7b",
    "Platinum Business Rewards": "#98999a", 
    "Signature Rewards": "#b22326",
    "Platinum Rewards": "#24427a",
    "Platinum Low Rate": "#3086a0",
    "Visa Signature Rewards": "#b22326",
    "Visa Platinum Low Rate": "#3086a0"
  };

  // Get credit cards from banking data
  const creditCards = userData?.creditCards || [];
  
  // Transform credit card data for display
  const cardsData = creditCards.map(card => ({
    cardType: card.name,
    cardColor: cardColors[card.name as keyof typeof cardColors] || cardColors["Signature Rewards"],
    cardHolderName: userData?.user?.name?.toUpperCase() || "CARD HOLDER",
    cardNumber: card.cardNumber,
    expirationDate: card.expiry,
    creditLimit: card.creditLimit,
    currentBalance: card.currentBalance,
    availableCredit: card.availableCredit,
    id: card.id
  }));

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

  // Logo SVG from CodePen
  const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
    <defs><style>.cls-1{fill:#fff;stroke-width:0}</style></defs>
    <path d="M0 0h1024v1024H0z" style="fill:#ee3831;stroke-width:0"/>
    <g>
      <path d="M817.2 775.82c-1.84-.48-3.62-1.16-5.3-2.04-.8-.38-1.66-.71-2.41-1.14a37.208 37.208 0 0 1-5.49-3.83 27.326 27.326 0 0 1-10.6-22.06l.24-536.62c0-3.53-2.86-6.39-6.39-6.39h-91.78c-4.4-.1-8.47 2.28-10.56 6.15L626.74 327.8c-.65 1.31-.12 2.9 1.19 3.56.37.18.77.28 1.18.28h38.34c8.42-.05 15.32 6.68 15.48 15.1V746.7c.1 8.6-3.82 16.76-10.6 22.06-1.73 1.42-3.56 2.7-5.49 3.83l-2.41 1.14c-1.69.87-3.47 1.55-5.3 2.04-.54.15-1.06.36-1.56.62v18.65l.28.28h160.13l.28-.28v-18.65c-.48-.27-.99-.47-1.51-.62" class="cls-1"/>
      <path d="m487.2 703.21-180.1-306c-.32-.44-.6-.89-.85-1.37-1.42 0-1.75 1.04-1.94 1.99-.07.96-.07 1.93 0 2.89v344.73a27.493 27.493 0 0 0 10.6 22.2c4.31 3.51 9.33 6.03 14.72 7.38v19.17H170.54v-18.93c2.89-1.33 5.82-2.6 8.52-4.02 2.96-1.66 5.79-3.54 8.47-5.63a17.93 17.93 0 0 0 6.96-15.05v-505.5c.39-7-2.43-13.8-7.67-18.46a35.094 35.094 0 0 0-13.77-7.67c-1.18-.33-2.32-.43-3.88-.71.24-5.02.33-9.99.43-14.86h144.55c8.71-.02 16.64 5 20.35 12.87L520 533.32l65.98-134.14a7.666 7.666 0 0 1 6.77-4.17h41.37c1.52-.02 2.76 1.2 2.78 2.71 0 .42-.09.84-.27 1.22m225.92-120.78a25.44 25.44 0 0 0-6.34-4.4 58.442 58.442 0 0 0-8.09-3.5c-2.98-1.04-5.35-1.94-7.19-2.75-1.67-.67-3.26-1.52-4.73-2.56a9.47 9.47 0 0 1-2.84-3.41 11.66 11.66 0 0 1-.95-4.73c-.04-2.5 1-4.89 2.84-6.58 2.22-1.91 5.08-2.89 8-2.75 4.03 0 7.87 1.73 10.56 4.73 3.04 3.28 5.02 7.41 5.68 11.83v.47h5.44l-1.04-23.43h-5.49l-1.37 3.46a25.015 25.015 0 0 0-5.96-2.27c-2.53-.71-5.14-1.07-7.76-1.09a21.297 21.297 0 0 0-15.9 6.06c-3.87 3.76-6.08 8.9-6.15 14.29-.09 3.01.55 5.99 1.85 8.71 1.16 2.37 2.77 4.49 4.73 6.25a26.63 26.63 0 0 0 6.34 3.98c2.2 1.05 4.46 1.97 6.77 2.75 2.46.8 4.73 1.66 6.86 2.56 1.82.71 3.54 1.67 5.11 2.84 1.26.94 2.28 2.15 2.98 3.55.68 1.48 1.02 3.1.99 4.73.21 3.11-.95 6.15-3.17 8.33-2.58 2.1-5.86 3.15-9.18 2.93-2.7.05-5.35-.66-7.67-2.04a22.407 22.407 0 0 1-5.87-5.06c-1.6-2-2.93-4.19-3.98-6.53-.97-1.99-1.71-4.09-2.18-6.25v-.47h-5.4l.66 25.23h5.73l1.18-4.17c1.94 1.4 4.01 2.59 6.2 3.55 9.31 4.05 20.1 2.49 27.88-4.02 4.51-4.14 7-10.03 6.82-16.14.07-2.85-.44-5.69-1.51-8.33-.96-2.27-2.38-4.32-4.17-6.01m53.9 25.89c-1.4.44-2.84.7-4.31.76-1.57.2-3.15.31-4.73.33-1.79.15-3.58-.11-5.25-.76a6.297 6.297 0 0 1-2.84-2.84c-.73-1.48-1.18-3.09-1.33-4.73 0-1.99-.28-45.06-.28-45.06h18.08v-8.47h-18.22v-21.58h-12.78v21.58h-11.74v7.86h11.45v46.29c-.27 4.52.93 9 3.41 12.78 2.88 3.37 7.22 5.14 11.64 4.73 3.21.07 6.4-.37 9.47-1.33 2.46-.9 5.16-1.94 7.95-3.22h.33v-6.63l-.85.28Zm-32.82 460.46h3.28c3.71 0 6.9-1.35 6.9-4.88 0-2.48-1.81-4.97-6.9-4.97-1.1 0-2.2.08-3.28.25v9.6Zm0 15.71h-4.55V751.6c2.66-.44 5.85-.67 8.04-.67s6.19.53 8.84 2.15a6.723 6.723 0 0 1 2.57 5.85 7.024 7.024 0 0 1-5.52 6.9v.25c2.48.42 4.21 2.69 4.76 6.9.24 2.4.83 4.76 1.77 6.99h-4.88a20.28 20.28 0 0 1-1.94-7.24c-.15-2.93-2.44-4.98-5.53-4.98s-3.73.01-3.73.01l.17 12.21Z" class="cls-1"/>
      <path d="M889 737.05c-15.69 0-28.4 12.72-28.4 28.4s12.72 28.4 28.4 28.4 28.4-12.72 28.4-28.4-12.72-28.4-28.4-28.4Zm0 53.02c-13.59 0-24.61-11.02-24.61-24.61s11.02-24.61 24.61-24.61 24.61 11.02 24.61 24.61-11.02 24.61-24.61-24.61Z" class="cls-1"/>
    </g>
  </svg>`;

  // Triangle SVG from CodePen
  const triangleSVG = `<svg viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0 L20 20 L0 20 Z"/>
  </svg>`;

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
      <div className="min-h-screen py-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-400 text-lg">No credit cards found</p>
            <p className="text-gray-500 text-sm mt-2">Apply for a credit card to get started</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle resize and scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newScale = containerRef.current.clientWidth / BASE_WIDTH;
        setScale(newScale);
        
        // Calculate stack height and update container
        const stackHeight = BASE_HEIGHT + SPACING * (cardsData.length - 1);
        containerRef.current.style.height = `${stackHeight * newScale}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardsData.length]);

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
      navigateLeft();
    } else if (dx < -80) {
      navigateRight();
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

  // Navigation UI logic with dark theme
  const renderNavigation = () => {
    // Hide navigation if only one card
    if (cardsData.length <= 1) {
      return null;
    }

    return (
      <div className="flex justify-center items-center ">
        <button
          onClick={navigateLeft}
          className="nav-arrow nav-arrow-left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path d="M15 19L8 12l7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Navigation middle section */}
        <div className="mx-4">
          {cardsData.length >= 6 ? (
            // Show counter for lots of cards
            <span className="nav-counter">
              {current + 1} of {cardsData.length}
            </span>
          ) : (
            // Show dot navigation for smaller sets
            <div className="nav-dots">
              {cardsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`nav-dot ${i === current ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={navigateRight}
          className="nav-arrow nav-arrow-right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  };

  const styles = `
    @import url("https://fonts.cdnfonts.com/css/ocr-a-std");
    
    :root {
      --m1-red: #ee3831;
      --card-width: 767px;
      --card-height: 420px;
      --stack-spacing: 30px;
      --card-radius: 20px;
      --font-ocr: "OCR A Std", monospace;
      --font-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --nav-size: 2.85rem;
      --dot-size: 1.5rem;
    }

    .card-wrapper {
      position: absolute;
      inset: 0;
      border-radius: var(--card-radius);
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      transition: transform 0.5s ease;
      touch-action: none;
      cursor: grab;
    }

    .card-wrapper:active {
      cursor: grabbing;
    }

    .card-wrapper.dragging {
      transition: none;
    }

    .card-container {
      position: relative;
      width: 100%;
      height: 100%;
      filter: drop-shadow(0px 10px 12px rgba(0, 0, 0, 0.15));
    }

    .card-bg {
      position: absolute;
      inset: 0;
      border-radius: var(--card-radius);
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.4) 16%,
        rgba(0, 0, 0, 0.46) 22%,
        rgba(0, 0, 0, 0.49) 36%,
        rgba(0, 0, 0, 0.48) 40%,
        rgba(0, 0, 0, 0.4) 52%,
        rgba(0, 0, 0, 0.28) 70%,
        rgba(0, 0, 0, 0.25) 90%,
        rgba(0, 0, 0, 0.28) 100%
      );
      border-radius: var(--card-radius);
      pointer-events: none;
      z-index: 1;
    }

    .brushed-metal {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
          0deg,
          hsla(0, 0%, 100%, 0) 0%,
          hsla(0, 0%, 100%, 0) 6%,
          hsla(0, 0%, 100%, 0.25) 7.5%
        ),
        repeating-linear-gradient(
          0deg,
          hsla(0, 0%, 0%, 0) 0%,
          hsla(0, 0%, 0%, 0) 4%,
          hsla(0, 0%, 0%, 0.08) 4.5%
        ),
        repeating-linear-gradient(
          0deg,
          hsla(0, 0%, 100%, 0) 0%,
          hsla(0, 0%, 100%, 0) 1.2%,
          hsla(0, 0%, 100%, 0.3) 2.2%
        ),
        repeating-linear-gradient(
          0deg,
          hsla(0, 0%, 100%, 0) 0%,
          hsla(0, 0%, 100%, 0) 0.5%,
          hsla(0, 0%, 100%, 0.15) 1%
        ),
        linear-gradient(
          0deg,
          hsl(0, 0%, 85%) 0%,
          hsl(0, 0%, 95%) 47%,
          hsl(0, 0%, 85%) 53%,
          hsl(0, 0%, 75%) 100%
        );
      mix-blend-mode: color-burn;
      opacity: 0.5;
      z-index: 2;
    }

    .card-type {
      position: absolute;
      top: 9%;
      left: 4.5%;
      font-family: var(--font-system);
      font-size: 28px;
      font-weight: 500;
      font-style: italic;
      white-space: nowrap;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 4;
    }

    .card-logo {
      position: absolute;
      top: 0;
      right: 9.5%;
      width: 96px;
      height: auto;
      z-index: 3;
    }

    .card-triangle {
      position: absolute;
      top: 25%;
      left: 0;
      width: 50px;
      height: 50px;
      z-index: 3;
      transform: rotate(90deg);
    }

    .card-number {
      position: absolute;
      top: 50%;
      left: 4.5%;
      font-family: var(--font-ocr);
      font-size: 42px;
      letter-spacing: -0.3px;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      z-index: 4;
    }

    .card-holder {
      position: absolute;
      bottom: 10%;
      left: 5%;
      font-family: var(--font-ocr);
      font-size: 34px;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      z-index: 4;
    }

    /* Dark Theme Navigation */
    .nav-arrow {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgb(38 38 38); /* bg-neutral-800 */
      border: 2px solid rgb(82 82 82); /* border-neutral-600 */
      cursor: pointer;
      margin: 0 1rem;
      transition: all 0.3s ease;
      color: rgb(229 229 229); /* text-neutral-200 */
    }

    .nav-arrow:hover {
      background: #ee3831;
      border-color: #ee3831;
      color: white;
      transform: scale(1.05);
    }

    .nav-arrow:active {
      transform: scale(0.95);
    }

    .nav-counter {
      font-family: var(--font-system);
      font-size: 1.125rem;
      font-weight: 500;
      color: rgb(229 229 229); /* text-neutral-200 */
      background: rgb(38 38 38); /* bg-neutral-800 */
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(82 82 82); /* border-neutral-600 */
    }

    .nav-dots {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .nav-dot {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: rgb(82 82 82); /* bg-neutral-600 */
      border: 2px solid rgb(38 38 38); /* border-neutral-800 */
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .nav-dot:hover {
      background: rgb(115 115 115); /* bg-neutral-500 */
      transform: scale(1.1);
    }

    .nav-dot.active {
      background: #ee3831;
      border-color: rgb(220 38 38); /* border-red-600 */
      transform: scale(1.25);
      box-shadow: 0 0 0 3px rgba(238, 56, 49, 0.2);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="pt-14 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          {/* Container that accounts for both cards and navigation */}
          <div 
            ref={containerRef}
            className="relative w-full mx-auto mb-10"
            style={{ 
              width: `${BASE_WIDTH}px`,
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <div
              ref={swiperRef}
              className="relative"
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
            >
              {/* Cards */}
              {cardsData.map((card, index) => {
                const pos = (index - current + cardsData.length) % cardsData.length;
                const transform = getCardTransform(index);
                const zIndex = cardsData.length - pos;
                const isDragging = dragState.active && dragState.cardIndex === index;
                
                return (
                  <div
                    key={index}
                    className={`card-wrapper ${isDragging ? 'dragging' : ''}`}
                    style={{
                      zIndex: zIndex,
                      transform: transform,
                      transition: isDragging ? 'none' : 'transform 0.5s ease'
                    }}
                    onPointerDown={(e) => handlePointerDown(e, index)}
                  >
                    <div className="card-container">
                      {/* Base card background */}
                      <div className="card-bg" style={{ backgroundColor: card.cardColor }} />
                      
                      {/* Gradient overlay */}
                      <div className="gradient-overlay" />
                      
                      {/* Brushed metal texture */}
                      <div className="brushed-metal" />
                      
                      {/* Card type text */}
                      <div className="card-type">{card.cardType}</div>
                      
                      {/* Logo */}
                      <div 
                        className="card-logo"
                        dangerouslySetInnerHTML={{ __html: logoSVG }}
                      />
                      
                      {/* Triangle element */}
                      <div 
                        className="card-triangle"
                        dangerouslySetInnerHTML={{ __html: triangleSVG }}
                      />
                      
                      {/* Card number */}
                      <div className="card-number">{card.cardNumber}</div>
                      
                      {/* Card holder name */}
                      <div className="card-holder">{card.cardHolderName}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation positioned below the cards */}
          {renderNavigation()}
        </div>
      </div>
    </>
  );
};

export default CreditCardStack;
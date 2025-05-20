'use client';

import React, { useEffect, useState } from 'react';
import { useBankingData } from '@/lib/hooks/useBankingData';
import { BankingCreditCard } from '@/lib/types/bankingDataTypes';

interface CardSelectorProps {
  selectedCardId: string;
  onCardSelect: (cardId: string) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ selectedCardId, onCardSelect }) => {
  const { userData } = useBankingData();
  const [current, setCurrent] = useState(0);
  const [wrappers, setWrappers] = useState<HTMLDivElement[]>([]);
  const [swiperEl, setSwiperEl] = useState<HTMLDivElement | null>(null);
  const [dotsEl, setDotsEl] = useState<HTMLDivElement | null>(null);
  const [cardsData, setCardsData] = useState<BankingCreditCard[]>([]);
  const [startX, setStartX] = useState<number | null>(null);
  const [active, setActive] = useState<HTMLDivElement | null>(null);

  // Constants for styling and animations
  const SPACING = 30;
  const BASE_WIDTH = 767;
  const BASE_HEIGHT = 484;
  const EXTRA_DOT_OFFSET = 40;

  // Map card types to image paths
  const cardTypeImages: Record<string, string> = {
    "Platinum Secured": "/images/cards/credit/card-plat-secured.png",
    "Platinum Business Rewards": "/images/cards/credit/card-business-plat-rewards.png",
    "Platinum Low Rate": "/images/cards/credit/card-plat-low.png",
    "Signature Rewards": "/images/cards/credit/card-sig-rewards.png",
    "Platinum Rewards": "/images/cards/credit/card-plat-rewards.png",
    "Visa Signature Rewards": "/images/cards/credit/card-sig-rewards.png",
    "Visa Platinum Low Rate": "/images/cards/credit/card-plat-low.png"
  };

  // Initialize cards data from banking context
  useEffect(() => {
    if (userData?.creditCards && userData.creditCards.length > 0) {
      setCardsData(userData.creditCards);
      
      // Find the index of the selected card
      const selectedIndex = userData.creditCards.findIndex(card => card.id === selectedCardId);
      if (selectedIndex !== -1) {
        setCurrent(selectedIndex);
      }
    }
  }, [userData?.creditCards, selectedCardId]);

  // Initialize DOM elements
  useEffect(() => {
    const swiperElement = document.getElementById('swiper') as HTMLDivElement;
    const dotsElement = document.getElementById('dots') as HTMLDivElement;
    
    if (swiperElement && dotsElement) {
      setSwiperEl(swiperElement);
      setDotsEl(dotsElement);
    }
  }, []);

  // Build card wrappers and dots
  useEffect(() => {
    if (!swiperEl || !dotsEl || cardsData.length === 0) return;

    // Clear existing content
    swiperEl.innerHTML = '';
    dotsEl.innerHTML = '';
    
    const newWrappers: HTMLDivElement[] = [];

    // Build arrows
    ["left", "right"].forEach(dir => {
      const btn = document.createElement("div");
      btn.className = "arrow " + dir;
      btn.innerHTML = dir === "left"
        ? '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M15 19L8 12l7-7" fill="none" stroke="#fff" stroke-width="2"/></svg>'
        : '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      btn.addEventListener("click", () => {
        const newCurrent = dir === "right"
          ? (current + 1) % cardsData.length
          : (current - 1 + cardsData.length) % cardsData.length;
        setCurrent(newCurrent);
        onCardSelect(cardsData[newCurrent].id);
      });
      swiperEl.appendChild(btn);
    });

    // Build cards and dots
    cardsData.forEach((data, i) => {
      // Card wrapper
      const wrap = document.createElement("div");
      wrap.className = "card-wrapper";
      
      // Get the appropriate card image based on card type
      const cardImage = cardTypeImages[data.name] || cardTypeImages["Signature Rewards"];
      
      wrap.innerHTML = `
        <div class="card-container">
          <div class="card-inner">
            <img class="card-bg" src="${cardImage}" alt="" />
            <div id="card-number-${i}">${data.cardNumber}</div>
            <div id="card-expiration-${i}">${data.expiry}</div>
            <div id="card-holder-${i}">${userData?.user?.name || 'Card Holder'}</div>
          </div>
        </div>
      `;
      swiperEl.appendChild(wrap);
      newWrappers.push(wrap);

      // Dot
      const dot = document.createElement("div");
      dot.className = "dot";
      
      // Use card color for the dot if available, otherwise use default colors
      const dotColors = ["#95272b", "#581c5c", "#153366", "#1a6844", "#614b19"];
      dot.style.background = data.color || dotColors[i % dotColors.length];
      
      dot.addEventListener("click", () => { 
        setCurrent(i); 
        onCardSelect(cardsData[i].id);
      });
      dotsEl.appendChild(dot);
    });

    setWrappers(newWrappers);

    // Add swipe gesture handlers
    newWrappers.forEach(w => {
      w.addEventListener("pointerdown", (e: PointerEvent) => {
        e.preventDefault();
        setActive(w);
        setStartX(e.clientX);
        w.setPointerCapture(e.pointerId);
        w.style.transition = "none";
      });
    });

    const handlePointerMove = (e: PointerEvent) => {
      if (!active || startX === null) return;
      const dx = e.clientX - startX;
      active.style.transform = `translateX(${dx}px) rotate(${dx/20}deg)`;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!active || startX === null) return;
      active.style.transition = "transform 0.5s ease";
      const dx = e.clientX - startX;
      
      if (dx > 80) {
        const newCurrent = (current + 1) % cardsData.length;
        setCurrent(newCurrent);
        onCardSelect(cardsData[newCurrent].id);
      } else if (dx < -80) {
        const newCurrent = (current - 1 + cardsData.length) % cardsData.length;
        setCurrent(newCurrent);
        onCardSelect(cardsData[newCurrent].id);
      }
      
      setActive(null);
      setStartX(null);
    };

    window.addEventListener("pointermove", handlePointerMove as unknown as EventListener);
    window.addEventListener("pointerup", handlePointerUp as unknown as EventListener);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove as unknown as EventListener);
      window.removeEventListener("pointerup", handlePointerUp as unknown as EventListener);
    };
  }, [swiperEl, dotsEl, cardsData, current, onCardSelect, userData?.user?.name]);

  // Update display when current card changes
  useEffect(() => {
    if (wrappers.length === 0) return;
    
    wrappers.forEach((w, i) => {
      const pos = (i - current + cardsData.length) % cardsData.length;
      w.style.zIndex = `${cardsData.length - pos}`;
      w.style.transform = `translateY(${pos * SPACING}px) scale(${1 - pos * 0.05})`;
    });
    
    if (dotsEl) {
      Array.from(dotsEl.children).forEach((d, i) => {
        if (i === current) {
          d.classList.add("active");
        } else {
          d.classList.remove("active");
        }
      });
    }
  }, [current, wrappers, cardsData.length, dotsEl]);

  // Scale swiper based on container width
  useEffect(() => {
    const scaleSwiper = () => {
      const container = document.querySelector(".swiper-container");
      if (!container || !swiperEl || !dotsEl) return;
      
      const scale = container.clientWidth / BASE_WIDTH;
      if (swiperEl) {
        swiperEl.style.transform = `scale(${scale})`;
      }
      
      // Place dots beneath stack
      const totalStack = SPACING * (cardsData.length - 1);
      const baseTop = BASE_HEIGHT + totalStack + EXTRA_DOT_OFFSET;
      dotsEl.style.top = `${baseTop * scale}px`;
    };
    
    scaleSwiper();
    window.addEventListener("resize", scaleSwiper);
    
    return () => {
      window.removeEventListener("resize", scaleSwiper);
    };
  }, [cardsData.length, swiperEl, dotsEl]);

  return (
    <div className="swiper-container">
      <div id="swiper"></div>
      <div id="dots"></div>
    </div>
  );
};

export default CardSelector;

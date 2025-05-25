'use client';

// Temporary version with React hooks removed/minimized for testing
import React, { useEffect } from 'react';
import './CardSelector.css';

// Hard-coded data for testing
const SAMPLE_CARDS = [
  {
    id: "card1",
    name: "Platinum Rewards",
    cardNumber: "4242 •••• •••• 4242",
    currentBalance: 1250.75,
    availableCredit: 3749.25,
    dueDate: "2025-06-15",
    expiry: "05/28",
    userId: "user1",
    color: "#95272b",
    image: "/images/cards/credit/card-plat-rewards.png"
  },
  {
    id: "card2",
    name: "Signature Rewards",
    cardNumber: "5353 •••• •••• 5353", 
    currentBalance: 850.50,
    availableCredit: 4149.50,
    dueDate: "2025-06-20",
    expiry: "09/27",
    userId: "user1",
    color: "#581c5c",
    image: "/images/cards/credit/card-sig-rewards.png"
  },
  {
    id: "card3",
    name: "Platinum Low Rate",
    cardNumber: "6464 •••• •••• 6464",
    currentBalance: 325.00,
    availableCredit: 2675.00,
    dueDate: "2025-06-25",
    expiry: "11/26",
    userId: "user1",
    color: "#153366",
    image: "/images/cards/credit/card-plat-low.png"
  }
];

const USER = {
  name: "John Doe",
  id: "user1"
};

interface IntegratedCardsViewTempProps {
  selectedCardId?: string | null;
}

const IntegratedCardsViewTemp: React.FC<IntegratedCardsViewTempProps> = ({ selectedCardId }) => {
  console.log("🔧 IntegratedCardsViewTemp component is loading!");
  console.log("🔧 Selected card ID prop:", selectedCardId);
    // Initialize vanilla JS card slider on mount
  useEffect(() => {
    console.log("🔧 useEffect running, setting up card slider in 300ms");    // Give some time for DOM to be fully rendered
    const timer = setTimeout(() => {
      console.log("🔧 Timer fired, calling initializeCardSlider");
      initializeCardSlider();
    }, 300);
    
    return () => {
      console.log("🔧 useEffect cleanup");
      clearTimeout(timer);
    };
  }, []);
    // Vanilla JS function to initialize card slider without React state
  const initializeCardSlider = () => {
    console.log("🔧 initializeCardSlider starting");
    console.log("🔧 Sample cards data:", SAMPLE_CARDS);
    
    const cards = SAMPLE_CARDS;
    const user = USER;
    
    // Constants for card sizing and positioning
    const SPACING = 30;
    const BASE_WIDTH = 767;
    const BASE_HEIGHT = 484;
    const EXTRA_DOT_OFFSET = 40;
    
    console.log("🔧 Configuration:", { SPACING, BASE_WIDTH, BASE_HEIGHT, EXTRA_DOT_OFFSET });
    
    // Get DOM elements
    const swiperEl = document.getElementById('swiper');
    const dotsEl = document.getElementById('dots');
    const cardInfoEl = document.getElementById('card-info');
    
    console.log("🔧 DOM elements found:", { 
      swiperEl: !!swiperEl, 
      dotsEl: !!dotsEl, 
      cardInfoEl: !!cardInfoEl,
      cardsLength: cards.length 
    });
    
    if (!swiperEl || !dotsEl || !cardInfoEl || cards.length === 0) {
      console.error("🔧 ERROR: Missing required DOM elements or card data");
      return;
    }      // Clear existing content
    console.log("🔧 Clearing existing content");
    swiperEl.innerHTML = '';
    dotsEl.innerHTML = '';    // Initial card index - check if we have a selectedCardId
    let current = 0;
    
    // Find the index of the selected card if provided
    if (selectedCardId) {
      const selectedIndex = cards.findIndex(card => card.id === selectedCardId);
      if (selectedIndex !== -1) {
        current = selectedIndex;
        console.log("🔧 Pre-selecting card with ID:", selectedCardId, "at index:", current);
      } else {
        console.log("🔧 Selected card ID not found:", selectedCardId, "using default index 0");
      }
    }
    
    const wrappers: HTMLDivElement[] = [];
    
    console.log("🔧 Initial state: current =", current, "wrappers array created");// Update display function
    function updateDisplay() {
      console.log("🔧 === updateDisplay START ===");
      console.log("🔧 updateDisplay called, current:", current, "total cards:", cards.length);
      console.log("🔧 wrappers length:", wrappers.length);
      
      wrappers.forEach((w, i) => {
        const pos = (i - current + cards.length) % cards.length;
        const newTransform = `translateY(${pos * SPACING}px) scale(${1 - pos * 0.05})`;
        const newZIndex = cards.length - pos;
        
        console.log(`🔧 Card ${i}: pos=${pos}, zIndex=${newZIndex}, transform="${newTransform}"`);
        console.log(`🔧 Card ${i} BEFORE: transform="${w.style.transform}", zIndex="${w.style.zIndex}"`);
        
        w.style.zIndex = `${newZIndex}`;
        w.style.transform = newTransform;
        
        console.log(`🔧 Card ${i} AFTER: transform="${w.style.transform}", zIndex="${w.style.zIndex}"`);
      });
      
      if (dotsEl) {
        Array.from(dotsEl.children).forEach((d, i) => {
          const isActive = i === current;
          d.classList.toggle("active", isActive);
          console.log(`🔧 Dot ${i}: active=${isActive}`);
        });
      }
      
      console.log("🔧 === updateDisplay END ===");
    }
      // Function to update card info without React state
    function updateCardInfo(card: any) {
      if (!card || !cardInfoEl) return;
      
      // Create date formatter
      const dateFormatter = new Intl.DateTimeFormat(navigator.language);
      
      // Find elements by data attributes
      const nameEl = cardInfoEl.querySelector('[data-card-name]');
      const numberEl = cardInfoEl.querySelector('[data-card-number]');
      const balanceEl = cardInfoEl.querySelector('[data-current-balance]');
      const creditEl = cardInfoEl.querySelector('[data-available-credit]');
      const dueDateEl = cardInfoEl.querySelector('[data-due-date]');
      
      // Update text content directly
      if (nameEl) nameEl.textContent = card.name || 'Card';
      if (numberEl) numberEl.textContent = card.cardNumber || '•••• ••••';
      if (balanceEl) balanceEl.textContent = `$${card.currentBalance?.toFixed(2) || '0.00'}`;
      if (creditEl) creditEl.textContent = `$${card.availableCredit?.toFixed(2) || '0.00'}`;
      
      if (dueDateEl) {
        try {
          const date = new Date(card.dueDate);
          dueDateEl.textContent = dateFormatter.format(date);
        } catch (e) {
          console.error('Error formatting date:', e);
          dueDateEl.textContent = 'N/A';
        }
      }
      
      // Update quick action links
      const cardActionsEl = document.getElementById('card-actions');
      if (cardActionsEl) {
        const manageLink = cardActionsEl.querySelector('a[data-action="manage"]') as HTMLAnchorElement;
        if (manageLink) {
          manageLink.href = `/cards/manage/${card.id}`;
        }
      }
      
      // Add visual feedback for update
      cardInfoEl.classList.add('card-info-updated');
      setTimeout(() => {
        cardInfoEl.classList.remove('card-info-updated');
      }, 500);
    }
      // Build navigation arrows
    ["left", "right"].forEach(dir => {
      const btn = document.createElement("div");
      btn.className = "arrow " + dir;
      btn.innerHTML = dir === "left"
        ? '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M15 19L8 12l7-7" fill="none" stroke="#fff" stroke-width="2"/></svg>'
        : '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2"/></svg>';
        
      btn.addEventListener("click", () => {
        current = dir === "right"
          ? (current + 1) % cards.length
          : (current - 1 + cards.length) % cards.length;
        updateDisplay();
      });
      swiperEl.appendChild(btn);
    });
      // Build cards and dots
    console.log("🔧 Building cards and dots for", cards.length, "cards");
    cards.forEach((data, i) => {
      console.log(`🔧 Creating card ${i}:`, data.name);
      
      // Card wrapper
      const wrap = document.createElement("div");
      wrap.className = "card-wrapper";
      wrap.setAttribute("data-card-index", i.toString());
      
      // Get appropriate card image
      const cardImage = data.image || "/images/cards/credit/card-sig-rewards.png";
      console.log(`🔧 Card ${i} using image:`, cardImage);
      
      wrap.innerHTML = `
        <div class="card-container">
          <div class="card-inner">
            <img class="card-bg" src="${cardImage}" alt="" />
            <div id="card-number-${i}" style="font-family: 'OCR A Std', monospace;">${data.cardNumber}</div>
            <div id="card-expiration-${i}" style="font-family: 'OCR A Std', monospace;">${data.expiry}</div>
            <div id="card-holder-${i}" style="font-family: 'OCR A Std', monospace;">${user.name?.toUpperCase() || 'CARD HOLDER'}</div>
          </div>
        </div>
      `;
      
      console.log(`🔧 Adding card ${i} to swiper`);
      swiperEl.appendChild(wrap);
      wrappers.push(wrap);
      console.log(`🔧 Card ${i} added. Wrappers length now:`, wrappers.length);
        // Create dot for navigation
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.setAttribute("data-dot-index", i.toString());
      
      // Use card color for dot if available, otherwise use defaults
      const dotColors = ["#95272b", "#581c5c", "#153366", "#1a6844", "#614b19"];
      const dotColor = data.color || dotColors[i % dotColors.length];
      dot.style.background = dotColor;
      console.log(`🔧 Dot ${i} color:`, dotColor);
      
      dot.addEventListener("click", () => {
        console.log(`🔧 Dot ${i} clicked, changing current from ${current} to ${i}`);
        current = i;
        updateDisplay();
      });
      dotsEl.appendChild(dot);
    });    // Swipe gestures - exactly like working demo
    let startX: number;
    let active: HTMLDivElement | null = null;
    
    console.log("🔧 Setting up swipe gestures for", wrappers.length, "wrappers");
    
    wrappers.forEach((w: HTMLDivElement, index: number) => {
      console.log(`🔧 Adding pointerdown listener to wrapper ${index}`);
      w.addEventListener("pointerdown", (e: PointerEvent) => {
        console.log(`🔧 === POINTERDOWN on card ${index} ===`);
        console.log(`🔧 Event details:`, { clientX: e.clientX, pointerId: e.pointerId });
        
        e.preventDefault();
        active = w;
        startX = e.clientX;
        w.setPointerCapture(e.pointerId);
        
        console.log(`🔧 BEFORE removing transition - transform: "${w.style.transform}"`);
        w.style.transition = "none";
        console.log(`🔧 AFTER removing transition - transform: "${w.style.transform}"`);
        console.log(`🔧 Active card set to index ${index}, startX = ${startX}`);
      });
    });    window.addEventListener("pointermove", (e: PointerEvent) => {
      if (!active) return;
      
      const dx = e.clientX - startX;
      const newTransform = `translateX(${dx}px) rotate(${dx/20}deg)`;
      
      console.log(`🔧 POINTERMOVE: dx=${dx}, newTransform="${newTransform}"`);
      console.log(`🔧 BEFORE drag transform: "${active.style.transform}"`);
      
      active.style.transform = newTransform;
      
      console.log(`🔧 AFTER drag transform: "${active.style.transform}"`);
    });    window.addEventListener("pointerup", (e: PointerEvent) => {
      if (!active) return;
      
      console.log(`🔧 === POINTERUP START ===`);
      console.log(`🔧 Active card transform before transition: "${active.style.transform}"`);
      
      const dx = e.clientX - startX;
      const activeIndex = wrappers.indexOf(active);
      
      console.log(`🔧 Pointer up: dx=${dx}, startX=${startX}, endX=${e.clientX}`);
      console.log(`🔧 Active card index: ${activeIndex}`);
      console.log(`🔧 Current index before change: ${current}`);
      console.log(`🔧 Threshold checks: dx > 80 = ${dx > 80}, dx < -80 = ${dx < -80}`);
      
      // Release pointer capture to stop receiving pointer events
      active.releasePointerCapture(e.pointerId);
      console.log(`🔧 Released pointer capture for pointerId: ${e.pointerId}`);
      
      // Add transition first
      active.style.transition = "transform 0.5s ease";
      console.log(`🔧 Transition added: "${active.style.transition}"`);
      
      if (dx > 80) {
        const newCurrent = (current - 1 + cards.length) % cards.length;
        console.log(`🔧 SWIPE RIGHT: current ${current} -> ${newCurrent}`);
        current = newCurrent;
        updateDisplay();
        updateCardInfo(cards[current]);
      } else if (dx < -80) {
        const newCurrent = (current + 1) % cards.length;
        console.log(`🔧 SWIPE LEFT: current ${current} -> ${newCurrent}`);
        current = newCurrent;
        updateDisplay();
        updateCardInfo(cards[current]);
      } else {
        console.log(`🔧 SNAP BACK: restoring positions, current stays ${current}`);
        updateDisplay();
      }
      
      console.log(`🔧 Setting active to null`);
      active = null;
      console.log(`🔧 === POINTERUP END ===`);
    });
      // Scaling and dot positioning
    function scaleSwiper() {
      console.log("🔧 === scaleSwiper START ===");
      const container = document.querySelector(".swiper-container");
      if (!container || !swiperEl || !dotsEl) {
        console.error("🔧 ERROR: Missing elements for scaling", { container: !!container, swiperEl: !!swiperEl, dotsEl: !!dotsEl });
        return;
      }
      
      const containerWidth = container.clientWidth;
      const scale = containerWidth / BASE_WIDTH;
      
      console.log("🔧 Scaling:", { containerWidth, BASE_WIDTH, scale });
      
      swiperEl.style.transform = `scale(${scale})`;
      console.log("🔧 Swiper transform set to:", swiperEl.style.transform);
      
      // Place dots beneath stack
      const totalStack = SPACING * (cards.length - 1);
      const baseTop = BASE_HEIGHT + totalStack + EXTRA_DOT_OFFSET;
      const scaledTop = baseTop * scale;
      
      console.log("🔧 Dots positioning:", { totalStack, baseTop, scaledTop });
      
      dotsEl.style.top = `${scaledTop}px`;
      console.log("🔧 Dots top set to:", dotsEl.style.top);
      console.log("🔧 === scaleSwiper END ===");
    }
    
    window.addEventListener("resize", scaleSwiper);
    window.addEventListener("orientationchange", () => {
      setTimeout(scaleSwiper, 100);
    });    // Initialize display
    console.log("🔧 === INITIALIZATION START ===");
    console.log("🔧 About to call initial updateDisplay");
    updateDisplay();
    console.log("🔧 About to call initial scaleSwiper");
    scaleSwiper();
    console.log("🔧 About to call initial updateCardInfo");
    updateCardInfo(cards[current]);
    console.log("🔧 === INITIALIZATION COMPLETE ===");
    
    // Cleanup function for event listeners
    return () => {
      window.removeEventListener("resize", scaleSwiper);
      window.removeEventListener("orientationchange", scaleSwiper);
    };
  };
  return (
    <div className="relative min-h-screen bg-red-900 text-white border-4 border-yellow-400">
      {/* OBVIOUS VISUAL INDICATOR THAT TEMP COMPONENT IS LOADED */}
      <div className="bg-yellow-400 text-black p-4 text-center text-2xl font-bold">
        🔧 TEMPORARY COMPONENT IS ACTIVE - DEBUGGING MODE 🔧
      </div>
      <div className="px-5 pt-8 pb-6 mx-auto max-w-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19L8 12l7-7" />
              </svg>
            </a>
            <div className="text-xl font-medium tracking-tight">🔧 TEMP COMPONENT LOADED - DEBUGGING MODE</div>
          </div>
          <button className="relative p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/4 translate-x-1/4"></span>
          </button>
        </div>
      </div>
      
      <div className="px-5 mx-auto max-w-md">
        {/* Card Selector */}
        <div className="mb-8">
          <div className="swiper-container">
            <div id="swiper"></div>
            <div id="dots"></div>
          </div>
        </div>
        
        {/* Card Details */}
        <div className="bg-blue-600 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            What do you want to do with a chosen account?
          </h2>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full py-4 bg-white bg-opacity-10 rounded-xl text-left px-6 text-xl font-semibold hover:bg-opacity-20 transition-all btn-ripple">
              Payment
            </button>
            <button className="w-full py-4 bg-white bg-opacity-10 rounded-xl text-left px-6 text-xl font-semibold hover:bg-opacity-20 transition-all btn-ripple">
              Activity
            </button>
            <button className="w-full py-4 bg-white bg-opacity-10 rounded-xl text-left px-6 text-xl font-semibold hover:bg-opacity-20 transition-all btn-ripple">
              Detail
            </button>
            <button className="w-full py-4 bg-white bg-opacity-10 rounded-xl text-left px-6 text-xl font-semibold hover:bg-opacity-20 transition-all btn-ripple">
              Setting
            </button>
          </div>
        </div>
        
        {/* Card Info Summary */}
        <div id="card-info" className="bg-[#212121] rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between mb-4">
            <div>
              <h3 data-card-name className="text-lg font-medium">Platinum Rewards</h3>
              <p data-card-number className="text-neutral-400">4242 •••• •••• 4242</p>
            </div>
            <div className="text-right">
              <p data-current-balance className="text-lg font-medium">$1250.75</p>
              <p className="text-neutral-400">Current Balance</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div>
              <p className="text-neutral-400">Available Credit</p>
              <p data-available-credit className="text-green-500 font-medium">$3749.25</p>
            </div>
            <div className="text-right">
              <p className="text-neutral-400">Due Date</p>
              <p data-due-date className="text-white font-medium">Jun 15, 2025</p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div id="card-actions" className="grid grid-cols-2 gap-4 mb-6">
          <a href="/cards/manage/card1" data-action="manage" className="bg-[#212121] rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors">
            <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span className="text-sm text-neutral-300">Manage Card</span>
          </a>
          
          <button className="bg-[#212121] rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-800 transition-colors">
            <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1L21 5L17 9" />
                <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" />
                <path d="M7 23L3 19L7 15" />
                <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" />
              </svg>
            </div>
            <span className="text-sm text-neutral-300">Transfer</span>
          </button>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="p-4 text-center text-neutral-500 text-sm">
        <p>This is a temporary cards view with React hooks removed</p>
        <p>Testing the vanilla JS card slider functionality</p>
      </div>
    </div>
  );
};

export default IntegratedCardsViewTemp;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { animated, useSpring, useTrail, config } from 'react-spring';

// Individual slide components (simplified without animations)
const GoPaperlessSlide = () => (
  <div className="rounded-lg p-4 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden flex-1 flex flex-col transition-all duration-300 hover:shadow-lg">
    <div className="flex justify-between flex-1">
      <div className="max-w-[65%] flex flex-col">
        <h3 className="text-white font-medium mb-1">Go Paperless</h3>
        <p className="text-white/80 text-xs mb-3 flex-1">
          Switch to e-statements and help the environment
        </p>
        <button className="text-xs text-white bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 self-start">
          Switch now
        </button>
      </div>
      <div className="absolute right-2 bottom-2">
        <img src="/images/marketing/go-paperless.png" alt="Go Paperless" className="h-20 object-contain" />
      </div>
    </div>
  </div>
);

const ReferAndEarnSlide = () => (
  <div className="rounded-lg p-4 bg-gradient-to-br from-purple-800 to-purple-900 relative overflow-hidden flex-1 flex flex-col transition-all duration-300 hover:shadow-lg">
    <div className="flex justify-between flex-1">
      <div className="max-w-[65%] flex flex-col">
        <h3 className="text-white font-medium mb-1">Refer and Earn</h3>
        <p className="text-white/80 text-xs mb-3 flex-1">
          Share a referral link to your friend and get rewarded
        </p>
        <button className="text-xs text-white bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 self-start">
          Learn more
        </button>
      </div>
      <div className="absolute right-2 bottom-2">
        <img src="/images/marketing/refer-friend.png" alt="Refer and Earn" className="h-20 object-contain" />
      </div>
    </div>
  </div>
);

const BoostSavingsSlide = () => (
  <div className="rounded-lg p-4 bg-gradient-to-br from-blue-800 to-blue-900 relative overflow-hidden flex-1 flex flex-col transition-all duration-300 hover:shadow-lg">
    <div className="flex justify-between flex-1">
      <div className="max-w-[65%] flex flex-col">
        <h3 className="text-white font-medium mb-1">Boost Your Savings</h3>
        <p className="text-white/80 text-xs mb-3 flex-1">
          Open a high-yield savings account today
        </p>
        <button className="text-xs text-white bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 self-start">
          Get started
        </button>
      </div>
      <div className="absolute right-2 bottom-2">
        <img src="/images/marketing/go-paperless.png" alt="Boost Your Savings" className="h-20 object-contain" />
      </div>
    </div>
  </div>
);

interface PromotionalSliderProps {
  style?: any;
  className?: string;
}

const PromotionalSlider: React.FC<PromotionalSliderProps> = ({ style, className = "mb-6" }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
    // Drag functionality
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const dragDirectionRef = useRef(0); // -1 for left, 1 for right, 0 for none
  const [isDragging, setIsDragging] = useState(false);

  // Entrance animation for the entire slider
  const sliderSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
    delay: 300,
  });

  // Navigation dots animation
  const dotsSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
    delay: 600,
  });  const slides = [
    { id: 'go-paperless', component: <GoPaperlessSlide /> },
    { id: 'refer-earn', component: <ReferAndEarnSlide /> },
    { id: 'boost-savings', component: <BoostSavingsSlide /> }
  ];

  // Handle scroll events to update active slide
  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.clientWidth * 0.9; // 90% width per slide
    const newIndex = Math.round(scrollLeft / slideWidth);
    
    if (newIndex !== activeSlideIndex && newIndex >= 0 && newIndex < slides.length) {
      setActiveSlideIndex(newIndex);
    }
  };
  // Handle dot navigation
  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;

    isScrollingRef.current = true;
    const container = scrollContainerRef.current;
    const slideWidth = container.clientWidth * 0.9;
    const scrollPosition = index * slideWidth;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    setActiveSlideIndex(index);

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX;
    scrollStartRef.current = scrollContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0;
    
    // Prevent text selection while dragging
    e.preventDefault();
    
    // Change cursor to grabbing
    scrollContainerRef.current.style.cursor = 'grabbing';
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX;
    const walk = x - startXRef.current;
    dragDistanceRef.current = Math.abs(walk);
    
    // Determine drag direction for visual feedback
    if (Math.abs(walk) > 10) { // Only set direction after meaningful movement
      dragDirectionRef.current = walk > 0 ? -1 : 1; // Inverted because positive walk means drag right = previous slide
    }
    
    // Don't update scroll position during drag - just track distance
    // This prevents the immediate scrolling behavior and allows for smooth animation on release
  };
  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;
    
    // Small delay to prevent click events from firing after drag
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
    
    scrollContainerRef.current.style.cursor = 'grab';
    
    // Determine if drag was significant enough to change slides
    if (dragDistanceRef.current > 30) { // Lower threshold for more responsive feel
      let newIndex = activeSlideIndex;
      
      if (dragDirectionRef.current > 0 && activeSlideIndex < slides.length - 1) {
        // Dragged left (next slide)
        newIndex = activeSlideIndex + 1;
      } else if (dragDirectionRef.current < 0 && activeSlideIndex > 0) {
        // Dragged right (previous slide)
        newIndex = activeSlideIndex - 1;
      }
      
      // Use the same smooth scroll animation as nav dots
      if (newIndex !== activeSlideIndex) {
        scrollToSlide(newIndex);
      }
    }
    
    // Reset drag tracking
    dragDistanceRef.current = 0;
    dragDirectionRef.current = 0;
  };
  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  };

  // Touch handlers for mobile (same logic as mouse)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.touches[0].pageX;
    scrollStartRef.current = scrollContainerRef.current.scrollLeft;
    dragDistanceRef.current = 0;
    dragDirectionRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    
    const x = e.touches[0].pageX;
    const walk = x - startXRef.current;
    dragDistanceRef.current = Math.abs(walk);
    
    // Determine drag direction for visual feedback
    if (Math.abs(walk) > 10) {
      dragDirectionRef.current = walk > 0 ? -1 : 1;
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp(); // Same logic as mouse up
  };

  // Handle slide click (prevent if dragging)
  const handleSlideClick = (e: React.MouseEvent) => {
    if (isDragging || dragDistanceRef.current > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial cursor style
    container.style.cursor = 'grab';
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [activeSlideIndex]);
  return (
    <animated.div style={{ ...sliderSpring, ...style }} className={className}>
      <div className="relative overflow-hidden">        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory select-none"
          style={{ scrollSnapType: 'x mandatory' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}        >{slides.map((slide, index) => (
            <div 
              key={slide.id}
              className="min-w-[90%] mr-4 snap-center first:pl-0 last:pr-5 flex"
              style={{ scrollSnapAlign: 'center' }}
              onClick={handleSlideClick}
            >
              {slide.component}
            </div>
          ))}
        </div>
          {/* Navigation dots with animation */}
        <animated.div style={dotsSpring} className="flex justify-center mt-1">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full mx-1 transition-all duration-300 hover:scale-110 ${
                index === activeSlideIndex ? 'bg-white w-6 shadow-lg' : 'bg-neutral-600 w-2 hover:bg-neutral-500'
              }`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </animated.div>
      </div>
    </animated.div>
  );
};

export default PromotionalSlider;

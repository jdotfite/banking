'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { animated, useSpring } from 'react-spring';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '@/lib/styles/theme';
import AnimatedElement from '@/components/ui/common/AnimatedElement';

// Define the onboarding slides content
const slides = [
  {
    id: 'banking',
    title: 'Banking that puts you first',
    subtitle: 'Start building credit, say goodbye to monthly fees, and enjoy personalized service from a credit union that cares.',
    bgColor: '#7c2984', // Purple
    textColor: 'white',
    image: '/images/onboarding/shanice-m1st.png',
    imageAlt: 'Members 1st Banking App Screenshot'
  },
  {
    id: 'mobile',
    title: 'Banking in your pocket',
    subtitle: 'Manage your money on the go with our easy-to-use mobile app and digital wallet integration.',
    bgColor: '#039fd7', // Blue
    textColor: 'white',
    image: '/images/onboarding/mike-m1st.png',
    imageAlt: 'Mobile Banking Illustration'
  },
  {
    id: 'card',
    title: 'Personal Concierge',
    subtitle: ': Chat one-on-one with a local Member Concierge directly in the app, no chatbots—just real people who know you, your goals, and your community.',
    bgColor: '#5ea63a', // Green
    textColor: 'white',
    image: '/images/onboarding/woman-m1st.png',
    imageAlt: 'Members 1st Credit Card'
  },
  {
    id: 'fees',
    title: 'Say goodbye to fees',
    subtitle: 'No monthly fees, no minimum balances, and access to over 30,000 fee-free ATMs nationwide.',
    bgColor: '#f36919', // Orange
    textColor: 'white',
    image: '/images/onboarding/guy-bye.png',
    imageAlt: 'No Fees Illustration'
  },
  {
    id: 'credit',
    title: 'Build your credit score',
    subtitle: 'Start building credit with our Signature Rewards card and track your FICO score for free.',
    bgColor: '#213d70', // Blue Dark
    textColor: 'white',
    image: '/images/onboarding/credit-score.png',
    imageAlt: 'Credit Score Illustration'
  },
  {
    id: 'security',
    title: 'Bank securely anywhere',
    subtitle: 'Enjoy peace of mind with our advanced security features and 24/7 fraud monitoring.',
    bgColor: '#d90981', // Pink
    textColor: 'white',
    image: '/images/onboarding/shield-security.png',
    imageAlt: 'Security Features Illustration'
  }
];

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [initialLoad, setInitialLoad] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const touchStartX = useRef(0);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  // Handle initial load
  useEffect(() => {
    // Set initialLoad to false after component mounts
    setInitialLoad(false);
    
    // Start auto-advance timer
    startAutoAdvanceTimer();
    
    // Cleanup timer on unmount
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);
  
  // Start auto-advance timer
  const startAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    if (autoAdvance) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        if (currentSlide < slides.length - 1) {
          setSlideDirection('right');
          setCurrentSlide(prev => prev + 1);
        } else {
          // Loop back to the first slide
          setSlideDirection('right');
          setCurrentSlide(0);
        }
      }, 4000); // 4 seconds
    }
  };

  // Handle slide change
  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    // Reset auto-advance timer when manually changing slides
    startAutoAdvanceTimer();
  };

  // Handle next slide
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection('right');
      setCurrentSlide(prev => prev + 1);
    } else {
      // Loop back to the first slide
      setSlideDirection('right');
      setCurrentSlide(0);
    }
    // Reset auto-advance timer when manually changing slides
    startAutoAdvanceTimer();
  };

  // Handle previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('left');
      setCurrentSlide(prev => prev - 1);
    } else {
      // Loop to the last slide
      setSlideDirection('left');
      setCurrentSlide(slides.length - 1);
    }
    // Reset auto-advance timer when manually changing slides
    startAutoAdvanceTimer();
  };

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    // Pause auto-advance during touch interaction
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Swipe right to left (next)
    if (diff > 50) {
      nextSlide();
    }
    // Swipe left to right (previous)
    else if (diff < -50) {
      prevSlide();
    } else {
      // If no significant swipe, restart the timer
      startAutoAdvanceTimer();
    }
  };

  // Handle sign up button click
  const handleSignUp = () => {
    router.push('/signup');
  };

  // Handle login button click
  const handleLogin = () => {
    router.push('/login');
  };

  // Animation for slide transition
  const slideAnimation = useSpring({
    opacity: 1,
    transform: 'translateX(0%)',
    from: { 
      opacity: initialLoad ? 0 : 0, 
      transform: initialLoad ? 'translateX(0%)' : `translateX(${slideDirection === 'right' ? '100%' : '-100%'})` 
    },
    reset: !initialLoad,
    config: { tension: 280, friction: 60 },
    onRest: () => {
      // Restart auto-advance timer after animation completes
      startAutoAdvanceTimer();
    }
  });

  // Animation for buttons
  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: { tension: 280, friction: 60 }
  });

  return (
    <div 
      className="flex flex-col min-h-[100dvh] w-full overflow-hidden"
      style={{ 
        backgroundColor: slides[currentSlide].bgColor,
        color: slides[currentSlide].textColor,
        transition: 'background-color 0.5s ease-in-out'
      }}
    >
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-4">
        <img 
          src="/images/icons/logo.svg" 
          alt="Members 1st Credit Union" 
          className="h-10"
        />
      </div>

      {/* Main content area - Image only */}
      <div 
        className="relative flex-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <animated.div 
          style={slideAnimation}
          className="absolute inset-0 flex items-end justify-center"
        >
          {/* Image - positioned to touch the gray area */}
          <div className="w-full h-full flex items-end justify-center">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].imageAlt}
              className="max-h-[80%] max-w-full object-contain"
            />
          </div>
        </animated.div>
      </div>

      {/* Dark gray bottom section - with text content moved here */}
      <div className="w-full bg-neutral-900 text-white flex flex-col" style={{ minHeight: '40%' }}>
        {/* Text content */}
        <div className="w-full px-6 pt-8 pb-4 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-md opacity-90 line-clamp-3">{slides[currentSlide].subtitle}</p>
        </div>
        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 py-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-4' 
                  : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <animated.div 
          style={buttonAnimation}
          className="px-6 pb-4 space-y-4"
        >
          <button
            onClick={handleSignUp}
            className="w-full py-4 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign up
          </button>
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-transparent text-white font-medium hover:bg-white/10 transition-colors"
          >
            Log in
          </button>
        </animated.div>
      </div>
    </div>
  );
};

export default Onboarding;

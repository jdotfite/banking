'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { theme } from '@/lib/styles/theme';
import AnimatedElement from '@/components/ui/common/AnimatedElement';
import { Button } from '@/components/ui/form';

// Define the onboarding slides content
const slides = [
  {
    id: 'award',
    title: 'Award-Winning Service',
    subtitle: 'Recognized by Forbes, Newsweek & Harrisburg Magazine\'s Simply the Best for 20 years—reflecting our member-first focus.',
    bgColor: '#039fd7',
    textColor: 'white',
    image: '/images/onboarding/mike-m1st.png',
    imageAlt: 'M1st CEO Mike Wilson Holding Award'
  },
  {
    id: 'milestones',
    title: 'Celebrating Your Milestones',
    subtitle: 'From your first account to life\'s biggest milestones, we\'re here with tailored guidance and a community cheering you on.',
    bgColor: '#fec20f',
    textColor: 'black',
    image: '/images/onboarding/balloons.png',
    imageAlt: 'Balloons with M1st Logo on them'
  },
  {
    id: 'fees',
    title: 'Say Goodbye to Fees',
    subtitle: 'No monthly fees, no minimum balances, and access to over 30,000 fee-free ATMs nationwide.',
    bgColor: '#f36919',
    textColor: 'white',
    image: '/images/onboarding/guy-bye.png',
    imageAlt: 'No Fees Illustration'
  },
  {
    id: 'credit',
    title: 'Build Your Credit Score',
    subtitle: 'Start building credit with our Signature Rewards card and track your FICO score for free.',
    bgColor: '#213d70',
    textColor: 'white',
    image: '/images/onboarding/credit-score.png',
    imageAlt: 'Credit Score Illustration'
  },
  {
    id: 'security',
    title: 'Bank Securely',
    subtitle: 'Enjoy peace of mind with our advanced security features and 24/7 fraud monitoring.',
    bgColor: '#d90981',
    textColor: 'white',
    image: '/images/onboarding/shield-security.png',
    imageAlt: 'Security Features Illustration'
  },
  {
    id: 'banking',
    title: 'Banking that Puts You First',
    subtitle: 'Start building credit, say goodbye to monthly fees, and enjoy personalized service from a credit union that cares.',
    bgColor: '#7c2984',
    textColor: 'white',
    image: '/images/onboarding/shanice-m1st.png',
    imageAlt: 'Members 1st Banking App Screenshot'
  },
  {
    id: 'CIO',
    title: 'Cyber Shield',
    subtitle: 'With quantum-resistant encryption and a zero-trust battle plan, we\'re ensuring your Members 1st funds rest safer than a superhero\'s secret identity.',
    bgColor: '#5ea63a',
    textColor: 'white',
    image: '/images/onboarding/garth-m1st.png',
    imageAlt: 'Members 1st Credit Card'
  }
];

interface OnboardingProps {}

const Onboarding: React.FC<OnboardingProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [autoAdvance, setAutoAdvance] = useState(true);
  // Added state for detecting small devices
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasMountedRef = useRef(false);
  const router = useRouter();
  
  useEffect(() => {
    const setViewportHeight = () => {
      const viewportHeight = window.innerHeight;
      document.documentElement.style.setProperty(
        '--vh', 
        `${viewportHeight * 0.01}px`
      );
      
      // Check if device is small (iPhone SE is around 568px height)
      // You can adjust this threshold as needed
      setIsSmallDevice(viewportHeight < 700);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    startAutoAdvanceTimer();
    hasMountedRef.current = true;
    
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  // Auto-advance timer function remains the same
  const startAutoAdvanceTimer = () => {
    // Existing implementation
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    if (autoAdvance) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        if (currentSlide < slides.length - 1) {
          setSlideDirection('right');
          setCurrentSlide((prev: number) => prev + 1);
        } else {
          setSlideDirection('right');
          setCurrentSlide(0);
        }
      }, 4000);
    }
  };

  // Other functions remain the same
  const goToSlide = (index: number) => {
    // Existing implementation
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    startAutoAdvanceTimer();
  };

  const nextSlide = () => {
    // Existing implementation
    if (currentSlide < slides.length - 1) {
      setSlideDirection('right');
      setCurrentSlide((prev: number) => prev + 1);
    } else {
      setSlideDirection('right');
      setCurrentSlide(0);
    }
    startAutoAdvanceTimer();
  };

  const prevSlide = () => {
    // Existing implementation
    if (currentSlide > 0) {
      setSlideDirection('left');
      setCurrentSlide((prev: number) => prev - 1);
    } else {
      setSlideDirection('left');
      setCurrentSlide(slides.length - 1);
    }
    startAutoAdvanceTimer();
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  // Animation for slide transition
  const slideAnimation = useSpring({
    opacity: 1,
    transform: 'translateX(0%)',
    from: { 
      opacity: 0,
      transform: `translateX(${slideDirection === 'right' ? '100%' : '-100%'})`
    },
    reset: true,
    config: { tension: 280, friction: 60 },
    onRest: () => {
      // Restart auto-advance timer after animation completes
      startAutoAdvanceTimer();
    }
  });

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    // Existing implementation
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Existing implementation
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const xDiff = touchStartX.current - touchEndX;
    const yDiff = touchStartY.current - touchEndY;

    // Only consider horizontal swipes with minimal vertical movement
    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
      if (xDiff > 0) {
        nextSlide(); // Swipe left
      } else {
        prevSlide(); // Swipe right
      }
    }
  };

  return (
    <div 
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ 
        backgroundColor: slides[currentSlide].bgColor,
        color: slides[currentSlide].textColor,
        transition: 'background-color 0.5s ease-in-out',
        height: 'calc(var(--vh, 1vh) * 100)'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo - fixed height 
      <div className="flex justify-center  h-16">
        <img 
          src="/images/logos/m1st-square.svg" 
          alt="Members 1st Credit Union" 
          className="h-14"
        />
      </div>*/}

      {/* Main content area - flex-grow to take available space */}
      <div className="relative flex-grow flex items-end overflow-hidden">
        {(!hasMountedRef.current && currentSlide === 0) ? (
          // On first render, show static slide (no animation)
          <div className="absolute inset-0 flex flex-col items-center justify-end">
            <div className="w-full h-full flex items-end justify-center px-4 ">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].imageAlt}
                className="max-h-full max-w-full object-contain object-bottom"
                style={{ maxHeight: 'calc(100% - 20px)' }}
              />
            </div>
          </div>
        ) : (
          <animated.div 
            style={slideAnimation}
            className="absolute inset-0 flex flex-col items-center justify-end"
          >
            <div className="w-full h-full flex items-end justify-center px-4 ">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].imageAlt}
                className="max-h-full max-w-full object-contain object-bottom"
                style={{ maxHeight: 'calc(100% - 20px)' }}
              />
            </div>
          </animated.div>
        )}
      </div>

   {/* Dark gray bottom section - with flex layout */}
   <div className="w-full bg-neutral-900 text-white flex flex-col" 
           style={{ height: '45%' }}>
        {/* Content container with flex layout */}
        <div className="flex flex-col h-full">
          {/* Text content - with fixed height */}
          {(!hasMountedRef.current && currentSlide === 0) ? (
            <div className="w-full px-6 pt-5 h-32 overflow-hidden">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{slides[currentSlide].title}</h1>
              <p className={`md:text-md opacity-90 ${isSmallDevice ? 'line-clamp-2 overflow-ellipsis' : ''}`}>
                {slides[currentSlide].subtitle}
              </p>
            </div>
          ) : (
            <animated.div 
              style={slideAnimation}
              className="w-full px-6 pt-5 h-32 overflow-hidden"
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{slides[currentSlide].title}</h1>
              <p className={`md:text-md opacity-90 ${isSmallDevice ? 'line-clamp-2 overflow-ellipsis' : ''}`}>
                {slides[currentSlide].subtitle}
              </p>
            </animated.div>
          )}
          
          {/* Spacer to push content to edges */}
          <div className="flex-grow"></div>

          {/* Action buttons with pagination dots - anchored to bottom */}
          <div className="px-6 mt-auto">
            {/* Pagination dots */}
            <div className="flex justify-center space-x-2 py-3 mb-3">
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
            
            {/* Buttons */}
            <div className="space-y-3 pb-3">
              <Button
                onClick={handleSignUp}
                variant="primary"
                className="w-full"
              >
                SIGN UP
              </Button>
              <Button
                onClick={handleLogin}
                variant="borderless"
                className="w-full text-white"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { theme } from '@/lib/styles/theme';
import AnimatedElement from '@/components/ui/common/AnimatedElement';

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
    subtitle: 'From your first account to life\'s biggest milestones, we\'re here with tailored guidance, rewards, and a community cheering you on.',
    bgColor: '#fec20f',
    textColor: 'black',
    image: '/images/onboarding/balloons.png',
    imageAlt: 'Balloons with M1st Logo on them'
  },
  {
    id: 'fees',
    title: 'Say goodbye to fees',
    subtitle: 'No monthly fees, no minimum balances, and access to over 30,000 fee-free ATMs nationwide.',
    bgColor: '#f36919',
    textColor: 'white',
    image: '/images/onboarding/guy-bye.png',
    imageAlt: 'No Fees Illustration'
  },
  {
    id: 'credit',
    title: 'Build your credit score',
    subtitle: 'Start building credit with our Signature Rewards card and track your FICO score for free.',
    bgColor: '#213d70',
    textColor: 'white',
    image: '/images/onboarding/credit-score.png',
    imageAlt: 'Credit Score Illustration'
  },
  {
    id: 'security',
    title: 'Bank securely anywhere',
    subtitle: 'Enjoy peace of mind with our advanced security features and 24/7 fraud monitoring.',
    bgColor: '#d90981',
    textColor: 'white',
    image: '/images/onboarding/shield-security.png',
    imageAlt: 'Security Features Illustration'
  },
  {
    id: 'banking',
    title: 'Banking that puts you first',
    subtitle: 'Start building credit, say goodbye to monthly fees, and enjoy personalized service from a credit union that cares.',
    bgColor: '#7c2984',
    textColor: 'white',
    image: '/images/onboarding/shanice-m1st.png',
    imageAlt: 'Members 1st Banking App Screenshot'
  },
  {
    id: 'CIO',
    title: 'CIO-Engineered Cyber Shield',
    subtitle: 'With quantum-resistant encryption and a zero-trust battle plan, we’re ensuring your Members 1st funds rest safer than a superhero’s secret identity.',
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    setInitialLoad(false);
    startAutoAdvanceTimer();
    
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  const startAutoAdvanceTimer = () => {
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

  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    startAutoAdvanceTimer();
  };

  const nextSlide = () => {
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
      opacity: (initialLoad && currentSlide === 0) ? 1 : 0,
      transform: (initialLoad && currentSlide === 0) ? 'translateX(0%)' : `translateX(${slideDirection === 'right' ? '100%' : '-100%'})`
    },
    reset: !(initialLoad && currentSlide === 0),
    config: { tension: 280, friction: 60 },
    onRest: () => {
      // Restart auto-advance timer after animation completes
      startAutoAdvanceTimer();
    }
  });

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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
      className="flex flex-col w-full overflow-hidden"
      style={{ 
        backgroundColor: slides[currentSlide].bgColor,
        color: slides[currentSlide].textColor,
        transition: 'background-color 0.5s ease-in-out',
        height: 'calc(var(--vh, 1vh) * 100)'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-4">
        <img 
          src="/images/icons/logo.svg" 
          alt="Members 1st Credit Union" 
          className="h-10"
        />
      </div>

      {/* Main content area */}
      <div className="relative flex-1 overflow-hidden">
        <animated.div 
          style={slideAnimation}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {/* Image */}
          <div className="flex-1 w-full flex items-end justify-center">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].imageAlt}
              className="max-h-[70%] max-w-full object-contain"
            />
          </div>
        </animated.div>
      </div>

      {/* Dark gray bottom section - height controlled by this style */}
      <div className="w-full bg-neutral-900 text-white flex flex-col" style={{ height: '45%' }}>
        {/* Text content - animated with same timing as image */}
        <animated.div 
          style={slideAnimation}
          className="w-full px-6 pt-8 pb-4 text-center flex-1 overflow-y-hidden"
        >
          <h1 className="text-3xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-md opacity-90 line-clamp-3">{slides[currentSlide].subtitle}</p>
        </animated.div>
        
        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 py-4">
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
        <div className="px-6 pb-8 space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

'use client';

import React, { useState, useEffect, memo, useRef } from 'react';
import ResourceLoader from './ResourceLoader';
import { useRouter } from 'next/navigation';
import { usePreloader } from '@/components/context/PreloaderContext';

type SimplePreloaderProps = {
  children: React.ReactNode;
  minDisplayTime?: number;
  transitionDuration?: number;
  onComplete?: () => void;
  routeToLoginAfterComplete?: boolean;
};

// Separate memoized component for the SVG animation with smoother effects
const AnimatedLogo = memo(() => (
  <div className="relative w-48 h-48">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <defs>
        <style>
          {`
            .cls-1{fill:#fff;stroke-width:0}
            
            @keyframes pulse-background {
              0% {
                transform: scale(1);
                opacity: 0.7;
              }
              50% {
                transform: scale(1.4);
                opacity: 0.3;
              }
              100% {
                transform: scale(1.8);
                opacity: 0;
              }
            }
            
            @keyframes pulse-background-2 {
              0% {
                transform: scale(1);
                opacity: 0.5;
              }
              100% {
                transform: scale(1.6);
                opacity: 0;
              }
            }
            
            @keyframes progress-shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            
            #pulse-square {
              transform-origin: center;
              animation: pulse-background 2.2s ease-out infinite;
            }
            
            #pulse-square-2 {
              transform-origin: center;
              animation: pulse-background-2 2.2s ease-out infinite;
              animation-delay: 1.1s;
            }
          `}
        </style>
      </defs>
      
      {/* Black background */}
      <rect width="1024" height="1024" fill="#121212"/>
      
      {/* First pulsing square - larger fade */}
      <rect id="pulse-square" x="312" y="312" width="400" height="400" fill="#ee3831" opacity="0.7"/>
      
      {/* Second pulsing square with delay */}
      <rect id="pulse-square-2" x="312" y="312" width="400" height="400" fill="#ee3831" opacity="0.5"/>
      
      {/* Static logo that stays in place */}
      <g id="static-logo">
        {/* Red background square */}
        <rect x="312" y="312" width="400" height="400" fill="#ee3831"/>
        
        {/* Updated simplified M logo */}
        <g id="Layer_2" transform="translate(312, 312) scale(0.391)">
          <path d="M817.2 775.82c-1.84-.48-3.62-1.16-5.3-2.04-.8-.38-1.66-.71-2.41-1.14a37.208 37.208 0 0 1-5.49-3.83 27.326 27.326 0 0 1-10.6-22.06l.24-536.62c0-3.53-2.86-6.39-6.39-6.39h-91.78c-4.4-.1-8.47 2.28-10.56 6.15L626.74 327.8c-.65 1.31-.12 2.9 1.19 3.56.37.18.77.28 1.18.28h38.34c8.42-.05 15.32 6.68 15.48 15.1V746.7c.1 8.6-3.82 16.76-10.6 22.06-1.73 1.42-3.56 2.7-5.49 3.83l-2.41 1.14c-1.69.87-3.47 1.55-5.3 2.04-.54.15-1.06.36-1.56.62v18.65l.28.28h160.13l.28-.28v-18.65c-.48-.27-.99-.47-1.51-.62" className="cls-1"/>
          <path d="m487.2 703.21-180.1-306c-.32-.44-.6-.89-.85-1.37-1.42 0-1.75 1.04-1.94 1.99-.07.96-.07 1.93 0 2.89v344.73a27.493 27.493 0 0 0 10.6 22.2c4.31 3.51 9.33 6.03 14.72 7.38v19.17H170.54v-18.93c2.89-1.33 5.82-2.6 8.52-4.02 2.96-1.66 5.79-3.54 8.47-5.63a17.93 17.93 0 0 0 6.96-15.05v-505.5c.39-7-2.43-13.8-7.67-18.46a35.094 35.094 0 0 0-13.77-7.67c-1.18-.33-2.32-.43-3.88-.71.24-5.02.33-9.99.43-14.86h144.55c8.71-.02 16.64 5 20.35 12.87L520 533.32l65.98-134.14a7.666 7.666 0 0 1 6.77-4.17h41.37c1.52-.02 2.76 1.2 2.78 2.71 0 .42-.09.84-.27 1.22m225.92-120.78a25.44 25.44 0 0 0-6.34-4.4 58.442 58.442 0 0 0-8.09-3.5c-2.98-1.04-5.35-1.94-7.19-2.75-1.67-.67-3.26-1.52-4.73-2.56a9.47 9.47 0 0 1-2.84-3.41 11.66 11.66 0 0 1-.95-4.73c-.04-2.5 1-4.89 2.84-6.58 2.22-1.91 5.08-2.89 8-2.75 4.03 0 7.87 1.73 10.56 4.73 3.04 3.28 5.02 7.41 5.68 11.83v.47h5.44l-1.04-23.43h-5.49l-1.37 3.46a25.015 25.015 0 0 0-5.96-2.27c-2.53-.71-5.14-1.07-7.76-1.09a21.297 21.297 0 0 0-15.9 6.06c-3.87 3.76-6.08 8.9-6.15 14.29-.09 3.01.55 5.99 1.85 8.71 1.16 2.37 2.77 4.49 4.73 6.25a26.63 26.63 0 0 0 6.34 3.98c2.2 1.05 4.46 1.97 6.77 2.75 2.46.8 4.73 1.66 6.86 2.56 1.82.71 3.54 1.67 5.11 2.84 1.26.94 2.28 2.15 2.98 3.55.68 1.48 1.02 3.1.99 4.73.21 3.11-.95 6.15-3.17 8.33-2.58 2.1-5.86 3.15-9.18 2.93-2.7.05-5.35-.66-7.67-2.04a22.407 22.407 0 0 1-5.87-5.06c-1.6-2-2.93-4.19-3.98-6.53-.97-1.99-1.71-4.09-2.18-6.25v-.47h-5.4l.66 25.23h5.73l1.18-4.17c1.94 1.4 4.01 2.59 6.2 3.55 9.31 4.05 20.1 2.49 27.88-4.02 4.51-4.14 7-10.03 6.82-16.14.07-2.85-.44-5.69-1.51-8.33-.96-2.27-2.38-4.32-4.17-6.01m53.9 25.89c-1.4.44-2.84.7-4.31.76-1.57.2-3.15.31-4.73.33-1.79.15-3.58-.11-5.25-.76a6.297 6.297 0 0 1-2.84-2.84c-.73-1.48-1.18-3.09-1.33-4.73 0-1.99-.28-45.06-.28-45.06h18.08v-8.47h-18.22v-21.58h-12.78v21.58h-11.74v7.86h11.45v46.29c-.27 4.52.93 9 3.41 12.78 2.88 3.37 7.22 5.14 11.64 4.73 3.21.07 6.4-.37 9.47-1.33 2.46-.9 5.16-1.94 7.95-3.22h.33v-6.63l-.85.28Zm-32.82 460.46h3.28c3.71 0 6.9-1.35 6.9-4.88 0-2.48-1.81-4.97-6.9-4.97-1.1 0-2.2.08-3.28.25v9.6Zm0 15.71h-4.55V751.6c2.66-.44 5.85-.67 8.04-.67s6.19.53 8.84 2.15a6.723 6.723 0 0 1 2.57 5.85 7.024 7.024 0 0 1-5.52 6.9v.25c2.48.42 4.21 2.69 4.76 6.9.24 2.4.83 4.76 1.77 6.99h-4.88a20.28 20.28 0 0 1-1.94-7.24c-.15-2.93-2.44-4.98-5.53-4.98s-3.73.01-3.73.01l.17 12.21Z" className="cls-1"/>
          <path d="M889 737.05c-15.69 0-28.4 12.72-28.4 28.4s12.72 28.4 28.4 28.4 28.4-12.72 28.4-28.4-12.72-28.4-28.4-28.4Zm0 53.02c-13.59 0-24.61-11.02-24.61-24.61s11.02-24.61 24.61-24.61 24.61 11.02 24.61 24.61-11.02 24.61-24.61 24.61Z" className="cls-1"/>
        </g>
      </g>
    </svg>
  </div>
));

// Enhanced progress bar with shimmer effect
const EnhancedProgressBar = memo(({ 
  progress, 
  resourcesLoaded, 
  onProgressComplete 
}: { 
  progress: number;
  resourcesLoaded: boolean;
  onProgressComplete: () => void;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  
  useEffect(() => {
    // If resources are loaded, smoothly animate to 100%
    if (resourcesLoaded && !completedRef.current) {
      const animateToComplete = () => {
        setAnimatedProgress(prev => {
          // Move faster toward 100% when resources are done
          const increment = resourcesLoaded ? 0.8 : 0.5;
          const nextValue = Math.min(prev + increment, 100);
          
          // Call onProgressComplete when we reach 100%
          if (nextValue === 100 && !completedRef.current) {
            completedRef.current = true;
            onProgressComplete();
            return 100;
          }
          
          if (nextValue < 100) {
            animationFrameRef.current = requestAnimationFrame(animateToComplete);
          }
          
          return nextValue;
        });
      };
      
      animationFrameRef.current = requestAnimationFrame(animateToComplete);
    } else if (!resourcesLoaded) {
      // Normal progress updates when still loading
      // Use actual progress as target but animate smoothly
      const animateProgress = () => {
        setAnimatedProgress(prev => {
          // Gradually move toward the target progress
          const targetProgress = Math.min(progress, 85); // Cap at 85% until resources fully loaded
          const increment = Math.max(0.15, (targetProgress - prev) / 70);
          const nextValue = prev < targetProgress
            ? Math.min(prev + increment, targetProgress)
            : targetProgress;
          
          if (nextValue < targetProgress) {
            animationFrameRef.current = requestAnimationFrame(animateProgress);
          }
          
          return nextValue;
        });
      };
      
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress, resourcesLoaded, onProgressComplete]);
  
  // Calculate shimmer background size based on progress
  const shimmerStyle = {
    width: `${animatedProgress}%`,
    transition: 'width 400ms ease-out',
    backgroundImage: 'linear-gradient(90deg, #ee3831 0%, #ff5b54 50%, #ee3831 100%)',
    backgroundSize: '200% 100%',
    animation: 'progress-shimmer 2s infinite linear',
    boxShadow: '0 0 8px rgba(238, 56, 49, 0.6)'
  };
  
  return (
    <div className="w-64 bg-neutral-800 rounded-full h-2 mt-8 overflow-hidden">
      <div 
        className="h-full rounded-full" 
        style={shimmerStyle}
      />
    </div>
  );
});

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
  resourcesLoaded: boolean;
  transitionDuration: number;
  onProgressComplete: () => void;
  minDisplayTime: number;
}

// Memoized loading screen with enhanced visuals but no progress bar
const LoadingScreen = memo<LoadingScreenProps>(({ 
  isLoading, 
  progress, 
  resourcesLoaded,
  transitionDuration,
  onProgressComplete,
  minDisplayTime
}) => {
  const [canHide, setCanHide] = useState(false);
  
  // Force the screen to stay visible for minDisplayTime
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanHide(true);
      console.log('Minimum display time elapsed, screen can now hide');
    }, minDisplayTime);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Monitor progress silently
  useEffect(() => {
    if (resourcesLoaded) {
      onProgressComplete();
    }
  }, [resourcesLoaded, onProgressComplete]);

  // Only allow hiding when canHide is true
  const actuallyHiding = isLoading ? false : canHide;

  return (
    <div 
      className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-50"
      style={{ 
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        opacity: actuallyHiding ? 0 : 1,
        pointerEvents: actuallyHiding ? 'none' : 'auto'
      }}
    >
      <AnimatedLogo />
    </div>
  );
}); 
/**
 * SimplePreloader - A streamlined preloader that manages loading resources and 
 * transitioning to the application with a custom animated SVG logo.
 * Now supports routing to login screen after preloading completes.
 */
const SimplePreloader: React.FC<SimplePreloaderProps> = ({ 
  children, 
  minDisplayTime = 2000, // Set to 2000ms (2 seconds) minimum display time
  transitionDuration = 800,
  onComplete,
  routeToLoginAfterComplete = false
}) => {
  const { isPreloaderComplete, markPreloaderComplete } = usePreloader();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStartTime] = useState<number>(Date.now());
  const minTimeElapsedRef = useRef(false);
  
  // Handle resource loading completion
  const handleResourcesLoaded = () => {
    setResourcesLoaded(true);
    
    // Implement minimum display time check
    const elapsedTime = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    if (remainingTime > 0) {
      // Wait for the minimum display time before completing
      setTimeout(() => {
        minTimeElapsedRef.current = true;
        // Check if progress is also complete to finish loading
        if (progressComplete) {
          setIsLoading(false);
        }
      }, remainingTime);
    } else {
      // Minimum time already elapsed
      minTimeElapsedRef.current = true;
    }
  };
  
  // Handle progress bar reaching 100%
  const handleProgressComplete = () => {
    setProgressComplete(true);
  };
  
  // When both resources are loaded AND progress bar has hit 100% AND minimum time elapsed,
  // we can transition out the loading screen
  useEffect(() => {
    if (resourcesLoaded && progressComplete) {
      const elapsedTime = Date.now() - loadingStartTime;
      
      if (elapsedTime >= minDisplayTime || minTimeElapsedRef.current) {
        // Minimum time has passed, hide the loading screen
        setIsLoading(false);
        
        // Mark preloader as complete in context
        markPreloaderComplete();
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
        
        // Only redirect to login if on the root path and routeToLoginAfterComplete is true
        if (routeToLoginAfterComplete && typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          // Only redirect if on the root path
          if (currentPath === '/') {
            router.push('/login');
          }
        }
      } else {
        // Wait for the remaining time
        const remainingTime = minDisplayTime - elapsedTime;
        setTimeout(() => {
          setIsLoading(false);
          markPreloaderComplete();
          if (onComplete) {
            onComplete();
          }
          
          // Only redirect to login if on the root path and routeToLoginAfterComplete is true
          if (routeToLoginAfterComplete && typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            // Only redirect if on the root path
            if (currentPath === '/') {
              router.push('/login');
            }
          }
        }, remainingTime);
      }
    }
  }, [resourcesLoaded, progressComplete, minDisplayTime, loadingStartTime, onComplete, markPreloaderComplete, routeToLoginAfterComplete, router]);

  // Update progress
  const handleProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <>
      <ResourceLoader
        onProgress={handleProgress}
        onComplete={handleResourcesLoaded}
      />
      
      {/* Only show preloader if not already completed */}
      {!isPreloaderComplete && (
        <>
          {/* Always render children, but fade in when loading is complete */}
          <div 
            style={{ 
              opacity: isLoading ? 0 : 1,
              transition: `opacity ${transitionDuration}ms ease-in-out`,
              visibility: isLoading ? 'hidden' : 'visible' 
            }}
          >
            {children}
          </div>
          
          {/* Loading screen */}
          <LoadingScreen 
            isLoading={isLoading} 
            progress={progress}
            resourcesLoaded={resourcesLoaded}
            transitionDuration={transitionDuration}
            onProgressComplete={handleProgressComplete}
            minDisplayTime={minDisplayTime}
          />
        </>
      )}

      {/* If preloader already completed, just show children */}
      {isPreloaderComplete && children}
    </>
  );
};

export default SimplePreloader;

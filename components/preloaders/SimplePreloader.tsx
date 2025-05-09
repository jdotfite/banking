'use client';

import React, { useState, useEffect, memo, useRef } from 'react';
import ResourceLoader from './ResourceLoader';
import { useRouter } from 'next/navigation';

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
        {/* White rectangles scaled to fit */}
        <g transform="translate(362, 362) scale(12.5)">
          <rect x="4" y="4" width="6" height="16" fill="white"></rect>
          <rect x="14" y="4" width="6" height="8" fill="white"></rect>
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
    <div className="w-64 bg-gray-800 rounded-full h-2 mt-8 overflow-hidden">
      <div 
        className="h-full rounded-full" 
        style={shimmerStyle}
      />
    </div>
  );
});

// Memoized loading screen with enhanced visuals but no progress bar
const LoadingScreen = memo(({ 
  isLoading, 
  progress, 
  resourcesLoaded,
  transitionDuration,
  onProgressComplete 
}: { 
  isLoading: boolean; 
  progress: number;
  resourcesLoaded: boolean;
  transitionDuration: number;
  onProgressComplete: () => void;
}) => {
  // Monitor progress silently without showing the bar
  useEffect(() => {
    if (resourcesLoaded) {
      // Call progress complete when resources are loaded
      onProgressComplete();
    }
  }, [resourcesLoaded, onProgressComplete]);

  return (
    <div 
      className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-50"
      style={{ 
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none'
      }}
    >
      <AnimatedLogo />
      {/* Progress bar removed */}
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
  minDisplayTime = 2000, // Increased for better animation viewing
  transitionDuration = 800,
  onComplete,
  routeToLoginAfterComplete = true // Default to routing to login when done
}) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [progressComplete, setProgressComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStartTime] = useState<number>(Date.now());
  
  // Handle resource loading completion
  const handleResourcesLoaded = () => {
    setResourcesLoaded(true);
    
    // Check minimum display time
    const currentTime = Date.now();
    const elapsedTime = currentTime - loadingStartTime;
    
    // Set minimum display time if needed
    if (elapsedTime < minDisplayTime) {
      setTimeout(() => {
        // We still need to wait for the progress bar to complete
      }, minDisplayTime - elapsedTime);
    }
  };
  
  // Handle progress bar reaching 100%
  const handleProgressComplete = () => {
    setProgressComplete(true);
  };
  
  // When both resources are loaded AND progress bar has hit 100%,
  // we can transition out the loading screen and route to login if needed
  useEffect(() => {
    if (resourcesLoaded && progressComplete) {
      // Route to login page if specified - do this BEFORE removing the loading screen
      // so we don't see the admin page flash briefly
      if (routeToLoginAfterComplete) {
        router.push('/login');
      }
      
      // Add a small delay to ensure routing happens before transition
      const timer = setTimeout(() => {
        setIsLoading(false);
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
      }, 200); // Small buffer to ensure routing happens first
      
      return () => clearTimeout(timer);
    }
  }, [resourcesLoaded, progressComplete, onComplete, routeToLoginAfterComplete, router, transitionDuration]);

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
      />
    </>
  );
};

export default SimplePreloader;

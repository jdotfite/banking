// components/layout/AppContainer.tsx
'use client';

import React, { useEffect } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import dynamic from 'next/dynamic';

// Dynamically import the PWA install prompt to avoid SSR issues
const PWAInstallPrompt = dynamic(
  () => import('../ui/common/PWAInstallPrompt'),
  { ssr: false }
);

interface AppContainerProps {
  children: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const { theme } = useTheme();
  
  // Add class to body when in standalone mode (PWA)
  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    if (isStandalone) {
      document.body.classList.add('pwa-mode');
    }
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.body.classList.add('pwa-mode');
      } else {
        document.body.classList.remove('pwa-mode');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className="min-h-screen flex justify-center bg-neutral-800">
      {/* Main container with proper constraints - add id for iOS scrolling */}
      <div 
        id="app-container" 
        className="w-full relative min-h-screen bg-app-black text-white overflow-hidden app-no-select
          md:max-w-sm lg:max-w-md xl:max-w-md 
          md:my-5 lg:my-10 xl:my-10
          md:rounded-2xl lg:rounded-2xl xl:rounded-2xl
          md:shadow-2xl lg:shadow-2xl xl:shadow-2xl
          md:border md:border-gray-800 lg:border lg:border-gray-800 xl:border xl:border-gray-800
          md:min-h-[650px] lg:min-h-[750px] xl:min-h-[750px]
          md:max-h-[90vh] lg:max-h-[90vh] xl:max-h-[90vh]
          transition-all duration-300"
      >
        {/* Phone frame styling for desktop view */}
        <div className="hidden md:block absolute top-3 w-28 h-6 bg-black rounded-b-2xl left-1/2 transform -translate-x-1/2"></div>
        
        {/* Content with proper padding for bottom elements */}
        <div className="md:mt-6 pb-16 md:pb-0 h-full flex flex-col">
          {children}
        </div>
        
        {/* PWA Install Prompt - only shown in client */}
        <PWAInstallPrompt />
      </div>
    </div>
  );
};

export default AppContainer;
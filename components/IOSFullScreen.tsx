// components/IOSFullScreen.tsx
'use client';

import React, { useEffect } from 'react';

/**
 * Component to handle iOS fullscreen behavior
 * This helps with iOS PWA display and handling the safe areas
 */
const IOSFullScreen: React.FC = () => {
  useEffect(() => {
    // Function to handle iOS fullscreen
    const handleIOSFullscreen = () => {
      // Only run on iOS devices
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      if (isIOS) {
        // Add iOS specific meta tags and classes if needed
        document.documentElement.classList.add('ios-device');
        
        // Handle iOS status bar
        if (window.navigator && (window.navigator as any).standalone) {
          document.documentElement.classList.add('ios-standalone');
        }
      }
    };

    // Run on mount
    handleIOSFullscreen();
    
    // Add event listener for orientation changes
    window.addEventListener('orientationchange', handleIOSFullscreen);
    
    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleIOSFullscreen);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default IOSFullScreen;

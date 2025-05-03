// components/preloaders/CompleteBankingPreloader.js
import React, { useState, useEffect } from 'react';
import ImagePreloader from './ImagePreloader';
import BankingDataPreloader from './BankingDataPreloader';
import { preloaderConfig } from '@/lib/config/preloaderConfig';

/**
 * Comprehensive Banking App Preloader
 * Handles preloading of all required assets and data
 */
const CompleteBankingPreloader = ({ children, onComplete }) => {
  // Preloading states
  const [dataLoadingComplete, setDataLoadingComplete] = useState(false);
  const [imageLoadingComplete, setImageLoadingComplete] = useState(false);
  const [dataProgress, setDataProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  
  // Get configuration
  const config = preloaderConfig;
  
  // Calculate overall progress (50% data, 50% images)
  const totalProgress = Math.round((dataProgress * 0.5) + (imageProgress * 0.5));
  
  // Check if everything is loaded
  const isAppReady = dataLoadingComplete && imageLoadingComplete;
  
  // Add a small delay after loading completes for a smoother transition
  const [showApp, setShowApp] = useState(false);
  
  useEffect(() => {
    if (isAppReady) {
      const timer = setTimeout(() => {
        setShowApp(true);
        if (onComplete) onComplete();
      }, config.loadingScreen.transitionDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isAppReady, config.loadingScreen.transitionDuration, onComplete]);
  
  // Loading screen component
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-[#1c1c1c] flex flex-col items-center justify-center z-50">
      <div className="w-24 h-24">
        <img 
          src={config.loadingScreen.logo} 
          alt="Members 1st" 
          className="w-full h-full object-contain animate-spin"
          style={{
            animationDuration: '2s',
            animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
          }}
        />
      </div>
    </div>
  );
  
  return (
    <>
      {/* Preloader components */}
      <BankingDataPreloader 
        onProgress={setDataProgress}
        onComplete={() => setDataLoadingComplete(true)}
        options={{
          preProcessData: config.bankingData.preProcessData,
          simulateApiDelay: config.bankingData.simulateApiDelay
        }}
      />
      
      <ImagePreloader 
        onProgress={setImageProgress}
        onComplete={() => setImageLoadingComplete(true)}
        options={{
          timeout: config.images.timeout,
          retries: config.images.retries,
          parallel: config.images.parallel,
          priorityImages: config.images.priorityImages
        }}
      />
      
      {/* Show app or loading screen */}
      {showApp ? children : <LoadingScreen />}
    </>
  );
};

export default CompleteBankingPreloader;

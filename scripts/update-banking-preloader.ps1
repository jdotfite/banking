// scripts/update-banking-preloader.ps1
$content = @"
// components/preloaders/CompleteBankingPreloader.js
import React, { useState, useEffect } from 'react';
import ImagePreloader from './ImagePreloader';
import BankingDataPreloader from './BankingDataPreloader';

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
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAppReady, onComplete]);
  
  // Loading screen component
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-app-black flex flex-col items-center justify-center z-50">
      <div className="w-24 h-24 mb-8">
        <img 
          src="/images/icons/logo.png" 
          alt="Members 1st" 
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
      
      <h1 className="text-2xl font-medium text-white mb-8">
        Members 1st Banking
      </h1>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-red-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: \`\${totalProgress}%\` }}
        ></div>
      </div>
      
      <p className="text-gray-400 text-sm">
        {totalProgress < 100 ? \`Loading your account... \${totalProgress}%\` : 'Almost ready...'}
      </p>
    </div>
  );
  
  return (
    <>
      {/* Preloader components */}
      <BankingDataPreloader 
        onProgress={setDataProgress}
        onComplete={() => setDataLoadingComplete(true)}
        options={{
          preProcessData: true,
          simulateApiDelay: 1500  // 1.5 seconds of simulated API time
        }}
      />
      
      <ImagePreloader 
        onProgress={setImageProgress}
        onComplete={() => setImageLoadingComplete(true)}
        options={{
          timeout: 10000,
          retries: 2,
          parallel: 8
        }}
      />
      
      {/* Show app or loading screen */}
      {showApp ? children : <LoadingScreen />}
    </>
  );
};

export default CompleteBankingPreloader;
"@

Set-Content -Path "./components/preloaders/CompleteBankingPreloader.js" -Value $content -Force

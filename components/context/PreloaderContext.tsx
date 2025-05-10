'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreloaderContextType {
  isPreloaderComplete: boolean;
  markPreloaderComplete: () => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  isPreloaderComplete: false,
  markPreloaderComplete: () => {},
});

export const PreloaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  useEffect(() => {
    // Always start with preloader not complete
    setIsPreloaderComplete(false);
  }, []);

  const markPreloaderComplete = () => {
    sessionStorage.setItem('preloader-complete', 'true');
    setIsPreloaderComplete(true);
  };

  return (
    <PreloaderContext.Provider value={{ isPreloaderComplete, markPreloaderComplete }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);

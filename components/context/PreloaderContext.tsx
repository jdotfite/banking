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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsPreloaderComplete(sessionStorage.getItem('preloader-complete') === 'true');
    setHasMounted(true);
  }, []);

  const markPreloaderComplete = () => {
    sessionStorage.setItem('preloader-complete', 'true');
    setIsPreloaderComplete(true);
  };

  if (!hasMounted) {
    // Prevent hydration mismatch: render nothing until client-side mount
    return null;
  }

  return (
    <PreloaderContext.Provider value={{ isPreloaderComplete, markPreloaderComplete }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);

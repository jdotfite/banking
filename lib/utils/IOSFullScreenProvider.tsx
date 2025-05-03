'use client';

import React, { ReactNode } from 'react';
import IOSFullScreen from '@/components/IOSFullScreen';

interface IOSFullScreenProviderProps {
  children: ReactNode;
}

/**
 * Wrapper component that includes the IOSFullScreen component
 * This helps prevent unnecessary re-renders when IOSFullScreen changes
 */
const IOSFullScreenProvider: React.FC<IOSFullScreenProviderProps> = ({ children }) => {
  return (
    <>
      <IOSFullScreen />
      {children}
    </>
  );
};

export default IOSFullScreenProvider;

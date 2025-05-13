// pages/_app.tsx
import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { BankingDataProvider } from '@/components/context/BankingDataProvider';
import { useAppInitialization } from '@/lib/utils/appInit';

export default function App({ Component, pageProps }: AppProps) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  // Initialize app features
  useAppInitialization();
  
  // Skip preloading in development mode for faster refreshes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsPreloaded(true);
    }
  }, []);

  return (
    <BankingDataProvider>
      <Component {...pageProps} />
    </BankingDataProvider>
  );
}

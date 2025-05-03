// lib/utils/appInit.ts
// Import this file in your _app.tsx to initialize app-wide features

import { useEffect } from 'react';

/**
 * Initialize application-wide features
 * Place in _app.tsx component
 */
export const useAppInitialization = () => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      console.log('?? Initializing app features...');
      
      // Initialize banking data if not already loaded
      if (!localStorage.getItem('members1stBankingData')) {
        console.log('?? Initializing banking data...');
        // Will be handled by the BankingDataProvider
      }
      
      // Initialize PWA features if in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone) {
        console.log('?? Running in PWA mode');
        // Additional PWA-specific initializations
      }
      
      console.log('? App initialization complete!');
    }
  }, []);
  
  // No return value needed for this hook
  return null;
};

export default useAppInitialization;

// scripts/create-app-init-file.ps1
$content = @"
// lib/utils/appInit.ts
// Import this file in your _app.tsx to initialize app-wide features

import { useEffect } from 'react';

// Import initialization utilities
import { initBankingData } from './initBankingData';

/**
 * Initialize application-wide features
 * Place in _app.tsx component
 */
export const useAppInitialization = () => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      console.log('?? Initializing app features...');
      
      // Initialize banking data
      initBankingData();
      
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
"@

New-Item -Path "./lib/utils" -ItemType Directory -Force
Set-Content -Path "./lib/utils/appInit.ts" -Value $content -Force
Write-Host "? Created app initialization utility"

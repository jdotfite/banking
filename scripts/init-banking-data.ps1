// scripts/init-banking-data.ps1
$content = @"
// Initialize banking data on app load
// Add this to your client-side entry point

import { bankingData } from '@/components/preloaders/fakeBankingData';

// Function to initialize banking data in localStorage if not already present
export function initBankingData() {
  if (typeof window !== 'undefined') {
    // Check if data exists
    const existingData = localStorage.getItem('members1stBankingData');
    
    if (!existingData) {
      console.log('Initializing Members 1st banking data in localStorage');
      localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
    } else {
      console.log('Members 1st banking data already exists in localStorage');
    }
  }
}

// Auto-initialize
initBankingData();
"@

New-Item -Path "./lib/utils" -ItemType Directory -Force
Set-Content -Path "./lib/utils/initBankingData.ts" -Value $content -Force

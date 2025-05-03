Set-Content -Path './pages/_app.tsx' -Value '// pages/_app.tsx
import React, { useState, useEffect } from ''react'';
import type { AppProps } from ''next/app'';
import { BankingDataProvider } from ''@/components/preloaders/BankingDataPreloader'';
import CompleteBankingPreloader from ''@/components/preloaders/CompleteBankingPreloader'';

export default function App({ Component, pageProps }: AppProps) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  // Skip preloading in development mode for faster refreshes
  useEffect(() => {
    if (process.env.NODE_ENV === ''development'') {
      setIsPreloaded(true);
    }
  }, []);

  return (
    <BankingDataProvider>
      {process.env.NODE_ENV === ''development'' || isPreloaded ? (
        <Component {...pageProps} />
      ) : (
        <CompleteBankingPreloader onComplete={() => setIsPreloaded(true)}>
          <Component {...pageProps} />
        </CompleteBankingPreloader>
      )}
    </BankingDataProvider>
  );
}' -Force

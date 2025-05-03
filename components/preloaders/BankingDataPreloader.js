// BankingDataPreloader.js
// Specialized component for preloading and processing banking data

import React, { useState, useEffect, useContext, createContext } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';

// Create context for banking data
const BankingDataContext = createContext(null);

/**
 * Banking Data Provider
 * Provides access to preloaded banking data throughout the app
 */
export const BankingDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on mount
  useEffect(() => {
    // In a real app, this would be an API call
    // We're using the fake data for demo purposes
    const loadData = async () => {
      try {
        // Get cached data if available
        const cachedData = localStorage.getItem('members1stBankingData');
        
        if (cachedData) {
          setData(JSON.parse(cachedData));
        } else {
          // Process and cache the data
          localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
          setData(bankingData);
        }
      } catch (err) {
        console.error('Error loading banking data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Context value
  const value = {
    data,
    isLoading,
    error,
    refreshData: () => {
      setIsLoading(true);
      localStorage.removeItem('members1stBankingData');
      localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
      setData(bankingData);
      setIsLoading(false);
    }
  };

  return (
    <BankingDataContext.Provider value={value}>
      {children}
    </BankingDataContext.Provider>
  );
};

// Custom hook to access banking data
export const useBankingData = () => {
  const context = useContext(BankingDataContext);
  if (!context) {
    throw new Error('useBankingData must be used within a BankingDataProvider');
  }
  return context;
};

/**
 * Banking Data Preloader
 * 
 * Preloads and processes all necessary banking data before showing the app
 * 
 * @param {Function} onComplete - Callback when data is loaded
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {Object} options - Configuration options
 */
const BankingDataPreloader = ({ onComplete, onProgress, options = {} }) => {
  // Default options
  const config = {
    simulateApiDelay: options.simulateApiDelay || 800,
    mockNetworkConditions: options.mockNetworkConditions || false,
    preProcessData: options.preProcessData || false,
    ...options
  };

  // Preload stages
  const stages = [
    { name: 'Authenticating', weight: 15 },
    { name: 'Loading account data', weight: 25 },
    { name: 'Processing transactions', weight: 30 },
    { name: 'Preparing interface', weight: 30 }
  ];

  // Load data in stages to simulate real banking app experience
  useEffect(() => {
    let active = true;
    let currentProgress = 0;
    let stageIndex = 0;

    const processStage = async (stage) => {
      if (!active) return;

      // Start this stage
      console.log(`Processing stage: ${stage.name}`);
      
      // Calculate progress range for this stage
      const startProgress = currentProgress;
      const endProgress = currentProgress + stage.weight;
      
      // Simulate processing with progress updates
      const steps = 10;
      for (let i = 0; i < steps; i++) {
        if (!active) return;
        
        await new Promise(resolve => 
          setTimeout(resolve, config.simulateApiDelay / steps)
        );
        
        // Calculate and report progress
        const stageProgress = startProgress + (stage.weight * (i + 1) / steps);
        currentProgress = Math.min(stageProgress, 100);
        onProgress && onProgress(Math.round(currentProgress));
      }
      
      // Optional network condition simulation
      if (config.mockNetworkConditions && Math.random() < 0.1) {
        // 10% chance of slight delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    const loadData = async () => {
      try {
        // Process each stage
        for (const stage of stages) {
          await processStage(stage);
          stageIndex++;
        }
        
        // Process banking data based on config
        if (config.preProcessData) {
          // In a real app, we might pre-calculate balances, categorize transactions, etc.
          console.log('Pre-processing banking data...');
          
          // Create a copy of the data to avoid mutations
          const processedData = JSON.parse(JSON.stringify(bankingData));
          
          // Example: Add transaction totals by category
          processedData.users.forEach(user => {
            const userTransactions = [];
            
            // Collect all user transactions
            Object.values(processedData.transactions[user.id] || {}).forEach(accountTxs => {
              userTransactions.push(...accountTxs);
            });
            
            // Calculate category totals
            const categoryTotals = userTransactions.reduce((totals, tx) => {
              if (!tx.isIncoming) {
                const category = tx.category || 'other';
                totals[category] = (totals[category] || 0) + tx.amount;
              }
              return totals;
            }, {});
            
            // Add to user data
            processedData.categoryTotals = processedData.categoryTotals || {};
            processedData.categoryTotals[user.id] = categoryTotals;
          });
          
          // Store processed data
          localStorage.setItem('members1stBankingData', JSON.stringify(processedData));
        } else {
          // Just store the original data
          localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
        }
        
        // Complete
        onComplete && onComplete();
      } catch (error) {
        console.error('Error in data preloading:', error);
        
        // Store fallback data to allow app to run
        localStorage.setItem('members1stBankingData', JSON.stringify(bankingData));
        
        // Still call onComplete to let app load
        onComplete && onComplete();
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [config, onComplete, onProgress]);

  // This component doesn't render anything visual
  return null;
};

export default BankingDataPreloader;

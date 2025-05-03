'use client';

import { useState, useEffect } from 'react';
import { useBankingData } from '@/components/context/UnifiedBankingDataProvider';
import { getTransactionsByPeriod } from '@/lib/data/transactions';
import { TransactionDateGroup, TransactionType } from '@/lib/types';

interface UseTransactionDataOptions {
  initialPeriod?: string;
  filterByCategory?: string | string[];
  filterByMerchant?: string | string[];
  filterByAmount?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'date' | 'amount' | 'merchant';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
}

interface UseTransactionDataResult {
  transactionGroups: TransactionDateGroup[];
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  isLoading: boolean;
  error: Error | null;
  totalSpent: number;
  totalIncoming: number;
  netAmount: number;
  filterTransactions: (options: Partial<UseTransactionDataOptions>) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for managing transaction data
 * 
 * This hook encapsulates the logic for fetching, filtering, and sorting transaction data
 */
export const useTransactionData = (options: UseTransactionDataOptions = {}): UseTransactionDataResult => {
  // Default options
  const {
    initialPeriod = 'month',
    filterByCategory = [],
    filterByMerchant = [],
    filterByAmount = {},
    sortBy = 'date',
    sortDirection = 'desc',
    limit
  } = options;

  // State
  const [selectedPeriod, setSelectedPeriod] = useState<string>(initialPeriod);
  const [transactionGroups, setTransactionGroups] = useState<TransactionDateGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<TransactionDateGroup[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: Array.isArray(filterByCategory) ? filterByCategory : [filterByCategory].filter(Boolean),
    merchants: Array.isArray(filterByMerchant) ? filterByMerchant : [filterByMerchant].filter(Boolean),
    amount: filterByAmount,
    sortBy,
    sortDirection,
    limit
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncoming, setTotalIncoming] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Get banking data
  const { userData, isLoading: isBankingDataLoading } = useBankingData();

  // Update transactions when period changes
  useEffect(() => {
    try {
      // If banking data is available, try to use it first
      if (userData && userData.groupedTransactions && userData.groupedTransactions.length > 0) {
        setTransactionGroups(userData.groupedTransactions);
      } else {
        // Fall back to predefined transactions
        const updatedTransactions = getTransactionsByPeriod(selectedPeriod);
        setTransactionGroups(updatedTransactions);
      }
    } catch (err) {
      console.error('Error loading transaction data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading transaction data'));
    }
  }, [selectedPeriod, userData]);

  // Apply filters when transaction groups or filter options change
  useEffect(() => {
    if (transactionGroups.length === 0) return;

    try {
      // Create a deep copy to avoid mutating the original data
      const groupsCopy = JSON.parse(JSON.stringify(transactionGroups)) as TransactionDateGroup[];

      // Apply filters to each group's transactions
      const filtered = groupsCopy.map(group => {
        let transactions = [...group.transactions];

        // Filter by category
        if (filterOptions.categories.length > 0) {
          transactions = transactions.filter(tx => 
            filterOptions.categories.includes(tx.category || '')
          );
        }

        // Filter by merchant
        if (filterOptions.merchants.length > 0) {
          transactions = transactions.filter(tx => 
            filterOptions.merchants.includes(tx.merchant)
          );
        }

        // Filter by amount
        if (filterOptions.amount.min !== undefined || filterOptions.amount.max !== undefined) {
          transactions = transactions.filter(tx => {
            const { min, max } = filterOptions.amount;
            if (min !== undefined && tx.amount < min) return false;
            if (max !== undefined && tx.amount > max) return false;
            return true;
          });
        }

        // Sort transactions
        if (filterOptions.sortBy) {
          transactions.sort((a, b) => {
            let comparison = 0;

            switch (filterOptions.sortBy) {
              case 'date':
                // For date, we use the timestamp
                comparison = a.timestamp.localeCompare(b.timestamp);
                break;
              case 'amount':
                comparison = a.amount - b.amount;
                break;
              case 'merchant':
                comparison = a.merchant.localeCompare(b.merchant);
                break;
            }

            // Apply sort direction
            return filterOptions.sortDirection === 'asc' ? comparison : -comparison;
          });
        }

        // Apply limit if specified
        if (filterOptions.limit && transactions.length > filterOptions.limit) {
          transactions = transactions.slice(0, filterOptions.limit);
        }

        return {
          ...group,
          transactions
        };
      });

      // Remove empty groups
      const nonEmptyGroups = filtered.filter(group => group.transactions.length > 0);

      // Calculate totals
      let spent = 0;
      let incoming = 0;

      nonEmptyGroups.forEach(group => {
        group.transactions.forEach(tx => {
          if (tx.isIncoming) {
            incoming += tx.amount;
          } else {
            spent += tx.amount;
          }
        });
      });

      setTotalSpent(spent);
      setTotalIncoming(incoming);
      setFilteredGroups(nonEmptyGroups);
    } catch (err) {
      console.error('Error filtering transaction data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error filtering transaction data'));
    }
  }, [transactionGroups, filterOptions]);

  // Function to update filter options
  const filterTransactions = (newOptions: Partial<UseTransactionDataOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      categories: newOptions.filterByCategory 
        ? (Array.isArray(newOptions.filterByCategory) 
            ? newOptions.filterByCategory 
            : [newOptions.filterByCategory].filter(Boolean))
        : prev.categories,
      merchants: newOptions.filterByMerchant
        ? (Array.isArray(newOptions.filterByMerchant)
            ? newOptions.filterByMerchant
            : [newOptions.filterByMerchant].filter(Boolean))
        : prev.merchants,
      amount: newOptions.filterByAmount || prev.amount,
      sortBy: newOptions.sortBy || prev.sortBy,
      sortDirection: newOptions.sortDirection || prev.sortDirection,
      limit: newOptions.limit !== undefined ? newOptions.limit : prev.limit
    }));
  };

  // Function to reset filters
  const resetFilters = () => {
    setFilterOptions({
      categories: [],
      merchants: [],
      amount: {},
      sortBy: 'date',
      sortDirection: 'desc',
      limit: undefined
    });
  };

  return {
    transactionGroups: filteredGroups,
    selectedPeriod,
    setSelectedPeriod,
    isLoading: isBankingDataLoading,
    error,
    totalSpent,
    totalIncoming,
    netAmount: totalIncoming - totalSpent,
    filterTransactions,
    resetFilters
  };
};

export default useTransactionData;

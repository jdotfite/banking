// components/context/UserContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';

// Define the context types
type UserContextType = {
  selectedUserId: string | null;
  isNewUser: boolean;
  isAdminMode: boolean;
  setSelectedUserId: (userId: string | null) => void;
  toggleAdminMode: () => void;
  resetUserSelection: () => void;
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  selectedUserId: null,
  isNewUser: false,
  isAdminMode: true,
  setSelectedUserId: () => {},
  toggleAdminMode: () => {},
  resetUserSelection: () => {},
});

// Props for the provider component
interface UserProviderProps {
  children: ReactNode;
  initialAdminMode?: boolean;
}

// Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ 
  children, 
  initialAdminMode = process.env.NODE_ENV === 'development' 
}) => {
  // State for selected user ID
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // State for admin mode
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialAdminMode);
  // Derived state for new user
  const isNewUser = selectedUserId === 'new';

  // Load selected user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('selectedUserId');
    if (storedUserId) {
      setSelectedUserId(storedUserId === 'new' ? 'new' : storedUserId);
      // If a user is already selected, exit admin mode
      if (isAdminMode) {
        setIsAdminMode(false);
      }
    }
  }, [isAdminMode]);

  // Handle user selection
  const handleSetSelectedUserId = (userId: string | null) => {
    if (userId === 'new') {
      localStorage.setItem('selectedUserId', 'new');
      setSelectedUserId('new');
    } else if (userId) {
      localStorage.setItem('selectedUserId', userId);
      setSelectedUserId(userId);
    } else {
      localStorage.removeItem('selectedUserId');
      setSelectedUserId(null);
    }
    
    // Exit admin mode when a user is selected
    if (isAdminMode) {
      setIsAdminMode(false);
    }
  };

  // Toggle admin mode
  const toggleAdminMode = () => {
    setIsAdminMode(prev => !prev);
  };

  // Reset user selection and go back to admin mode
  const resetUserSelection = () => {
    localStorage.removeItem('selectedUserId');
    setSelectedUserId(null);
    setIsAdminMode(true);
  };

  // Context value
  const value = {
    selectedUserId,
    isNewUser,
    isAdminMode,
    setSelectedUserId: handleSetSelectedUserId,
    toggleAdminMode,
    resetUserSelection,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

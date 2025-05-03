// components/AppRoot.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from '@/components/context/UserContext';
import { EnhancedBankingDataProvider } from '@/components/preloaders/EnhancedBankingDataProvider';
import { BankingDataProvider } from '@/components/preloaders/BankingDataPreloader';
import AppContainer from '@/components/layout/AppContainer';
import AdminProfileSelector from '@/components/screens/AdminProfileSelector';
import Home from '@/components/screens/Home';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';

// Inner component that uses the context
const AppContent: React.FC = () => {
  const { selectedUserId, isAdminMode, setSelectedUserId } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle redirection to onboarding flow when selectedUserId is 'new'
  useEffect(() => {
    if (selectedUserId === 'new' && typeof window !== 'undefined') {
      console.log('Redirecting to onboarding flow...');
      window.location.href = '/onboarding';
    }
  }, [selectedUserId]);

  // Handle user selection from admin screen
  const handleSelectUser = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show admin screen if in admin mode
  if (isAdminMode) {
    return <AdminProfileSelector onSelectUser={handleSelectUser} />;
  }

  // Show main app if user is selected
  if (selectedUserId) {
    // If it's a new user, redirect to the onboarding flow
    if (selectedUserId === 'new') {
      // Use window.location to navigate to the onboarding page
      if (typeof window !== 'undefined') {
        console.log('Redirecting to onboarding flow...');
        window.location.href = '/onboarding';
        return <LoadingSpinner size="large" />;
      }
    }
    return <Home />;
  }

  // Fallback to admin screen if no user is selected
  return <AdminProfileSelector onSelectUser={handleSelectUser} />;
};

// Root component that provides context
const AppRoot: React.FC = () => {
  return (
    <AppContainer>
      <AppContent />
    </AppContainer>
  );
};

export default AppRoot;

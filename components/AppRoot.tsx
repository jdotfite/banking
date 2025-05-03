// components/AppRoot.tsx
'use client';

import React, { useEffect } from 'react';
import { UserProvider, useUser } from '@/components/context/UserContext';
import { EnhancedBankingDataProvider } from '@/components/preloaders/EnhancedBankingDataProvider';
import { BankingDataProvider } from '@/components/preloaders/BankingDataPreloader';
import AppContainer from '@/components/layout/AppContainer';
import AdminProfileSelector from '@/components/screens/AdminProfileSelector';
import Home from '@/components/screens/Home';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';

// Inner component that uses the context
const AppContent: React.FC = () => {
  const { selectedUserId, isAdminMode, setSelectedUserId, resetUserSelection } = useUser();

  // Reset to admin screen when app is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetUserSelection();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [resetUserSelection]);

  // Redirect new users to onboarding
  useEffect(() => {
    if (selectedUserId === 'new' && typeof window !== 'undefined') {
      window.location.href = '/onboarding';
    }
  }, [selectedUserId]);

  // Handle user selection from admin screen
  const handleSelectUser = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  // Show admin screen if in admin mode
  if (isAdminMode) {
    return <AdminProfileSelector onSelectUser={handleSelectUser} />;
  }

  // Show main app if user is selected
  if (selectedUserId) {
    // If it's a new user, show loading spinner while redirect happens
    if (selectedUserId === 'new') {
      return <LoadingSpinner size="large" fullScreen={true} />;
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

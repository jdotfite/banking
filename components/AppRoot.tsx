// components/AppRoot.tsx
'use client';

import React, { useEffect } from 'react';
import { UserProvider, useUser } from '@/components/context/UserContext';
import AppContainer from '@/components/layout/AppContainer';
import Users from '@/app/users/components/Users';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import SimplePreloader from '@/components/preloaders/SimplePreloader';

// Inner component that uses the context
const AppContent: React.FC = () => {
  const { selectedUserId, isAdminMode, setSelectedUserId, resetUserSelection } = useUser();
  const router = useRouter();

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
    if (selectedUserId === 'new') {
      router.push('/onboarding');
    }
  }, [selectedUserId, router]);

  // Redirect to onboarding page when user is selected and on the root path
  useEffect(() => {
    // Only redirect if on the root path
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      if (selectedUserId && selectedUserId !== 'new') {
        router.push('/onboarding');
      }
    }
  }, [selectedUserId, router]);

  // Handle user selection from admin screen
  const handleSelectUser = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  // Show admin screen if in admin mode
  if (isAdminMode) {
    return <Users onSelectUser={handleSelectUser} />;
  }

  // Show main app if user is selected
  if (selectedUserId) {
    // If it's a new user, show loading spinner while redirect happens
    if (selectedUserId === 'new') {
      return <LoadingSpinner size="large" fullScreen={true} />;
    }
    
    // Show loading spinner while redirecting to home page
    return <LoadingSpinner size="large" fullScreen={true} />;
  }

  // Fallback to admin screen if no user is selected
  return <Users onSelectUser={handleSelectUser} />;
};

// Root component that provides context
const AppRoot: React.FC = () => {
  return (
    <SimplePreloader routeToLoginAfterComplete={true}>
      <AppContainer>
        <AppContent />
      </AppContainer>
    </SimplePreloader>
  );
};

export default AppRoot;

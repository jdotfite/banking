'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthViewType } from './components/types';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import RecoverUsernameForm from './components/RecoverUsernameForm';
import HelpCenter from './components/HelpCenter';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthViewType>('login');
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm setView={setCurrentView} />;
      case 'forgotPassword':
        return <ForgotPasswordForm setView={setCurrentView} />;
      case 'recoverUsername':
        return <RecoverUsernameForm setView={setCurrentView} />;
      case 'helpCenter':
        return <HelpCenter setView={setCurrentView} />;
      default:
        return <LoginForm setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-app-black text-white">
      <div className="px-5 mx-auto max-w-md">
        {renderView()}
      </div>
    </div>
  );
}

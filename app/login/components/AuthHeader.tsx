'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthHeaderProps {
  currentView: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter';
  onBack: () => void;
  title?: string; // Optional custom title override
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ currentView, onBack, title }) => {
  const router = useRouter();
  return (
    <div className="px-5 pt-8 pb-6 mx-auto max-w-md">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
      <h1 className="text-xl font-medium ml-2">
        {title || (
          <>
            {currentView === 'login' && 'Log in to your account'}
            {currentView === 'forgotPassword' && 'Reset your password'}
            {currentView === 'recoverUsername' && 'Recover your username'}
            {currentView === 'helpCenter' && 'Help Center'}
          </>
        )}
      </h1>
      </div>
    </div>
  );
};

export default AuthHeader;

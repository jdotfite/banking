'use client';

import React, { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import { animated } from 'react-spring';
import { Button, FormInput } from '../../../components/ui/form';

interface ForgotPasswordFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter' | 'faq') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Main content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error message container - aria-live */}
          <div aria-live="polite" className="sr-only">
            {error && <span id="email-error">{error}</span>}
          </div>
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Reset <span className="font-normal">password</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <FormInput
            id="reset-email"
            type="email"
            value={email}
            onChange={(value: string) => {
              setEmail(value);
              if (error) setError('');
            }}
            label="Email Address"
            autoFocus
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
          />
          
          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit">
              SEND EMAIL
            </Button>
            
            <Button 
              type="button" 
              variant="borderless"
              onClick={() => setView('login')}
              className="text-white text-sm"
            >
              Back to login
            </Button>
          </div>
          
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-200/20 mb-4">
            <Mail size={32} className="text-green-200" />
          </div>
          <h2 className="text-xl font-medium mb-2">Check your email</h2>
          <p className="text-neutral-300 mb-6">
            We've sent instructions to reset your password to {email}
          </p>
          <Button 
            onClick={() => setView('login')}
            className="w-full"
          >
            BACK TO LOGIN
          </Button>
          <p className="mt-4 text-sm text-neutral-400">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-green-200 hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      )}
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6 text-center">
          <p className="text-neutral-500 text-xs">
            If your contact information is out-of-date, please call us at
          </p>
          <a href="tel:8002377288" className="text-white text-xs font-medium mt-1 hover:underline">800-237-7288</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

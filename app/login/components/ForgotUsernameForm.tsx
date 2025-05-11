'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '../../../components/ui/form';

interface ForgotUsernameFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter' | 'faq') => void;
}

const ForgotUsernameForm: React.FC<ForgotUsernameFormProps> = ({ setView }) => {
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
    
    console.log('Username recovery requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="mb-8">
                <h1 className="text-4xl font-extralight text-white mb-2">
                  Recover <span className="font-normal">username</span>
                </h1>
                <p className="text-neutral-400 text-sm">
                  Enter your email address and we'll send you your username.
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label htmlFor="username-email" className="block text-sm font-medium text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-neutral-500" />
                  </div>
                  <input
                    type="email"
                    id="username-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit">
                  SEND USERNAME
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
                We've sent your username to {email}
              </p>
              <Button 
                onClick={() => setView('login')}
                className="w-full"
              >
                BACK TO LOGIN
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6 text-center">
          <p className="text-neutral-500 text-sm">
            If your contact information is out-of-date, please call us at
          </p>
          <a href="tel:8002377288" className="text-white font-medium mt-1 hover:underline">800-237-7288</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotUsernameForm;

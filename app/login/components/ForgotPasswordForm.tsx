'use client';

import React, { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import { animated } from 'react-spring';

interface ForgotPasswordFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
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
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-gray-300 mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
            >
              Send reset instructions
            </button>
            
            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full py-3 bg-transparent border border-gray-700 text-white font-medium rounded-lg hover:bg-white/5 transition-colors"
            >
              Back to login
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between">
            <button
              type="button"
              onClick={() => setView('recoverUsername')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Forgot username?
            </button>
            
            <button
              type="button"
              onClick={() => setView('helpCenter')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Need more help?
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-200/20 mb-4">
            <Mail size={32} className="text-green-200" />
          </div>
          <h2 className="text-xl font-medium mb-2">Check your email</h2>
          <p className="text-gray-300 mb-6">
            We've sent instructions to reset your password to {email}
          </p>
          <button
            onClick={() => setView('login')}
            className="w-full py-3 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
          >
            Back to login
          </button>
          <p className="mt-4 text-sm text-gray-400">
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
    </>
  );
};

export default ForgotPasswordForm;

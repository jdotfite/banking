'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { animated, useSpring } from 'react-spring';
import { ArrowLeft, Check } from 'lucide-react';
import { theme } from '@/lib/styles/theme';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Animation for page transitions
  const pageAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 280, friction: 60 }
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear error when user types
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // In a real app, this would call an API to send a password reset email
    console.log('Password reset requested for:', email);
    
    // Show success message
    setIsSubmitted(true);
  };

  // Go back to login
  const handleBack = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-app-black text-white p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Reset your password</h1>
      </div>

      {/* Form */}
      <animated.div style={pageAnimation}>
        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Check your email</h2>
            <p className="text-gray-300 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-400 hover:underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <p className="text-gray-300">
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-4 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
            >
              Send reset link
            </button>
            
            {/* Back to login link */}
            <div className="text-center mt-4">
              <p className="text-gray-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-white hover:underline"
                >
                  Back to login
                </button>
              </p>
            </div>
          </form>
        )}
      </animated.div>
    </div>
  );
}

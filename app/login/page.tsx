'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { animated, useSpring } from 'react-spring';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { theme } from '@/lib/styles/theme';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // In a real app, this would call an API to authenticate the user
    // For demo purposes, we'll just simulate a successful login
    console.log('Login attempt:', formData);
    
    // Simulate API call
    setTimeout(() => {
      // Set authentication cookie
      document.cookie = `auth_token=dummy_token; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      
      // Remove the 'new' user flag and set to a real user ID
      localStorage.removeItem('selectedUserId');
      localStorage.setItem('selectedUserId', 'user1');
      document.cookie = `selectedUserId=user1; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      
      // Redirect to the home page after successful login
      router.push('/');
    }, 1000);
  };

  // Go back to onboarding
  const handleBack = () => {
    router.push('/onboarding');
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
        <h1 className="text-xl font-semibold ml-2">Log in to your account</h1>
      </div>

      {/* Form */}
      <animated.div style={pageAnimation}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
              required
            />
          </div>
          
          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Remember me and forgot password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-400 hover:underline"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-4 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
          >
            Log in
          </button>
          
          {/* Sign up link */}
          <div className="text-center mt-4">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-white hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </animated.div>
    </div>
  );
}

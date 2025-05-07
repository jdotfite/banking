'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';

interface LoginFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [focused, setFocused] = useState({
    email: false,
    password: false
  });
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handleFocus = (field: 'email' | 'password') => {
    setFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (!formData[field]) {
      setFocused(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Login attempt:', formData);
    
    setTimeout(() => {
      document.cookie = `auth_token=dummy_token; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.removeItem('selectedUserId');
      localStorage.setItem('selectedUserId', 'user1');
      document.cookie = `selectedUserId=user1; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/admin');
      window.location.href = '/admin'; // Force full page reload
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#121212] relative overflow-hidden">
      {/* Simple solid background */}
      <div className={`absolute inset-0 bg-[#121212] transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full flex flex-col mx-auto px-6 relative z-10">
          {/* Main container with three-section layout */}
          <div className="flex flex-col h-full max-w-md w-full mx-auto">
          {/* MIDDLE SECTION: Combined logo, welcome and form */}
          <div className="flex-1 flex flex-col justify-center pt-8 md:pt-12 pb-4 md:pb-8">
            {/* Logo and welcome section */}
            <div className="flex items-start mb-8 relative">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-xl flex items-center justify-center">
                    <img 
                      src="/images/icons/logo-m1st-square.svg" 
                      alt="Logo" 
                      className="h-8 w-8 md:h-10 md:w-10 object-contain"
                    />
                  </div>
                  
                </div>
                <h2 className="text-2xl md:text-3xl font-extralight text-white mb-2 tracking-tight">
                  Welcome <span className="font-normal">back</span>
                </h2>
                <p className="text-neutral-400 text-sm font-light mb-6">Sign in to continue to your account</p>
              </div>
            </div>
              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm mb-4" role="alert">
                  {error}
                </p>
              )}
              
              {/* Login form with enhanced animations */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email field with floating label and corrected animations */}
                <div className="relative group">
                  <label 
                    htmlFor="email" 
                    className={`absolute transition-all duration-300 pointer-events-none ${
                      focused.email || formData.email 
                        ? 'text-xs top-0 text-neutral-400 font-light' 
                        : 'text-base top-3 text-neutral-500 font-light'
                    } left-0`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      className="w-full pt-6 pb-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:outline-none focus:ring-0 focus:border-neutral-700 transition-none text-white"
                    />
                    {/* Underline animation - stays in place */}
                    <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focused.email ? 'w-full' : ''}`}></div>
                  </div>
                </div>
                
                {/* Password field with floating label */}
                <div className="relative group">
                  <label 
                    htmlFor="password" 
                    className={`absolute transition-all duration-300 pointer-events-none ${
                      focused.password || formData.password 
                        ? 'text-xs top-0 text-neutral-400 font-light' 
                        : 'text-base top-3 text-neutral-500 font-light'
                    } left-0`}
                  >
                    Password
                  </label>
                  <div className="flex items-end">
                    {/* Password input */}
                    <div className="relative flex-1">
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => handleFocus('password')}
                          onBlur={() => handleBlur('password')}
                          className="w-full pt-6 pb-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:outline-none focus:ring-0 focus:border-neutral-700 transition-none text-white"
                        />
                        {/* Password visibility toggle positioned at the end of the input */}
                        <button
                          type="button"
                          className="absolute right-0 bottom-2 text-neutral-500 hover:text-white transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {/* Underline animation for password */}
                        <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focused.password ? 'w-full' : ''}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Remember me and forgot password */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded focus:ring-white"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-neutral-400">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-white hover:text-neutral-300 transition-colors"
                    onClick={() => setView('forgotPassword')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login button with animation */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full relative overflow-hidden py-3 md:py-4 px-6 rounded-lg font-medium tracking-wide
                      transition-all duration-300 transform 
                      ${isSubmitting
                        ? 'bg-white text-neutral-900 cursor-default' 
                        : 'bg-neutral-200 text-neutral-900 hover:bg-white'
                      }
                    `}
                  >
                    <div className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="flex space-x-2">
                            <span className="h-2 w-2 bg-neutral-900 rounded-full animate-pulse"></span>
                            <span className="h-2 w-2 bg-neutral-900 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                            <span className="h-2 w-2 bg-neutral-900 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                          </div>
                        </div>
                      ) : (
                        <span>SIGN IN</span>
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Sign up option */}
                <div className="text-center pt-1">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/signup')}
                      className="text-white hover:text-neutral-300 transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            </div>
            
            {/* BOTTOM SECTION: Help center and recover username options - anchored to bottom */}
            <div className="pb-8 md:pb-10">
              <div className="w-full border-t border-neutral-800/50 pt-4">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="text-sm text-neutral-500 hover:text-white transition-all hover:translate-x-1 flex items-center group"
                    onClick={() => setView('recoverUsername')}
                  >
                    <span>Recover username</span>
                    <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    type="button"
                    className="text-sm text-neutral-500 hover:text-white transition-all hover:translate-x-1 flex items-center group"
                    onClick={() => setView('helpCenter')}
                  >
                    <span>Need help?</span>
                    <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

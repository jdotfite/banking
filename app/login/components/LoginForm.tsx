'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { FormInput, PasswordInput, Button } from '../../../components/ui/form';

interface LoginFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setView }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, rememberMe: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      email: !formData.email ? 'Email is required' : '',
      password: !formData.password ? 'Password is required' : ''
    };

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    if (newErrors.email || newErrors.password) {
      return;
    }
    
    setIsSubmitting(true);
    console.log('Login attempt:', formData);
    
    setTimeout(() => {
      document.cookie = `auth_token=dummy_token; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.removeItem('selectedUserId');
      localStorage.setItem('selectedUserId', 'user1');
      document.cookie = `selectedUserId=user1; path=/; max-age=${60 * 60 * 24 * 7}`;
      // Redirect to home page after successful login, not onboarding
      router.push('/home');
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
                  <div className=" flex items-center justify-center">
                    <img 
                      src="/images/logos/m1st-square.svg" 
                      alt="Logo" 
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                  
                </div>
                <h2 className="text-3xl md:text-3xl font-extralight text-white mb-2 tracking-tight">
                  Welcome <span className="font-normal">back</span>
                </h2>
                <p className="text-neutral-400 font-light mb-6">Sign in to continue to your account</p>
              </div>
            </div>
              {/* Login form with enhanced animations */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error message container - aria-live */}
                <div aria-live="polite" className="sr-only">
                  {errors.email && <span id="email-error">{errors.email}</span>}
                  {errors.password && <span id="password-error">{errors.password}</span>}
                </div>
                {/* Email field */}
                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                  inputMode="email"
                  error={errors.email}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                
                {/* Password field */}
                <PasswordInput
                  id="password"
                  label="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  error={errors.password}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                
                {/* Remember me and forgot password */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleRememberMeChange}
                      className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded focus:ring-2 focus:ring-white"
                      aria-label="Remember me on this device"
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

                {/* Login button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    SIGN IN
                  </Button>
                </div>
                
                {/* Sign up option */}
                <div className="text-center pt-1">
                  <p className="text-neutral-400 text-sm">
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

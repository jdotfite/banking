'use client';

import React, { useState, useEffect } from 'react';

interface CreatePasswordScreenProps {
  formData: {
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({ 
  formData, 
  onChange, 
  onNext,
  isSubmitting = false
}) => {
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Update password strength when password changes
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) {
      strength += 1;
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    
    // Number check
    if (/\d/.test(password)) {
      strength += 1;
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    }
    
    setPasswordStrength(strength);
  };

  // Validate password
  const validatePassword = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Password must include uppercase, lowercase, and numbers');
      return false;
    }

    setError('');
    return true;
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      onNext();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Create <span className="font-normal">password</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Strong passwords keep your account safer
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-8">
            {/* Password input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => onChange('password', e.target.value)}
                className="w-full py-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_#121212_inset]"
                autoComplete="new-password"
                disabled={isSubmitting}
                placeholder=""
              />
              <div className="h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700"></div>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-0 text-neutral-400 p-2 touch-manipulation"
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {error && <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
            </div>

            {/* Password strength indicator */}
            <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  passwordStrength === 0 ? 'w-0' :
                  passwordStrength === 1 ? 'w-1/5 bg-red-500' :
                  passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                  passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                  passwordStrength === 4 ? 'w-4/5 bg-blue-500' :
                  'w-full bg-green-500'
                }`}
                aria-hidden="true"
              ></div>
            </div>

            {/* Password requirements */}
            <p className="text-neutral-500 text-sm">
              Use 8+ characters with uppercase, lowercase, and numbers
            </p>

            {/* Next button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg bg-white text-black font-medium ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'CREATING ACCOUNT...' : 'NEXT'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6">
          <p className="text-center text-neutral-500 text-sm">
            See legal disclosures
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordScreen;

'use client';

import React, { useState } from 'react';
import { User, Shield, Heart, AlertCircle } from 'lucide-react';

const ProgressIndicator = () => (
  <div className="w-full py-6 relative">
    {/* Horizontal line behind circles */}
    <div className="absolute top-[56px] left-12 right-12 h-0.5 bg-neutral-800 z-0"></div>
    
    <div className="flex items-center justify-center mx-auto max-w-md">
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 text-black relative">
          <User size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-white mt-2">Basic info</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-700 text-neutral-500 relative">
          <Shield size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-neutral-500 mt-2">Verification</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-700 text-neutral-500 relative">
          <Heart size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-neutral-500 mt-2">You're in!</span>
      </div>
    </div>
  </div>
);

interface BasicInfoScreenProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const BasicInfoScreen: React.FC<BasicInfoScreenProps> = ({ formData, onChange, onNext }) => {
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: ''
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleFocus = (field: string) => {
    setFocusedInput(field);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Top section - Progress indicator */}
      <div className="sticky top-0 bg-[#121212] z-10">
        <ProgressIndicator />
      </div>
      
      {/* Middle section - Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Let's <span className="font-normal">get started</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Start with your basic information
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-8">
            {/* First Name */}
            <div className="relative">
              <label 
                htmlFor="firstName" 
                className={`absolute transition-all duration-200 ${
                  focusedInput === 'firstName' || formData.firstName
                    ? '-top-3 text-xs text-neutral-400'
                    : 'top-2 text-base text-neutral-500'
                }`}
              >
                First Name
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => onChange('firstName', e.target.value)}
                  onFocus={() => handleFocus('firstName')}
                  onBlur={handleBlur}
                  className="w-full py-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  placeholder=""
                  autoFocus
                />
                {/* Underline animation - stays in place */}
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedInput === 'firstName' ? 'w-full' : ''}`}></div>
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <label 
                htmlFor="lastName" 
                className={`absolute transition-all duration-200 ${
                  focusedInput === 'lastName' || formData.lastName
                    ? '-top-3 text-xs text-neutral-400'
                    : 'top-2 text-base text-neutral-500'
                }`}
              >
                Last Name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => onChange('lastName', e.target.value)}
                  onFocus={() => handleFocus('lastName')}
                  onBlur={handleBlur}
                  className="w-full py-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="family-name"
                  autoCapitalize="words"
                  placeholder=""
                />
                {/* Underline animation - stays in place */}
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedInput === 'lastName' ? 'w-full' : ''}`}></div>
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label 
                htmlFor="email" 
                className={`absolute transition-all duration-200 ${
                  focusedInput === 'email' || formData.email
                    ? '-top-3 text-xs text-neutral-400'
                    : 'top-2 text-base text-neutral-500'
                }`}
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full py-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="email"
                  autoCapitalize="off"
                  placeholder=""
                />
                {/* Underline animation - stays in place */}
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedInput === 'email' ? 'w-full' : ''}`}></div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <p className="text-neutral-500 text-sm pt-1">
              Use your legal name. You can add a preferred name later.
            </p>

            {/* Next button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg bg-white text-black font-medium"
              >
                NEXT
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

export default BasicInfoScreen;

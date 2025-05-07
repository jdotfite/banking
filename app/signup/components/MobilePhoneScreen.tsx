'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MobilePhoneScreenProps {
  formData: {
    mobilePhone: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const MobilePhoneScreen: React.FC<MobilePhoneScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  // Validate phone number
  const validatePhoneNumber = () => {
    if (!formData.mobilePhone) {
      setError('Mobile phone number is required');
      return false;
    }

    // Simple US phone number validation (10 digits)
    const digitsOnly = formData.mobilePhone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    setError('');
    return true;
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    let formattedInput = input;

    // Format as (XXX) XXX-XXXX
    if (input.length > 0) {
      if (input.length <= 3) {
        formattedInput = input;
      } else if (input.length <= 6) {
        formattedInput = `(${input.substring(0, 3)}) ${input.substring(3)}`;
      } else {
        formattedInput = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
      }
    }

    onChange('mobilePhone', formattedInput);
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhoneNumber()) {
      // Here you could save the marketing consent preference
      onNext();
    }
  };

  // Handle transactional only button click
  const handleTransactionalOnly = () => {
    if (validatePhoneNumber()) {
      setMarketingConsent(false);
      onNext();
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Your <span className="font-normal">mobile phone</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Your number is used to protect your account and keep in touch
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-8">
            {/* Phone number input */}
            <div className="relative">
              <div className="relative pt-4">
                <label 
                  htmlFor="phone-input"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    isFocused || formData.mobilePhone 
                      ? 'text-xs top-0 text-neutral-400'
                      : 'text-base top-4 text-neutral-500'
                  }`}
                >
                  Mobile phone number
                </label>
                <input
                  ref={inputRef}
                  id="phone-input"
                  type="tel"
                  inputMode="tel"
                  value={formData.mobilePhone}
                  onChange={handlePhoneChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  aria-describedby={error ? "phone-error" : undefined}
                  className="w-full pt-4 pb-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="tel"
                />
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${isFocused ? 'w-full' : ''}`}></div>
              </div>
              {error && (
                <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Marketing consent text */}
            <p className="text-neutral-500 text-sm">
              By selecting Next, you agree to receive periodic automated marketing text messages. Consent not required, cancel anytime. Message and data rates may apply. By selecting either option below, you agree to receive transactional updates and to the Telephone Use Agreement and Privacy Notice.
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

export default MobilePhoneScreen;

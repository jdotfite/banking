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
    <div className="max-w-md mx-auto">
      {/* Form title */}
      <h1 className="text-3xl font-bold mb-4">Your mobile phone</h1>
      <p className="text-gray-600 mb-6">Your number is used to protect your account and keep in touch.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Phone number input */}
          <div>
            <label htmlFor="phone-input" className="sr-only">
              Mobile phone number
            </label>
            <input
              ref={inputRef}
              id="phone-input"
              type="tel"
              inputMode="tel"
              placeholder="Mobile phone number (no VOIP)"
              value={formData.mobilePhone}
              onChange={handlePhoneChange}
              aria-describedby={error ? "phone-error" : undefined}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none"
              autoComplete="tel"
            />
            {error && (
              <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Marketing consent text */}
          <p className="text-gray-500 text-sm mt-4">
            By selecting Next, you agree to receive periodic automated marketing text messages. Consent not required, cancel anytime. Message and data rates may apply. By selecting either option below, you agree to receive transactional updates and to the Telephone Use Agreement and Privacy Notice.
          </p>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-transparent border-2 border-black text-black uppercase font-medium rounded-lg mt-6 hover:bg-gray-50 transition-colors"
        >
          NEXT
        </button>
      </form>
    </div>
  );
};

export default MobilePhoneScreen;
'use client';

import React, { useState } from 'react';

interface MobilePhoneScreenProps {
  formData: {
    mobilePhone: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const MobilePhoneScreen: React.FC<MobilePhoneScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');

  // Validate phone number
  const validatePhoneNumber = () => {
    if (!formData.mobilePhone) {
      setError('Mobile phone number is required');
      return false;
    }

    // Simple US phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobilePhone.replace(/\D/g, ''))) {
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
      formattedInput = input.substring(0, 10);
    }

    onChange('mobilePhone', formattedInput);
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhoneNumber()) {
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="text-green-500 text-3xl font-bold">chime</div>
      </div>

      {/* Form title */}
      <h1 className="text-3xl font-bold mb-4">Your mobile phone</h1>
      <p className="text-gray-600 mb-6">Your number is used to protect your account and keep in touch.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Phone number input */}
          <div>
            <input
              type="tel"
              placeholder="Mobile phone number (no VOIP)"
              value={formData.mobilePhone}
              onChange={handlePhoneChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Marketing consent text */}
          <p className="text-gray-500 text-sm mt-4">
            By selecting Next, you agree to receive periodic automated marketing text messages. Consent not required, cancel anytime. Message and data rates may apply. By selecting either option below, you agree to receive transactional updates and to the Telephone Use Agreement and Privacy Notice.
          </p>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-green-100 text-gray-500 font-medium rounded-lg mt-6 hover:bg-green-200 transition-colors"
        >
          Next
        </button>

        {/* Transactional messages only option */}
        <button
          type="button"
          onClick={() => {
            if (validatePhoneNumber()) {
              onNext();
            }
          }}
          className="w-full p-4 bg-transparent text-green-500 font-medium rounded-lg mt-4 hover:bg-gray-100 transition-colors"
        >
          Get transactional messages only
        </button>
      </form>

      {/* Number pad (for display only - not functional) */}
      <div className="mt-8 bg-gray-900 rounded-t-lg p-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-full p-4 text-center text-white text-xl font-medium"
            >
              {num}
              {num === 2 && <div className="text-xs text-gray-400">ABC</div>}
              {num === 3 && <div className="text-xs text-gray-400">DEF</div>}
              {num === 4 && <div className="text-xs text-gray-400">GHI</div>}
              {num === 5 && <div className="text-xs text-gray-400">JKL</div>}
              {num === 6 && <div className="text-xs text-gray-400">MNO</div>}
              {num === 7 && <div className="text-xs text-gray-400">PQRS</div>}
              {num === 8 && <div className="text-xs text-gray-400">TUV</div>}
              {num === 9 && <div className="text-xs text-gray-400">WXYZ</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilePhoneScreen;

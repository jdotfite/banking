'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/form';

interface AddressScreenProps {
  formData: {
    streetAddress: string;
    aptSuite: string;
    zipCode: string;
    city: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onShowDisclosures?: () => void;
}

const AddressScreen: React.FC<AddressScreenProps> = ({ formData, onChange, onNext, onShowDisclosures }) => {
  const [focusedFields, setFocusedFields] = useState({
    streetAddress: false,
    aptSuite: false,
    zipCode: false,
    city: false,
    state: false
  });
  const [errors, setErrors] = useState({
    streetAddress: '',
    zipCode: '',
    city: '',
    state: ''
  });

  // Set default state value if not already set
  useEffect(() => {
    if (!formData.state) {
      onChange('state', 'PA');
    }
  }, []);

  // US states for dropdown
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Validate form before proceeding
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      streetAddress: '',
      zipCode: '',
      city: '',
      state: ''
    };

    // Validate street address
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
      isValid = false;
    }

    // Validate ZIP code (5 digits)
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      isValid = false;
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
      isValid = false;
    }

    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    // Validate state
    if (!formData.state) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
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
              Your <span className="font-normal">home address</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              We need to verify your home address. This is also where we'll send your new card.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-8">
            {/* Street address */}
            <div className="relative">
              <label htmlFor="street-address" className="sr-only">Street address</label>
              <div className="relative">
                <label 
                  htmlFor="street-address"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedFields.streetAddress || formData.streetAddress 
                      ? 'text-xs top-0 text-neutral-400'
                      : 'text-base top-4 text-neutral-500'
                  }`}
                >
                  Street address (no P.O. boxes)
                </label>
                <input
                  id="street-address"
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => onChange('streetAddress', e.target.value)}
                  className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="street-address"
                  autoCapitalize="words"
                  onFocus={() => setFocusedFields({...focusedFields, streetAddress: true})}
                  onBlur={() => setFocusedFields({...focusedFields, streetAddress: false})}
                  autoFocus
                />
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedFields.streetAddress ? 'w-full' : ''}`}></div>
              </div>
              <div className="relative">
                <div className={`absolute top-0 left-0 w-full transition-all duration-200 ${errors.streetAddress ? 'h-[20px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  <p id="street-address-error" className="text-red-500 text-sm" role="alert">{errors.streetAddress}</p>
                </div>
              </div>
            </div>

            {/* Apt/Suite (optional) */}
            <div className="relative">
              <label htmlFor="apt-suite" className="sr-only">Apartment or Suite number</label>
              <div className="relative">
                <label 
                  htmlFor="apt-suite"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedFields.aptSuite || formData.aptSuite 
                      ? 'text-xs top-0 text-neutral-400'
                      : 'text-base top-4 text-neutral-500'
                  }`}
                >
                  Apt / Suite number (optional)
                </label>
                <input
                  id="apt-suite"
                  type="text"
                  value={formData.aptSuite}
                  onChange={(e) => onChange('aptSuite', e.target.value)}
                  className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="address-line2"
                  onFocus={() => setFocusedFields({...focusedFields, aptSuite: true})}
                  onBlur={() => setFocusedFields({...focusedFields, aptSuite: false})}
                />
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedFields.aptSuite ? 'w-full' : ''}`}></div>
              </div>
            </div>

            {/* ZIP Code */}
            <div className="relative">
              <label htmlFor="zip-code" className="sr-only">ZIP Code</label>
              <div className="relative">
                <label 
                  htmlFor="zip-code"
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    focusedFields.zipCode || formData.zipCode 
                      ? 'text-xs top-0 text-neutral-400'
                      : 'text-base top-4 text-neutral-500'
                  }`}
                >
                  ZIP Code
                </label>
                <input
                  id="zip-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.zipCode}
                  onChange={(e) => onChange('zipCode', e.target.value.replace(/\D/g, '').substring(0, 5))}
                  className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                  autoComplete="postal-code"
                  maxLength={5}
                  onFocus={() => setFocusedFields({...focusedFields, zipCode: true})}
                  onBlur={() => setFocusedFields({...focusedFields, zipCode: false})}
                />
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedFields.zipCode ? 'w-full' : ''}`}></div>
              </div>
              <div className="relative">
                <div className={`absolute top-0 left-0 w-full transition-all duration-200 ${errors.zipCode ? 'h-[20px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  <p id="zip-code-error" className="text-red-500 text-sm" role="alert">{errors.zipCode}</p>
                </div>
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="city" className="sr-only">City</label>
              <div className="relative">
                  <label 
                    htmlFor="city"
                    className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                      focusedFields.city || formData.city 
                        ? 'text-xs top-0 text-neutral-400'
                        : 'text-base top-4 text-neutral-500'
                    }`}
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => onChange('city', e.target.value)}
                  className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
                    autoComplete="address-level2"
                    autoCapitalize="words"
                    onFocus={() => setFocusedFields({...focusedFields, city: true})}
                    onBlur={() => setFocusedFields({...focusedFields, city: false})}
                  />
                  <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedFields.city ? 'w-full' : ''}`}></div>
                </div>
                <div className="relative">
                  <div className={`absolute top-0 left-0 w-full transition-all duration-200 ${errors.city ? 'h-[20px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                    <p id="city-error" className="text-red-500 text-sm" role="alert">{errors.city}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label htmlFor="state" className="sr-only">State</label>
                <div className="relative">
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => onChange('state', e.target.value)}
                    className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_#121212_inset]"
                    autoComplete="address-level1"
                    onFocus={() => setFocusedFields({...focusedFields, state: true})}
                    onBlur={() => setFocusedFields({...focusedFields, state: false})}
                  >
                    <option value="" className="bg-[#121212] text-white">State</option>
                    {states.map(state => (
                      <option 
                        key={state} 
                        value={state}
                        className="bg-[#121212] text-white hover:bg-neutral-800"
                      >
                        {state}
                      </option>
                    ))}
                  </select>
                  <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${focusedFields.state ? 'w-full' : ''}`}></div>
                </div>
                <div className="relative">
                  <div className={`absolute top-0 left-0 w-full transition-all duration-200 ${errors.state ? 'h-[20px] opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                    <p id="state-error" className="text-red-500 text-sm" role="alert">{errors.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next button */}
            <div className="pt-2">
              <Button type="submit">
                NEXT
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6">
          <button 
            onClick={onShowDisclosures}
            className="text-center text-neutral-500 text-sm w-full"
          >
            See legal disclosures
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressScreen;

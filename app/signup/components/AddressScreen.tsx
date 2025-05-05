'use client';

import React, { useState } from 'react';

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
}

const AddressScreen: React.FC<AddressScreenProps> = ({ formData, onChange, onNext }) => {
  const [errors, setErrors] = useState({
    streetAddress: '',
    zipCode: '',
    city: '',
    state: ''
  });

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
    <div className="max-w-md mx-auto">
      {/* Form title */}
      <h1 className="text-3xl font-bold mb-4">Your home address</h1>
      <p className="text-gray-600 mb-6">We need to verify your home address. This is also where we'll send your new card.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Street address */}
          <div>
            <input
              type="text"
              placeholder="Street address (no P.O. boxes)"
              value={formData.streetAddress}
              onChange={(e) => onChange('streetAddress', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
            />
            {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
          </div>

          {/* Apt/Suite (optional) */}
          <div>
            <input
              type="text"
              placeholder="Apt / Suite number (optional)"
              value={formData.aptSuite}
              onChange={(e) => onChange('aptSuite', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value.replace(/\D/g, '').substring(0, 5))}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <select
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none"
              >
                <option value="">State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>
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

export default AddressScreen;

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/form';
import Footer from '../../../components/ui/common/Footer';

interface DateOfBirthScreenProps {
  formData: {
    dateOfBirth?: string;
    dobValue?: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onShowDisclosures?: () => void;
}

const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ formData, onChange, onNext, onShowDisclosures }) => {
  const [error, setError] = useState('');
  const [dobValue, setDobValue] = useState(formData.dobValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // Format date as MM/DD/YYYY while typing
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Handle autofill in YYYY-MM-DD format
    if (value.includes('-')) {
      const [year, month, day] = value.split('-');
      value = `${month}/${day}/${year}`;
    } else {
      // Handle manual input in MM/DD/YYYY format
      value = value.replace(/\D/g, '');
      if (value.length > 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
      } else if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
    }
    
    setDobValue(value);
  };

  // Validate date of birth
  const validateDateOfBirth = () => {
    if (!dobValue) {
      setError('Date of birth is required');
      return false;
    }

    // Check format MM/DD/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dobValue)) {
      setError('Please enter date as MM/DD/YYYY');
      return false;
    }

    const [month, day, year] = dobValue.split('/').map(Number);
    
    // Check valid date
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || 
        date.getMonth() + 1 !== month || 
        date.getDate() !== day) {
      setError('Please enter a valid date');
      return false;
    }

    // Check age >= 18
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }
    
    if (age < 18) {
      setError('You must be 18 years or older to join');
      return false;
    }

    // Format as YYYY-MM-DD for storage
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onChange('dateOfBirth', formattedDate);
    
    setError('');
    return true;
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDateOfBirth()) {
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
            <h1 className="text-3xl font-extralight text-white mb-2">
              Your <span className="font-normal">date of birth</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              You must be 18 years old or older to join
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-8">
            {/* Error message container - aria-live */}
            <div aria-live="polite" className="sr-only">
              {error && <span id="dob-error">{error}</span>}
            </div>
            {/* Date of birth field */}
            <div className="relative">
              <label 
                htmlFor="dob"
                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  isFocused || dobValue 
                    ? 'text-xs top-0 text-neutral-400'
                    : 'text-base top-4 text-neutral-500'
                }`}
              >
                Date of birth (MM/DD/YYYY)
              </label>
              <div className="relative">
                <input
                  id="dob"
                  name="dob"
                  type="text"
                  inputMode="numeric"
                  value={dobValue}
                  onChange={handleDobChange}
                  maxLength={10}
                  className="w-full pt-5 pb-1 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_#121212_inset]"
                  autoComplete="bday"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    // Convert autofilled YYYY-MM-DD to MM/DD/YYYY if needed
                    if (dobValue.includes('-')) {
                      const [year, month, day] = dobValue.split('-');
                      setDobValue(`${month}/${day}/${year}`);
                    }
                  }}
                  aria-invalid={!!error}
                  aria-describedby={error ? "dob-error" : undefined}
                />
                <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${isFocused ? 'w-full' : ''}`}></div>
              </div>
              {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
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
      <Footer onShowDisclosures={onShowDisclosures} />
    </div>
  );
};

export default DateOfBirthScreen;

'use client';

import React, { useState } from 'react';

interface DateOfBirthScreenProps {
  formData: {
    dateOfBirth: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');

  // Validate date of birth
  const validateDateOfBirth = () => {
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }

    // Check if the user is at least 18 years old
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      // If birthday hasn't occurred yet this year, subtract one year
      const adjustedAge = age - 1;
      if (adjustedAge < 18) {
        setError('You must be 18 years or older to join Chime');
        return false;
      }
    } else if (age < 18) {
      setError('You must be 18 years or older to join Chime');
      return false;
    }

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
    <div className="max-w-md mx-auto">
      {/* Form title */}
      <h1 className="text-3xl font-bold mb-4">Your date of birth</h1>
      <p className="text-gray-600 mb-6">You must be 18 years old or older to join Chime.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Date of birth input */}
          <div>
            <input
              type="date"
              placeholder="Date of birth"
              value={formData.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-transparent border-2 border-black text-black uppercase font-medium rounded-lg mt-6 hover:bg-transparent transition-colors"
        >
          NEXT
        </button>
      </form>
    </div>
  );
};

export default DateOfBirthScreen;

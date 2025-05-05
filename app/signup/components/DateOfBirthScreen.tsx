'use client';

import React, { useState, useEffect } from 'react';

interface DateOfBirthScreenProps {
  formData: {
    dateOfBirth: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  // Initialize month, day, year from formData.dateOfBirth if it exists
  useEffect(() => {
    if (formData.dateOfBirth) {
      const parts = formData.dateOfBirth.split('-');
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parts[1]);
        setDay(parts[2]);
      }
    }
  }, []);

  // Update dateOfBirth when any field changes
  useEffect(() => {
    if (month && day && year) {
      // Format date as YYYY-MM-DD
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onChange('dateOfBirth', formattedDate);
    }
  }, [month, day, year, onChange]);

  // Handle month input
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 12)) {
      setMonth(value);
    }
  };

  // Handle day input
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 31)) {
      setDay(value);
    }
  };

  // Handle year input
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (value.length <= 4)) {
      setYear(value);
    }
  };

  // Auto-focus to next input when current is filled
  const handleMonthKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (month.length === 2) {
      document.getElementById('day-input')?.focus();
    }
  };

  const handleDayKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (day.length === 2) {
      document.getElementById('year-input')?.focus();
    }
  };

  // Validate date of birth
  const validateDateOfBirth = () => {
    if (!month || !day || !year) {
      setError('Date of birth is required');
      return false;
    }

    // Check that the date is valid
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const dob = new Date(dateStr);
    if (isNaN(dob.getTime())) {
      setError('Please enter a valid date');
      return false;
    }

    // Check if the user is at least 18 years old
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      // If birthday hasn't occurred yet this year, subtract one year
      const adjustedAge = age - 1;
      if (adjustedAge < 18) {
        setError('You must be 18 years or older to join');
        return false;
      }
    } else if (age < 18) {
      setError('You must be 18 years or older to join');
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
      <p className="text-gray-600 mb-6">You must be 18 years old or older to join.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Custom DOB input with separate fields for month/day/year */}
          <div aria-live="polite">
            <div className="flex gap-3">
              <div className="w-1/4">
                <label htmlFor="month-input" className="block text-sm text-gray-600 mb-1">Month</label>
                <input
                  id="month-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="MM"
                  value={month}
                  onChange={handleMonthChange}
                  onKeyUp={handleMonthKeyUp}
                  maxLength={2}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none text-center"
                  autoComplete="bday-month"
                />
              </div>
              <div className="w-1/4">
                <label htmlFor="day-input" className="block text-sm text-gray-600 mb-1">Day</label>
                <input
                  id="day-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="DD"
                  value={day}
                  onChange={handleDayChange}
                  onKeyUp={handleDayKeyUp}
                  maxLength={2}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none text-center"
                  autoComplete="bday-day"
                />
              </div>
              <div className="w-2/4">
                <label htmlFor="year-input" className="block text-sm text-gray-600 mb-1">Year</label>
                <input
                  id="year-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="YYYY"
                  value={year}
                  onChange={handleYearChange}
                  maxLength={4}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none text-center"
                  autoComplete="bday-year"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
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

export default DateOfBirthScreen;
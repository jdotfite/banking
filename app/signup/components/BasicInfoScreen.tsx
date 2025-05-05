'use client';

import React, { useState } from 'react';

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

  // Validate form before proceeding
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: ''
    };

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Validate email
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

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Image */}
      <div className="flex justify-center mb-6">
        <img 
          src="/images/signup/steps.png" 
          alt="Signup steps"
          className="max-h-[200px] max-w-full object-contain"
        />
      </div>

      {/* Form title */}
      <h1 className="text-gray-600 text-3xl font-bold mb-4">Let's get started</h1>
      <p className="text-gray-600 mb-6">Let's start with some basic information.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* First name */}
          <div>
            <label htmlFor="firstName" className="sr-only">First name</label>
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => {
                console.log('firstName onChange', e.target.value);
                onChange('firstName', e.target.value);
              }}
              onBlur={() => console.log('firstName onBlur')}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none"
              autoComplete="given-name"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck="false"
              key="firstName-input"
            />
            {errors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.firstName}</p>}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" className="sr-only">Last name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => {
                console.log('lastName onChange', e.target.value);
                onChange('lastName', e.target.value);
              }}
              onBlur={() => console.log('lastName onBlur')}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none"
              autoComplete="family-name"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck="false"
              key="lastName-input"
            />
            {errors.lastName && <p id="lastName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.lastName}</p>}
          </div>

          {/* Legal name note */}
          <p className="text-gray-500 text-sm">Use your legal name. You can add a preferred name later.</p>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                console.log('email onChange', e.target.value);
                onChange('email', e.target.value);
              }}
              onBlur={() => console.log('email onBlur')}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700 appearance-none"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              key="email-input"
            />
            {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>}
          </div>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-transparent border-2 border-black text-black uppercase font-medium rounded-lg mt-6 hover:bg-gray-50 transition-colors"
        >
          NEXT
        </button>

        {/* Legal disclosures */}
        <p className="text-center text-gray-500 text-sm mt-4">
          See legal disclosures
        </p>
      </form>
    </div>
  );
};

export default BasicInfoScreen;

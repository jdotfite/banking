'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
            <input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Last name */}
          <div>
            <input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Legal name note */}
          <p className="text-gray-500 text-sm">Use your legal name. You can add a preferred name later.</p>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-transparent border-2 border-black text-black uppercase font-medium rounded-lg mt-6 hover:bg-transparent transition-colors"
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

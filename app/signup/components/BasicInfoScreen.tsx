'use client';

import React, { useState } from 'react';
import { User, Shield, Heart } from 'lucide-react';
import { FormInput, Button, FormContainer } from '../../../components/ui/form';
import Footer from '../../../components/ui/common/Footer';

const ProgressIndicator = () => (
  <div className="w-full py-6 relative">
    {/* Horizontal line behind circles */}
    <div className="absolute top-[56px] left-12 right-12 h-0.5 bg-neutral-800 z-0"></div>
    
    <div className="flex items-center justify-center mx-auto max-w-md">
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200 text-black relative">
          <User size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-white mt-2">Basic info</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-700 text-neutral-400 relative">
          <Shield size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-neutral-500 mt-2">Verification</span>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-700 text-neutral-400 relative">
          <Heart size={24} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-light text-neutral-500 mt-2">You're in!</span>
      </div>
    </div>
  </div>
);

interface BasicInfoScreenProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onShowDisclosures?: () => void;
}

const BasicInfoScreen: React.FC<BasicInfoScreenProps> = ({ formData, onChange, onNext, onShowDisclosures }) => {
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: ''
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    onChange(field, value);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Top section - Progress indicator */}
      <div className="sticky top-0 bg-[#121212] z-10">
        <ProgressIndicator />
      </div>
      
      {/* Middle section - Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extralight text-white mb-2">
              Let's <span className="font-normal">get started</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              Start with your basic information
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNext} className="space-y-7">
            <FormInput
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              autoComplete="given-name"
              autoCapitalize="words"
            />

            <FormInput
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              autoComplete="family-name"
              autoCapitalize="words"
            />

            <FormInput
              id="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              autoComplete="email"
              autoCapitalize="off"
              inputMode="email"
            />

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

export default BasicInfoScreen;

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import BasicInfoScreen from './BasicInfoScreen';
import DateOfBirthScreen from './DateOfBirthScreen';
import MobilePhoneScreen from './MobilePhoneScreen';
import AddressScreen from './AddressScreen';
import CreatePasswordScreen from './CreatePasswordScreen';

// Define the steps in the signup flow
enum SignupStep {
  BASIC_INFO = 0,
  DATE_OF_BIRTH = 1,
  MOBILE_PHONE = 2,
  ADDRESS = 3,
  CREATE_PASSWORD = 4
}

// Define the form data structure
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobilePhone: string;
  streetAddress: string;
  aptSuite: string;
  zipCode: string;
  city: string;
  state: string;
  password: string;
}

const SignupFlow: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.BASIC_INFO);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    mobilePhone: '',
    streetAddress: '',
    aptSuite: '',
    zipCode: '',
    city: '',
    state: '',
    password: ''
  });

  // Handle form data changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < SignupStep.CREATE_PASSWORD) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - complete signup
      completeSignup();
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > SignupStep.BASIC_INFO) {
      setCurrentStep(prev => prev - 1);
    } else {
      // First step - go back to onboarding
      router.push('/onboarding');
    }
  };

  // Handle close button
  const handleClose = () => {
    router.push('/');
  };

  // Complete signup and redirect to admin page
  const completeSignup = () => {
    console.log('Signup completed with data:', formData);
    
    // In a real app, this would call an API to create the account
    // For now, we'll just redirect to the admin page
    localStorage.removeItem('selectedUserId');
    router.push('/');
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case SignupStep.BASIC_INFO:
        return (
          <BasicInfoScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext} 
          />
        );
      case SignupStep.DATE_OF_BIRTH:
        return (
          <DateOfBirthScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext} 
          />
        );
      case SignupStep.MOBILE_PHONE:
        return (
          <MobilePhoneScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext} 
          />
        );
      case SignupStep.ADDRESS:
        return (
          <AddressScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext} 
          />
        );
      case SignupStep.CREATE_PASSWORD:
        return (
          <CreatePasswordScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with close button */}
      <div className="h-16 bg-black flex items-center px-4">
        <button 
          onClick={handleClose}
          className="p-2 text-white"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Current step content */}
      <div className="px-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default SignupFlow;

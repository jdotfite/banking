'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft } from 'lucide-react';
import BasicInfoScreen from '@/app/signup/components/BasicInfoScreen';
import DateOfBirthScreen from '@/app/signup/components/DateOfBirthScreen';
import MobilePhoneScreen from '@/app/signup/components/MobilePhoneScreen';
import AddressScreen from '@/app/signup/components/AddressScreen';
import CreatePasswordScreen from '@/app/signup/components/CreatePasswordScreen';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const totalSteps = Object.keys(SignupStep).length / 2; // Divide by 2 because enum creates both numeric and string keys

  // Handle form data changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any previous error when user makes changes
    if (error) setError(null);
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < SignupStep.CREATE_PASSWORD) {
      setCurrentStep(prev => prev + 1);
      // Focus management for accessibility
      window.scrollTo(0, 0);
    } else {
      // Final step - complete signup
      completeSignup();
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > SignupStep.BASIC_INFO) {
      setCurrentStep(prev => prev - 1);
      // Focus management for accessibility
      window.scrollTo(0, 0);
    } else {
      // First step - go back to onboarding
      router.push('/onboarding');
    }
  };

  // Handle close button
  const handleClose = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      router.push('/');
    }
  };

  // Validate all form data before submission
  const validateFormData = (): boolean => {
    // Basic validation - check if required fields are filled
    const requiredFields: (keyof SignupFormData)[] = [
      'firstName', 'lastName', 'email', 'dateOfBirth', 
      'mobilePhone', 'streetAddress', 'zipCode', 'city', 
      'state', 'password'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please complete all required fields before submitting.`);
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    return true;
  };

  // Complete signup and redirect to admin page
  const completeSignup = async () => {
    if (!validateFormData()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Signup completed with data:', formData);
      
      // In a real app, this would call an API to create the account
      // For example:
      // await apiClient.createAccount(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.removeItem('selectedUserId');
      router.push('/');
      
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#090909]">
      {/* Header with navigation buttons */}
      <div className="h-12 flex items-center justify-between px-3  z-10">
        {currentStep > SignupStep.BASIC_INFO ? (
          <button 
            onClick={handleBack}
            className="p-2 text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          <button 
            onClick={handleClose}
            className="p-2 text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
        
        {/* Progress indicator */}
        <div className="text-white text-sm">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      {/* Current step content */}
      <div className="flex-1 overflow-hidden">
        {renderStep()}
      </div>
      
      {/* Global error message */}
      {error && (
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-max p-3 bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg flex items-start">
          {error}
        </div>
      )}
    </div>
  );
};

export default SignupFlow;

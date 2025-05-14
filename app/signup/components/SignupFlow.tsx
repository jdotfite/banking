'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft } from 'lucide-react';
import { useUser } from '@/components/context/UserContext';
import BasicInfoScreen from '@/app/signup/components/BasicInfoScreen';
import DateOfBirthScreen from '@/app/signup/components/DateOfBirthScreen';
import MobilePhoneScreen from '@/app/signup/components/MobilePhoneScreen';
import AddressScreen from '@/app/signup/components/AddressScreen';
import CreatePasswordScreen from '@/app/signup/components/CreatePasswordScreen';
import { checkAndSubmitAfterLoad } from '@/lib/utils/signupTestUtils';

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
  dobValue?: string;
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
  const { setSelectedUserId } = useUser();
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

  // Load form data from localStorage if it exists (for testing purposes)
  useEffect(() => {
    console.log('SignupFlow mounted, checking for saved form data');
    
    const savedFormData = localStorage.getItem('signupFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log('Found saved form data:', parsedData);
        
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
        
        // Remove the data from localStorage to prevent it from being used again
        localStorage.removeItem('signupFormData');
        
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    // Check if auto-fill is active
    const isAutoFillActive = localStorage.getItem('autoFillActive') === 'true';
    if (isAutoFillActive) {
      console.log('Auto-fill is active');
    }
    
    // Check if we should submit the form after page load
    checkAndSubmitAfterLoad();
  }, []);

  // Check for auto-fill when the step changes
  useEffect(() => {
    const isAutoFillActive = localStorage.getItem('autoFillActive') === 'true';
    if (isAutoFillActive) {
      console.log('Auto-fill is active - step changed');
    }
  }, [currentStep]);

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

  // Complete signup and redirect to users page
  const completeSignup = async () => {
    if (!validateFormData()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Signup completed with data:', formData);
      
      // In a real app, this would call an API to create the account
      // For example:
      // await apiClient.createAccount(formData);
      
      // For testing - always use the "New User" from fakeBankingData.js
      const userId = 'user3';
      
      // Set selected user and trigger data refresh
      setSelectedUserId(userId);
      
      // Force a hard navigation to account setup to ensure proper state
      window.location.href = '/account-setup';
      
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
            onShowDisclosures={() => setDrawerHeight(400)}
          />
        );
      case SignupStep.DATE_OF_BIRTH:
        return (
          <DateOfBirthScreen 
            formData={formData} 
            onChange={handleChange} 
            onNext={handleNext}
            onShowDisclosures={() => setDrawerHeight(400)} 
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
            onShowDisclosures={() => setDrawerHeight(400)}
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

  const [showDisclosure, setShowDisclosure] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = drawerHeight;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = startYRef.current - e.touches[0].clientY;
    const newHeight = Math.min(Math.max(80, startHeightRef.current + deltaY), 500);
    setDrawerHeight(newHeight);
  };

  const toggleDisclosure = () => {
    setShowDisclosure(!showDisclosure);
    setDrawerHeight(showDisclosure ? 80 : 400);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0a0a0a] relative">
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

      {/* Disclosure drawer */}
      <div 
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 bg-neutral-950 text-neutral-200 rounded-t-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
        style={{ height: `${drawerHeight}px` }}
      >
        {/* Handle bar */}
        <div 
          className="w-full h-8 bg-neutral-950 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onClick={() => setDrawerHeight(0)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="w-12 h-1 bg-neutral-900 rounded-full"></div>
        </div>

        {/* Disclosure content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-32px)]">
          <h2 className="text-sm font-semibold mb-4">Legal Disclosures</h2>
          <p className="text-xs mb-4">
            To assist the government in combating the funding of terrorism and money laundering activities, federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account.
          </p>
          <p className="text-xs mb-4">
            When you open an account with Members 1st Federal Credit Union, we will request your name, address, date of birth, and other information that allows us to identify you. We may also ask to see your driver's license or other identifying documents.
          </p>
          <p className="text-xs mb-4">
            Members 1st Federal Credit Union is a federally insured credit union, regulated by the National Credit Union Administration (NCUA). Your deposits are insured up to the maximum amount allowed by law.
          </p>
          <p className="text-xs mb-4">
            We are committed to protecting your personal information. For details on how we collect, use, and safeguard your data, please review our
            <a href="https://www.members1st.org/privacy-policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
          </p>
          <p className="text-xs mb-4">
            For comprehensive information regarding our terms, conditions, and disclosures, please refer to our
            <a href="https://www.members1st.org/disclosures-and-agreements/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Disclosures and Agreements</a> page.
          </p>
          <p className="text-xs mb-4">
            If you have any questions or require further assistance, please contact our Customer Service at
            <a href="tel:8002377288" className="text-blue-600 hover:underline"> (800) 237-7288</a> or visit your nearest branch.
          </p>
          <p className="text-xs text-neutral-600 mt-6">
            &copy; 2025 Members 1st Federal Credit Union. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;

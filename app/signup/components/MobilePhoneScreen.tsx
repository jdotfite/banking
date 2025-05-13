'use client';

import React, { useState } from 'react';
import { PhoneInput, Button, FormContainer } from '../../../components/ui/form';

interface MobilePhoneScreenProps {
  formData: {
    mobilePhone: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const MobilePhoneScreen: React.FC<MobilePhoneScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);

  // Validate phone number
  const validatePhoneNumber = () => {
    if (!formData.mobilePhone) {
      setError('Mobile phone number is required');
      return false;
    }

    // Simple US phone number validation (10 digits)
    const digitsOnly = formData.mobilePhone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    setError('');
    return true;
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhoneNumber()) {
      // Here you could save the marketing consent preference
      onNext();
    }
  };

  // Handle transactional only button click
  const handleTransactionalOnly = () => {
    if (validatePhoneNumber()) {
      setMarketingConsent(false);
      onNext();
    }
  };

  const handlePhoneChange = (value: string) => {
    onChange('mobilePhone', value);
  };

  return (
    <FormContainer
      title="Your mobile phone"
      subtitle="Your number is used to protect your account and keep in touch"
    >
      {/* Form */}
      <form onSubmit={handleNext} className="space-y-8">
        {/* Phone number input */}
        <PhoneInput
          id="phone-input"
          label="Mobile phone number"
          value={formData.mobilePhone}
          onChange={handlePhoneChange}
          error={error}
        />

        {/* Marketing consent text */}
        <p className="text-neutral-500 text-sm">
          By selecting Next, you agree to receive periodic automated marketing text messages. Consent not required, cancel anytime. Message and data rates may apply. By selecting either option below, you agree to receive transactional updates and to the Telephone Use Agreement and Privacy Notice.
        </p>

        {/* Next button */}
        <div className="pt-2">
          <Button type="submit">
            NEXT
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default MobilePhoneScreen;

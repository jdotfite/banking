'use client';

import React from 'react';
import FormInput from './FormInput';

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete = 'tel',
  autoFocus,
  onFocus,
  onBlur
}) => {
  // Format phone number as user types
  const handlePhoneChange = (inputValue: string) => {
    const input = inputValue.replace(/\D/g, '');
    let formattedInput = input;

    // Format as (XXX) XXX-XXXX
    if (input.length > 0) {
      if (input.length <= 3) {
        formattedInput = input;
      } else if (input.length <= 6) {
        formattedInput = `(${input.substring(0, 3)}) ${input.substring(3)}`;
      } else {
        formattedInput = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
      }
    }

    onChange(formattedInput);
  };

  return (
    <FormInput
      id={id}
      type="tel"
      label={label}
      value={value}
      onChange={handlePhoneChange}
      error={error}
      autoComplete={autoComplete}
      inputMode="tel"
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default PhoneInput;

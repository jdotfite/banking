'use client';

import React, { useState } from 'react';

interface FormInputProps {
  id: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  autoCapitalize?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  autoFocus?: boolean;
  rightElement?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  error,
  autoComplete,
  autoCapitalize,
  inputMode,
  autoFocus,
  rightElement,
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <div className="relative">
      <label 
        htmlFor={id} 
        className={`absolute transition-all duration-200 ${
          isFocused || value
            ? '-top-3 text-xs text-neutral-400'
            : 'top-2 text-base text-neutral-500'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full py-2 px-0 bg-transparent border-b border-neutral-700 outline-none focus:border-neutral-700 text-white transition-all duration-200"
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          inputMode={inputMode as any}
          autoFocus={autoFocus}
          placeholder=""
        />
        {/* Underline animation */}
        <div className={`h-px w-0 bg-white absolute bottom-0 left-0 transition-all duration-700 ${isFocused ? 'w-full' : ''}`}></div>
        {rightElement && (
          <div className="absolute right-0 bottom-2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from './FormInput';

interface PasswordInputProps {
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

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  autoFocus,
  onFocus,
  onBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(prev => !prev);
  };

  const PasswordToggle = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="text-neutral-500 hover:text-white transition-colors"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <FormInput
      id={id}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      rightElement={PasswordToggle}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default PasswordInput;

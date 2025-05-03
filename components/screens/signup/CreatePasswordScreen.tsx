'use client';

import React, { useState, useEffect } from 'react';

interface CreatePasswordScreenProps {
  formData: {
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({ formData, onChange, onNext }) => {
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Update password strength when password changes
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) {
      strength += 1;
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    
    // Number check
    if (/\d/.test(password)) {
      strength += 1;
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    }
    
    setPasswordStrength(strength);
  };

  // Validate password
  const validatePassword = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Password must include uppercase, lowercase, and numbers');
      return false;
    }

    setError('');
    return true;
  };

  // Handle next button click
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      onNext();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Form title */}
      <h1 className="text-3xl font-bold mb-4">Create password</h1>
      <p className="text-gray-600 mb-6">Strong passwords keep your account safer.</p>

      {/* Form */}
      <form onSubmit={handleNext}>
        <div className="space-y-4">
          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Password strength indicator */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                passwordStrength === 0 ? 'w-0' :
                passwordStrength === 1 ? 'w-1/5 bg-red-500' :
                passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                passwordStrength === 4 ? 'w-4/5 bg-blue-500' :
                'w-full bg-green-500'
              }`}
            ></div>
          </div>

          {/* Password requirements */}
          <p className="text-gray-500 text-sm">
            Use 8+ characters with uppercase, lowercase, and numbers
          </p>
        </div>

        {/* Next button */}
        <button
          type="submit"
          className="w-full p-4 bg-transparent border-2 border-black text-black uppercase font-medium rounded-lg mt-6 hover:bg-gray-50 transition-colors"
        >
          NEXT
        </button>
      </form>
    </div>
  );
};

export default CreatePasswordScreen;

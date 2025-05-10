'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PasswordInput, Button, FormContainer } from '../../../components/ui/form';

interface CreatePasswordScreenProps {
  formData: {
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({ 
  formData, 
  onChange, 
  onNext,
  isSubmitting = false
}) => {
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const prevStrengthRef = useRef(0);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  // Update password strength when password changes
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  // Monitor password strength for changes
  useEffect(() => {
    // Check if strength just reached maximum (5)
    if (passwordStrength === 5 && prevStrengthRef.current < 5) {
      setShowCheckmark(true);
      triggerConfetti();
    } else if (passwordStrength < 5) {
      setShowCheckmark(false);
    }
    
    prevStrengthRef.current = passwordStrength;
  }, [passwordStrength]);

  // Confetti animation function
  const triggerConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          x: x / window.innerWidth, 
          y: y / window.innerHeight 
        },
        colors: ['#213d70', '#f36919', '#039fd7', '#ee3831', '#d90981', '#7c2984', '#5ea63a'],
        disableForReducedMotion: true
      });
    }
  };

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

  const handlePasswordChange = (value: string) => {
    onChange('password', value);
  };

  return (
    <FormContainer 
      title="Create password"
      subtitle="Strong passwords keep your account safer"
    >
      {/* Form */}
      <form onSubmit={handleNext} className="space-y-8">
        {/* Password input */}
        <PasswordInput
          id="password"
          label="Password"
          value={formData.password}
          onChange={handlePasswordChange}
          error={error}
          autoComplete="new-password"
          autoFocus
        />

        {/* Password strength indicator with checkmark */}
        <div className="relative w-full" ref={confettiRef}>
          <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden relative z-0">
            <div 
              className={`h-full ${
                passwordStrength === 0 ? 'w-0' :
                passwordStrength === 1 ? 'w-1/5 bg-red-500' :
                passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                passwordStrength === 4 ? 'w-4/5 bg-blue-500' :
                'w-full bg-green-500'
              } transition-all duration-300`}
              aria-hidden="true"
            ></div>
          </div>
          
          {/* Checkmark icon */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${showCheckmark ? 'bg-green-500' : 'bg-neutral-700'} border-2 border-[#121212]`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="white" 
                className="w-4 h-4"
              >
                <path 
                  fillRule="evenodd" 
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {passwordStrength === 5 ? (
          <p className="text-white text-sm">
            <span className="font-medium">Great job!</span> That password is strong and would take ages to crack 🔒
          </p>
        ) : (
          <p className="text-neutral-500 text-sm">
            Use 8+ characters with uppercase, lowercase, and numbers
          </p>
        )}

        {/* Next button */}
        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'CREATING ACCOUNT...' : 'NEXT'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default CreatePasswordScreen;

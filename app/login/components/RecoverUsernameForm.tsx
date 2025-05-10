'use client';

import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { FormInput, Button } from '../../../components/ui/form';

interface RecoverUsernameFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const RecoverUsernameForm: React.FC<RecoverUsernameFormProps> = ({ setView }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    lastFourSSN: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    memberId: '',
    lastFourSSN: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleMemberIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, memberId: value }));
    if (errors.memberId) setErrors(prev => ({ ...prev, memberId: '' }));
  };

  const handleSsnChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 4) {
      setFormData(prev => ({ ...prev, lastFourSSN: numbersOnly }));
    }
    if (errors.lastFourSSN) setErrors(prev => ({ ...prev, lastFourSSN: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      memberId: !formData.memberId ? 'Member ID is required' : '',
      lastFourSSN: !formData.lastFourSSN || formData.lastFourSSN.length !== 4 
        ? 'Please enter the last 4 digits of your SSN' 
        : ''
    };

    setErrors(newErrors);
    if (newErrors.memberId || newErrors.lastFourSSN) {
      return;
    }
    
    console.log('Username recovery requested:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Form content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extralight text-white mb-2">
              Recover <span className="font-normal">username</span>
            </h1>
            <p className="text-neutral-400 text-sm">
              To recover your username, please provide the following information:
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
          
          
          <FormInput
            id="memberId"
            label="Member ID"
            value={formData.memberId}
            onChange={handleMemberIdChange}
            error={errors.memberId}
            autoComplete="username"
          />

          <FormInput
            id="lastFourSSN"
            type="password"
            label="Last 4 digits of SSN"
            value={formData.lastFourSSN}
            onChange={handleSsnChange}
            error={errors.lastFourSSN}
            inputMode="numeric"
          />
          
          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit">
              CONTINUE
            </Button>
            
            <Button 
              type="button" 
              variant="borderless"
              onClick={() => setView('login')}
              className="text-white"
            >
              Back to login
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <p className="text-neutral-400 text-sm">
              If your contact information is out-of-date, please call us at
            </p>
            <a href="tel:8002377288" className="text-white font-medium mt-1 hover:underline">800-237-7288</a>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-200/20 mb-4">
            <Mail size={32} className="text-green-200" />
          </div>
          <h2 className="text-xl font-medium mb-2">Username sent</h2>
          <p className="text-neutral-300 mb-6">
            We've sent your username to your registered email address.
          </p>
          <Button 
            onClick={() => setView('login')}
            className="w-full"
          >
            BACK TO LOGIN
          </Button>
          <p className="mt-4 text-sm text-neutral-400">
            Didn't receive the email? Check your spam folder or{' '}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsSubmitted(false)}
              className="text-green-200 hover:underline bg-transparent border-0 p-0"
            >
              try again
            </Button>
          </p>
        </div>
      )}
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6">
          <p className="text-center text-neutral-500 text-sm">
            See legal disclosures
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverUsernameForm;

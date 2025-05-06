'use client';

import React, { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import { animated } from 'react-spring';

interface RecoverUsernameFormProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const RecoverUsernameForm: React.FC<RecoverUsernameFormProps> = ({ setView }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    lastFourSSN: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'lastFourSSN') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      if (numbersOnly.length <= 4) {
        setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.memberId) {
      setError('Please enter your Member ID');
      return;
    }
    
    if (!formData.lastFourSSN || formData.lastFourSSN.length !== 4) {
      setError('Please enter the last 4 digits of your Social Security Number');
      return;
    }
    
    console.log('Username recovery requested:', formData);
    setIsSubmitted(true);
  };

  return (
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-gray-300 mb-4">
            To recover your username, please provide the following information:
          </p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-300">
              Member ID
            </label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
              placeholder="Enter your Member ID"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="lastFourSSN" className="block text-sm font-medium text-gray-300">
              Last 4 of your Social Security Number (SSN)
            </label>
            <input
              type="password"
              id="lastFourSSN"
              name="lastFourSSN"
              value={formData.lastFourSSN}
              onChange={handleChange}
              className="w-full px-3 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
            >
              Continue
            </button>
            
            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full py-3 bg-transparent border border-gray-700 text-white font-medium rounded-lg hover:bg-white/5 transition-colors"
            >
              Back to login
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              If your contact information is out-of-date, please call us at
            </p>
            <p className="text-white font-medium mt-1">800-237-7288</p>
          </div>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-200/20 mb-4">
            <Mail size={32} className="text-green-200" />
          </div>
          <h2 className="text-xl font-medium mb-2">Username sent</h2>
          <p className="text-gray-300 mb-6">
            We've sent your username to your registered email address.
          </p>
          <button
            onClick={() => setView('login')}
            className="w-full py-3 bg-green-200 text-black font-medium rounded-lg hover:bg-green-300 transition-colors"
          >
            Back to login
          </button>
          <p className="mt-4 text-sm text-gray-400">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-green-200 hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      )}
    </>
  );
};

export default RecoverUsernameForm;

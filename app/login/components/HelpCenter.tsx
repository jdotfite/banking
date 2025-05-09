'use client';

import React from 'react';
import { Mail, HelpCircle } from 'lucide-react';
import { animated } from 'react-spring';

interface HelpCenterProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter') => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ setView }) => {
  const helpOptions = [
    {
      title: 'Forgot password?',
      action: () => setView('forgotPassword'),
      description: 'Reset your password via email'
    },
    {
      title: 'Unlock account?',
              action: () => setView('login'),
      description: 'Unlock an account that has been locked due to too many failed login attempts'
    },
    {
      title: 'Forgot Username?',
      action: () => setView('recoverUsername'),
      description: 'Recover your username via email'
    },
    {
      title: 'Frequently Asked Questions',
              action: () => setView('login'), 
      description: 'Find answers to common questions'
    }
  ];

  return (
    <div className="pb-8">
      <h2 className="text-xl font-semibold text-center mb-6">How can we help?</h2>
      
      <div className="space-y-3">
        {helpOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            className="w-full text-left p-4 bg-[#1a1a1a] border border-neutral-700 rounded-lg hover:bg-[#252525] transition-colors"
          >
            <h3 className="font-medium mb-1">{option.title}</h3>
            <p className="text-sm text-neutral-400">{option.description}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => setView('login')}
          className="text-green-200 hover:text-green-100 transition-colors"
        >
          Back to login
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
        <p className="text-sm text-neutral-400 mb-2">Need additional support?</p>
        <a href="tel:18002377288" className="text-green-200 hover:text-green-100 transition-colors">
          Call 1-800-237-7288
        </a>
      </div>
    </div>
  );
};

export default HelpCenter;

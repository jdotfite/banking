'use client';

import React from 'react';
import { Mail, HelpCircle } from 'lucide-react';
import { animated } from 'react-spring';
import { Button } from '../../../components/ui/form';

interface HelpCenterProps {
  setView: (view: 'login' | 'forgotPassword' | 'recoverUsername' | 'helpCenter' | 'faq') => void;
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
      action: () => setView('forgotPassword'),
      description: 'Reset your password to unlock an account that has been locked due to too many failed login attempts'
    },
    {
      title: 'Forgot Username?',
      action: () => setView('recoverUsername'),
      description: 'Recover your username via email'
    },
    {
      title: 'Frequently Asked Questions',
      action: () => setView('faq'),
      description: 'Find answers to common questions'
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] w-full bg-[#121212] pb-14">
      {/* Main content */}
      <div className="flex-grow overflow-auto px-6 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-4xl font-extralight text-white mb-8">
            Need <span className="font-normal">help?</span>
          </h2>
          
          <div className="space-y-4">
            {helpOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full text-left p-4 bg-[#1a1a1a] border border-neutral-700 rounded-lg hover:bg-[#252525] transition-colors"
              >
                <h3 className="font-medium text-white mb-1">{option.title}</h3>
                <p className="text-sm text-neutral-400">{option.description}</p>
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-3 pt-6">
            <Button 
              type="button" 
              variant="borderless"
              onClick={() => setView('login')}
              className="text-white text-sm"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
        <div className="max-w-md mx-auto w-full py-4 px-6 text-center">
          <p className="text-neutral-500 text-sm">
            Need additional support? Please call us at
          </p>
          <a href="tel:8002377288" className="text-white text-sm font-medium mt-1 hover:underline">800-237-7288</a>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

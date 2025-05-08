'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/context/UserContext';
import { Settings, X, Trash2, UserPlus, LogIn, Users, Sparkles, FastForward, Zap, Play, SkipForward } from 'lucide-react';
import { autoFillSignupScreen, autoCompleteSignup, autoFillAndAdvance } from '@/lib/utils/signupTestUtils';
import { animated, useSpring, config } from '@react-spring/web';

/**
 * Testing Toolkit component
 * Provides a floating button in the corner of the screen (only in development mode)
 * that allows developers to reset user state, navigate to admin pages, and access test accounts
 */
const TestingToolkit: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetUserSelection } = useUser();

  // Animation configs for buttons
  const createButtonAnimation = (delay: number) => useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
    delay,
    config: config.gentle,
    reset: !isOpen
  });

  // Main navigation buttons animations
  const buttonAnimations = [
    createButtonAnimation(100),
    createButtonAnimation(150),
    createButtonAnimation(200),
    createButtonAnimation(250),
    createButtonAnimation(300),
    createButtonAnimation(350)
  ];

  // Signup testing buttons animations
  const signupButtonAnimations = [
    createButtonAnimation(400),
    createButtonAnimation(450),
    createButtonAnimation(500),
    createButtonAnimation(550),
    createButtonAnimation(600),
    createButtonAnimation(650),
    createButtonAnimation(700),
    createButtonAnimation(750)
  ];

  const handleClearStorage = () => {
    localStorage.clear();
    setIsOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-0 z-[160] bg-neutral-800 text-white p-2 rounded-l-full shadow-lg hover:bg-neutral-700 transition-colors"
        aria-label="Developer Tools"
      >
        <Settings size={20} className="gear-spin" />
      </button>
      
      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .gear-spin {
          animation: slow-spin 15s linear infinite;
        }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[160] flex items-center justify-center">
          <div className="bg-neutral-900 text-white rounded-lg shadow-xl w-96 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-neutral-700">
              <h2 className="text-lg font-semibold">
                Testing Toolkit
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Navigation Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Navigation</h3>
                <div className="grid grid-cols-1 gap-2">
                  <animated.button
                    onClick={() => { window.location.href = '/onboarding'; }}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                    style={buttonAnimations[1]}
                  >
                    <Sparkles size={16} className="mr-2 mt-0.5" />
                    Onboarding
                  </animated.button>
                  
                  <animated.button
                    onClick={() => { window.location.href = '/signup'; }}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                    style={buttonAnimations[2]}
                  >
                    <UserPlus size={16} className="mr-2 mt-0.5" />
                    Sign Up
                  </animated.button>
                  
                  <animated.button
                    onClick={() => { window.location.href = '/login'; }}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                    style={buttonAnimations[3]}
                  >
                    <LogIn size={16} className="mr-2 mt-0.5" />
                    Login
                  </animated.button>
                </div>
              </div>

              {/* Sign Up Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Sign Up</h3>
                <div className="grid grid-cols-1 gap-2">
                  <animated.button
                    onClick={() => {
                      autoFillAndAdvance();
                      setIsOpen(false);
                    }}
                    className="bg-green-900 hover:bg-green-800 text-white py-2 px-4 rounded flex items-start"
                    style={buttonAnimations[0]}
                  >
                    <Play size={16} className="mr-2 mt-0.5" />
                    Auto Form Filler
                  </animated.button>
                </div>
              </div>

              {/* Admin Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Admin</h3>
                <div className="grid grid-cols-1 gap-2">
                  <animated.button
                    onClick={() => { window.location.href = '/admin'; }}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                    style={buttonAnimations[4]}
                  >
                    <Users size={16} className="mr-2 mt-0.5" />
                    Test Users
                  </animated.button>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-800 p-3 text-xs text-neutral-400">
              <div className="flex justify-between items-center mb-1">
                <p>Current localStorage:</p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    setIsOpen(false);
                    window.location.reload();
                  }}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Clear All
                </button>
              </div>
              <pre className="mt-1 overflow-x-auto max-h-32 bg-neutral-950 p-2 rounded">
                {JSON.stringify(
                  Object.fromEntries(
                    Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
                  ), 
                  null, 
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestingToolkit;

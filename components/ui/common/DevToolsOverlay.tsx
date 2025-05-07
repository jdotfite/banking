'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/context/UserContext';
import { Settings, X, Trash2, UserPlus, LogIn, Users, Sparkles } from 'lucide-react';
import { animated, useSpring, config } from '@react-spring/web';

/**
 * DevToolsOverlay component
 * Provides a floating button in the corner of the screen (only in development mode)
 * that allows developers to reset user state, navigate to admin pages, and access test accounts
 */
const DevToolsOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetUserSelection } = useUser();

  // Animation configs for buttons only
  const buttonAnimations = [
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 100,
      config: config.gentle,
      reset: !isOpen
    }),
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 150,
      config: config.gentle,
      reset: !isOpen
    }),
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 200,
      config: config.gentle,
      reset: !isOpen
    }),
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 250,
      config: config.gentle,
      reset: !isOpen
    }),
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 300,
      config: config.gentle,
      reset: !isOpen
    }),
    useSpring({
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0px)' : 'translateY(20px)' },
      delay: 350,
      config: config.gentle,
      reset: !isOpen
    })
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
        className="fixed bottom-32 right-0 z-[160] bg-white text-black p-2 rounded-l-full shadow-lg hover:bg-neutral-100 transition-colors"
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
                Admin Toolkit
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-3">
              <p className="text-sm text-neutral-400 mb-2 col-span-2">
                Testing & Development Tools
              </p>
              
              {/* Clear Storage Button */}
              <animated.button
                onClick={handleClearStorage}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[0]}
              >
                <Trash2 size={16} className="mr-2 mt-0.5" />
                Clear Storage
              </animated.button>
              
              {/* Onboarding Button */}
              <animated.button
                onClick={() => { window.location.href = '/onboarding'; }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[1]}
              >
                <Sparkles size={16} className="mr-2 mt-0.5" />
                Onboarding
              </animated.button>
              
              {/* Sign Up Button */}
              <animated.button
                onClick={() => { window.location.href = '/signup'; }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[2]}
              >
                <UserPlus size={16} className="mr-2 mt-0.5" />
                Sign Up
              </animated.button>
              
              {/* Login Button */}
              <animated.button
                onClick={() => { window.location.href = '/login'; }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[3]}
              >
                <LogIn size={16} className="mr-2 mt-0.5" />
                Login
              </animated.button>
              
              {/* Test Users Button */}
              <animated.button
                onClick={() => { window.location.href = '/admin'; }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[4]}
              >
                <Users size={16} className="mr-2 mt-0.5" />
                Test Users
              </animated.button>
              
              {/* PWA Install Button */}
              <animated.button
                onClick={() => {
                  const event = new Event('beforeinstallprompt');
                  window.dispatchEvent(event);
                }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-start"
                style={buttonAnimations[5]}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install PWA
              </animated.button>
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

export default DevToolsOverlay;

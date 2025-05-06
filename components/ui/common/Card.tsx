'use client';

import React, { useState } from 'react';
import { useUser } from '@/components/context/UserContext';
import { Settings, X, Home, UserPlus, LogIn, Users, Sparkles } from 'lucide-react';
import { animated, useSpring } from 'react-spring';

/**
 * DevToolsOverlay component
 * Provides a floating button in the corner of the screen (only in development mode)
 * that allows developers to reset user state, navigate to admin pages, and access test accounts
 */
const DevToolsOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetUserSelection } = useUser();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleResetUserState = () => {
    // Clear localStorage
    localStorage.removeItem('selectedUserId');
    
    // Reset user selection in context
    resetUserSelection();
    
    // Close the overlay
    setIsOpen(false);
    
    // Redirect to root
    window.location.href = '/';
  };

  // Button animation
  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0%)' },
    config: { mass: 1, tension: 180, friction: 12 }
  });

  // Overlay animation
  const overlayAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { mass: 1, tension: 200, friction: 15 }
  });

  // Header animation
  const headerAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 150,
    config: { tension: 280, friction: 20 }
  });

  // Close button animation
  const closeButtonAnimation = useSpring({
    from: { opacity: 0, transform: 'rotate(-90deg)' },
    to: { opacity: 1, transform: 'rotate(0deg)' },
    delay: 200,
    config: { tension: 200, friction: 10 }
  });

  // Button animations with increasing delays
  const button1Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300,
    config: { tension: 280, friction: 15 }
  });

  const button2Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 350,
    config: { tension: 280, friction: 15 }
  });

  const button3Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 400,
    config: { tension: 280, friction: 15 }
  });

  const button4Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 450,
    config: { tension: 280, friction: 15 }
  });

  const button5Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 500,
    config: { tension: 280, friction: 15 }
  });

  const button6Animation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 550,
    config: { tension: 280, friction: 15 }
  });

  // Footer animation
  const footerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 600,
    config: { tension: 280, friction: 20 }
  });

  return (
    <>
      {/* Floating button with animation */}
      <animated.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-0 z-[160] bg-white text-black p-2 rounded-l-full shadow-lg hover:bg-neutral-100 transition-colors"
        aria-label="Developer Tools"
        style={buttonAnimation}
      >
        <Settings size={20} />
      </animated.button>

      {/* Overlay with animation */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[160] flex items-center justify-center">
          <animated.div 
            className="bg-neutral-900 text-white rounded-lg shadow-xl w-96 overflow-hidden"
            style={overlayAnimation}
          >
            <div className="flex justify-between items-center p-4 border-b border-neutral-700">
              <animated.h2 
                className="text-lg font-semibold flex items-center"
                style={headerAnimation}
              >
                <Sparkles size={18} className="mr-2 text-amber-400" />
                Admin Toolkit
              </animated.h2>
              <animated.button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white"
                style={closeButtonAnimation}
              >
                <X size={20} />
              </animated.button>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-3">
              <animated.p 
                className="text-sm text-neutral-400 mb-2 col-span-2"
                style={headerAnimation}
              >
                Testing & Development Tools
              </animated.p>
              
              {/* Animated Buttons */}
              <animated.button
                onClick={() => { window.location.href = '/reset'; }}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button1Animation}
              >
                <Home size={16} className="mr-2" />
                Reset Page
              </animated.button>
              
              <animated.button
                onClick={() => { window.location.href = '/onboarding'; }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button2Animation}
              >
                <Sparkles size={16} className="mr-2" />
                Onboarding
              </animated.button>
              
              <animated.button
                onClick={() => { window.location.href = '/signup'; }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button3Animation}
              >
                <UserPlus size={16} className="mr-2" />
                Sign Up
              </animated.button>
              
              <animated.button
                onClick={() => { window.location.href = '/login'; }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button4Animation}
              >
                <LogIn size={16} className="mr-2" />
                Login
              </animated.button>
              
              <animated.button
                onClick={() => { window.location.href = '/admin'; }}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button5Animation}
              >
                <Users size={16} className="mr-2" />
                Test Users
              </animated.button>
              
              <animated.button
                className="bg-neutral-700 hover:bg-neutral-600 text-white py-2 px-4 rounded flex items-center justify-center"
                style={button6Animation}
              >
                {/* Placeholder for future feature */}
              </animated.button>
            </div>
            
            <animated.div 
              className="bg-neutral-800 p-3 text-xs text-neutral-400"
              style={footerAnimation}
            >
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
            </animated.div>
          </animated.div>
        </div>
      )}
    </>
  );
};

export default DevToolsOverlay;
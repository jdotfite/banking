'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/components/context/UserContext';
import { 
  Settings,
  X,
  UserPlus,
  LogIn,
  Users,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { autoCompleteSignup } from '@/lib/utils/signupTestUtils';
import { animated, useSpring, config } from '@react-spring/web';

/**
 * ImprovedTestingToolkit component
 * Provides a floating, draggable button that expands with options
 * Allows developers to access testing features without disrupting their workflow
 */
const TestingToolkit: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ y: 200 });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { resetUserSelection } = useUser();
  const toolkitRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ y: 0 });
  
  // Function to navigate with a cookie that bypasses the preloader
  const navigateWithBypass = (path: string) => {
    // Set special cookies that the middleware will check
    document.cookie = 'bypass_preloader=true; path=/';
    document.cookie = 'preloader-complete=true; path=/';
    
    // Dispatch the preloader complete event
    window.dispatchEvent(new CustomEvent('preloader-complete', { 
      detail: { complete: true } 
    }));
    
    // Navigate to the path
    window.location.href = path;
  };
  
  // Function to auto-complete signup with bypass
  const autoCompleteSignupWithBypass = () => {
    document.cookie = 'bypass_preloader=true; path=/';
    autoCompleteSignup();
  };

  // Button spring
  const buttonAnimation = useSpring({ scale: isExpanded ? 1.1 : 1, config: config.wobbly });
  // Panel spring: width only
  const panelAnimation = useSpring({ width: isExpanded ? 240 : 0, opacity: 1, config: { ...config.gentle, clamp: true } });

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { y: e.clientY - position.y };
    e.stopPropagation();
    // Removed e.preventDefault() to allow dragging
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartPos.current = { y: touch.clientY - position.y };
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newY = e.clientY - dragStartPos.current.y;
      const maxY = window.innerHeight - 60;
      setPosition({ y: Math.min(Math.max(0, newY), maxY) });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newY = touch.clientY - dragStartPos.current.y;
      const maxY = window.innerHeight - 60;
      setPosition({ y: Math.min(Math.max(0, newY), maxY) });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      // Add both mouse and touch event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      // Clean up all event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);
  
  const handleMainButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => { 
    if (!isDragging) setIsExpanded(!isExpanded); 
  };

  const handleClearStorage = () => { localStorage.clear(); window.location.reload(); };
  const handleClose = () => { setIsExpanded(false); setActiveSection(null); };

  return (
    <div 
      ref={toolkitRef} 
      className="fixed right-0 z-[999]" 
      style={{ 
        top: `${position.y}px`, 
        touchAction: 'none',  // Important for touch devices
      }}
    >
      <div className="flex items-start">
        <animated.button
          style={buttonAnimation}
          onClick={handleMainButtonClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}  // Added touch handler
          className="mt-4 flex items-center justify-center bg-neutral-800 text-white w-12 h-12 rounded-l-full shadow-[inset_-4px_0_4px_-2px_rgba(0,0,0,0.3)] shadow-lg hover:bg-neutral-700 transition-colors relative z-[999]"
          aria-label="Developer Tools"
        >
          <Settings size={20} className="gear-spin" />
        </animated.button>

        <animated.div
          style={panelAnimation}
          className="overflow-hidden bg-neutral-800 rounded-l-lg shadow-xl z-[9999] flex flex-col h-auto relative"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="p-3 text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold">Testing Toolkit</h2>
              <button onClick={handleClose} className="text-neutral-400 hover:text-white" aria-label="Close panel">
                <X size={16} />
              </button>
            </div>

            {/* Navigation */}
            <div className="mb-2">
              <button
                onClick={() => toggleSection('navigation')}
                className="w-full flex items-center justify-between text-left text-neutral-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-neutral-700 transition-colors"
              >
                <span className="text-xs font-medium">Navigation</span>
                <ChevronRight size={14} className={`transform transition-transform ${activeSection === 'navigation' ? 'rotate-90' : ''}`} />
              </button>
              {activeSection === 'navigation' && (
                <div className="pl-2 mt-1 space-y-1">
                  <button onClick={() => navigateWithBypass('/onboarding')} className="w-full text-left text-xs text-neutral-400 hover:text-white py-1 px-2 rounded hover:bg-neutral-700 flex items-center">
                    <Sparkles size={12} className="mr-2"/> Onboarding
                  </button>
                  <button onClick={() => navigateWithBypass('/signup')} className="w-full text-left text-xs text-neutral-400 hover:text-white py-1 px-2 rounded hover:bg-neutral-700 flex items-center">
                    <UserPlus size={12} className="mr-2"/> Sign Up
                  </button>
                  <button onClick={() => navigateWithBypass('/login')} className="w-full text-left text-xs text-neutral-400 hover:text-white py-1 px-2 rounded hover:bg-neutral-700 flex items-center">
                    <LogIn size={12} className="mr-2"/> Login
                  </button>
                </div>
              )}
            </div>

            {/* AutoFill */}
            <div className="mb-2">
              <button
                onClick={() => toggleSection('autofill')}
                className="w-full flex items-center justify-between text-left text-neutral-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-neutral-700 transition-colors"
              >
                <span className="text-xs font-medium">Auto Fill</span>
                <ChevronRight size={14} className={`transform transition-transform ${activeSection==='autofill'?'rotate-90':''}`} />
              </button>
              {activeSection==='autofill' && (
                <div className="pl-2 mt-1 space-y-1">
                  <button onClick={autoCompleteSignupWithBypass} className="w-full text-left text-xs text-blue-400 hover:text-blue-300 py-1 px-2 rounded hover:bg-blue-900 flex items-center">
                    <Sparkles size={12} className="mr-2"/> Complete Signup
                  </button>
                </div>
              )}
            </div>

            {/* Admin */}
            <div className="mb-2">
              <button
                onClick={() => toggleSection('admin')}
                className="w-full flex items-center justify-between text-left text-neutral-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-neutral-700 transition-colors"
              >
                <span className="text-xs font-medium">Admin</span>
                <ChevronRight size={14} className={`transform transition-transform ${activeSection==='admin'?'rotate-90':''}`} />
              </button>
              {activeSection==='admin' && (
                <div className="pl-2 mt-1 space-y-1">
                  <button onClick={() => navigateWithBypass('/admin')} className="w-full text-left text-xs text-neutral-400 hover:text-white py-1 px-2 rounded hover:bg-neutral-700 flex items-center">
                    <Users size={12} className="mr-2"/> Test Users
                  </button>
                </div>
              )}
            </div>

            {/* LocalStorage */}
            <div className="mb-1">
              <button
                onClick={() => toggleSection('storage')}
                className="w-full flex items-center justify-between text-left text-neutral-300 hover:text-white py-1.5 px-2 rounded-md hover:bg-neutral-700 transition-colors"
              >
                <span className="text-xs font-medium">LocalStorage</span>
                <ChevronRight size={14} className={`transform transition-transform ${activeSection==='storage'?'rotate-90':''}`} />
              </button>
              {activeSection==='storage' && (
                <div className="mt-1">
                  <div className="flex justify-between items-center px-2 mb-1">
                    <span className="text-xs text-neutral-400">Current:</span>
                    <button onClick={handleClearStorage} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
                  </div>
                  <pre className="text-xs bg-neutral-900 p-2 rounded max-h-24 overflow-y-auto text-neutral-400">
                    {JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </animated.div>
      </div>

      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gear-spin { animation: slow-spin 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default TestingToolkit;
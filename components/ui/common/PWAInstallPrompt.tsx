'use client';

import React, { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { X, Download, Share } from 'lucide-react';

interface PWAInstallPromptProps {
  delay?: number; // Delay in milliseconds before showing prompt
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ delay = 4000 }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Clear PWA prompt flags from localStorage to ensure prompt shows
    localStorage.removeItem('pwaPromptSeen');
    
    // Check if it's an iOS device
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosCheck);
    
    // Check if already installed as a standalone app
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowPrompt(false);
      return;
    }
    
    // Check if we already have a stored prompt
    const showPromptWithDelay = () => {
      setShowPrompt(true);
      setShowAnimation(true);
    };

    if (window.deferredPrompt) {
      console.log('Found stored beforeinstallprompt event');
      setTimeout(showPromptWithDelay, delay);
    }
    
    // For iOS devices, always show the install instructions
    if (iosCheck && !isStandalone) {
      console.log('iOS device detected, showing install instructions');
      setTimeout(showPromptWithDelay, delay);
    }
    
    // Listen for new beforeinstallprompt events
    const handler = () => {
      console.log('PWAInstallPrompt: Detected beforeinstallprompt event capture');
      if (window.deferredPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
          setShowAnimation(true);
        }, delay);
      }
    };
    
    // Listen for appinstalled events
    const installHandler = () => {
      console.log('PWA was installed successfully');
      setShowPrompt(false);
    };
    
    // Add event listeners
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installHandler);
    
    // Debug logging
    console.log('PWA install prompt component initialized');
    console.log('Is standalone mode:', isStandalone);
    console.log('Is iOS device:', iosCheck);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installHandler);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked, deferredPrompt available:', !!window.deferredPrompt);
    
    if (window.deferredPrompt) {
      try {
        // Show the install prompt
        console.log('Calling prompt() method...');
        await window.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        console.log('Waiting for user choice...');
        const choiceResult = await window.deferredPrompt.userChoice;
        
        console.log('User choice was:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used twice
        window.deferredPrompt = null;
        setShowPrompt(false);
      } catch (error) {
        console.error('Install error:', error);
      }
    } else if (isIOS) {
      // For iOS, show instructions for adding to home screen
      alert('To install this app on your iPhone: tap the Share button, then "Add to Home Screen"');
      setShowPrompt(false);
    } else {
      console.log('No install prompt available');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowAnimation(false);
  };

  const animation = useSpring({
    from: { y: -100, opacity: 0 },
    to: { 
      y: showAnimation ? 0 : -100,
      opacity: showAnimation ? 1 : 0 
    },
    config: { tension: 120, friction: 21 }
  });

  if (!showPrompt) return null;

  return (
    <animated.div 
      style={animation}
      className="fixed top-0 left-0 right-0 bg-neutral-800 text-neutral-200 p-3 z-[150] shadow-[0_4px_6px_rgba(0,0,0,0.12)]"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/images/icons/logo-m1st-square.svg" 
            alt="App Logo"
            className="w-8 h-8 mr-3"
          />
          <div>
            <p className="text-xs leading-none">
              {isIOS ? 'Add to home screen for full app experience' : 'Install for better experience'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-primary hover:bg-primary-darkborder border-neutral-300 text-neutral-300 px-3 py-1 text-xs font-medium uppercase tracking-wider border border-primary-dark transition-colors"
            >
              INSTALL
            </button>
          )}
          {isIOS && (
            <button
              onClick={handleInstall}
              className="bg-primary hover:bg-primary-dark border border-neutral-300 text-neutral-300 px-3 py-1 text-xs font-medium uppercase tracking-wider border border-primary-dark transition-colors"
            >
              INSTALL
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-neutral-200 hover:text-neutral-300 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default PWAInstallPrompt;

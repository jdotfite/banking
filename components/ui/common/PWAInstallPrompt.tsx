'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    // Clear any existing PWA prompt flags to ensure the prompt shows
    localStorage.removeItem('pwaPromptSeen');
    
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosCheck);
    
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setShowPrompt(false);
      return;
    }
    
    // Store the event for later use
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    
    const handler = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      console.log('beforeinstallprompt event captured successfully');
      
      // Store the event for later use
      deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(deferredPrompt);
      
      // Always show the install prompt when the event is fired
      setShowPrompt(true);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handler);
    
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed successfully');
      setShowPrompt(false);
    });
    
    // For iOS devices, always show the install instructions
    if (iosCheck && !isStandalone) {
      console.log('iOS device detected, showing install instructions');
      setShowPrompt(true);
    }
    
    // Debug logging for PWA eligibility
    console.log('PWA install prompt component initialized');
    console.log('Is standalone mode:', isStandalone);
    console.log('Is iOS device:', iosCheck);
    
    if ('getInstalledRelatedApps' in navigator) {
      console.log('getInstalledRelatedApps is available');
      // @ts-ignore - TypeScript doesn't know about this API yet
      navigator.getInstalledRelatedApps().then((apps: any[]) => {
        console.log('Installed related apps:', apps);
      }).catch((err: any) => {
        console.error('Error checking installed apps:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked, installPrompt available:', !!installPrompt);
    
    if (installPrompt) {
      try {
        // Show the install prompt
        console.log('Calling prompt() method...');
        await installPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        console.log('Waiting for user choice...');
        const choiceResult = await installPrompt.userChoice;
        
        console.log('User choice was:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setShowPrompt(false);
        } else {
          console.log('User dismissed the install prompt');
          // Don't permanently dismiss, allow the prompt to show again later
          setTimeout(() => setShowPrompt(true), 24 * 60 * 60 * 1000); // Show again after 24 hours
        }
        
        // Clear the saved prompt since it can't be used twice
        setInstallPrompt(null);
      } catch (error) {
        console.error('Install error:', error);
      }
    } else if (isIOS) {
      // For iOS, show instructions for adding to home screen
      alert('To install this app on your iPhone: tap the Share button, then "Add to Home Screen"');
      setShowPrompt(false);
    } else {
      console.log('No install prompt available');
      // If no install prompt is available, just hide the banner temporarily
      setShowPrompt(false);
      // Try again after a short delay
      setTimeout(() => setShowPrompt(true), 60 * 1000); // Show again after 1 minute
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't permanently dismiss, allow the prompt to show again later
    setTimeout(() => setShowPrompt(true), 3 * 24 * 60 * 60 * 1000); // Show again after 3 days
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white text-gray-800 p-3 shadow-md z-[150] border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/images/icons/logo-pwa.png" 
            alt="App Logo"
            className="w-8 h-8 mr-3"
          />
          <div>
             <p className="text-sm leading-none opacity-90">
              {isIOS ? 'Add to home screen for full app experience' : 'Install for better experience'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-neutral-800 text-white px-3 py-1 rounded text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Install
            </button>
          )}
          {isIOS && (
            <button
              onClick={handleInstall}
              className="bg-neutral-800 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Share size={12} className="mr-1" /> Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-gray-800 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

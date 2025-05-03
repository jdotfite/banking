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
      console.log('beforeinstallprompt event fired');
      
      // Store the event for later use
      deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(deferredPrompt);
      
      // Show the install prompt if user hasn't seen it
      const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
      if (!hasSeenPrompt) setShowPrompt(true);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handler);
    
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      localStorage.setItem('pwaPromptSeen', 'true');
    });
    
    // Show the prompt if user hasn't seen it and not in standalone mode
    const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
    if (!hasSeenPrompt && !isStandalone) {
      // For debugging - check if we're eligible for installation
      if ('getInstalledRelatedApps' in navigator) {
        console.log('getInstalledRelatedApps is available');
      }
      
      // Show the prompt anyway for iOS
      if (iosCheck) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked, installPrompt:', !!installPrompt);
    
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
          localStorage.setItem('pwaPromptSeen', 'true');
        } else {
          console.log('User dismissed the install prompt');
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
      localStorage.setItem('pwaPromptSeen', 'true');
    } else {
      console.log('No install prompt available');
      // If no install prompt is available, just hide the banner
      setShowPrompt(false);
      localStorage.setItem('pwaPromptSeen', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptSeen', 'true');
    setTimeout(() => localStorage.removeItem('pwaPromptSeen'), 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white text-gray-800 p-3 shadow-md z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/icons/icon-192x192.png" 
            alt="App Logo"
            className="w-8 h-8 mr-3"
          />
          <div>
            <h3 className="font-semibold">Install Banking App</h3>
            <p className="text-sm opacity-90">
              {isIOS ? 'Add to home screen for full app experience' : 'Install for better experience'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-neutral-800 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Install
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

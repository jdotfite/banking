'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Define BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has already seen the prompt
      const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    // Add the event listener
    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user's choice
    const choiceResult = await installPrompt.userChoice;
    
    // Reset the installPrompt
    setInstallPrompt(null);
    setShowPrompt(false);
    
    // Remember that we've shown the prompt
    localStorage.setItem('pwaPromptSeen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember the dismissal for 7 days
    localStorage.setItem('pwaPromptSeen', 'true');
    setTimeout(() => {
      localStorage.removeItem('pwaPromptSeen');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gray-800 rounded-lg p-4 shadow-lg z-50
      md:left-1/2 md:max-w-sm md:transform md:-translate-x-1/2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">Install Banking App</h3>
          <p className="text-gray-300 text-sm mb-3">Add to your home screen for a better experience!</p>
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
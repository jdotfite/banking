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
    
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
      if (!hasSeenPrompt) setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      localStorage.setItem('pwaPromptSeen', 'true');
    });
    
    const hasSeenPrompt = localStorage.getItem('pwaPromptSeen');
    if (!hasSeenPrompt && !isStandalone) setShowPrompt(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setShowPrompt(false);
          localStorage.setItem('pwaPromptSeen', 'true');
        }
      } catch (error) {
        console.error('Install error:', error);
      }
    } else {
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
            src="/icons/icon.svg" 
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
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-white hover:text-blue-100"
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

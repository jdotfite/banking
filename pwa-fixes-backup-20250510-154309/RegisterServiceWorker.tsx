'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerServiceWorker = async () => {
        try {
          // Additional check for secure context (required for service workers)
          if (window.isSecureContext) {
            const registration = await navigator.serviceWorker.register('/sw.js', {
              scope: '/',
              type: 'classic'
            });
            
            console.log('ServiceWorker registration successful with scope:', registration.scope);
            
            // Check for updates periodically
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    console.log('New service worker installed');
                  }
                };
              }
            };
          } else {
            console.warn('Service workers require secure context (HTTPS)');
          }
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
          // Fallback: Try registering with more basic configuration
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('Fallback service worker registration succeeded');
          } catch (fallbackError) {
            console.error('Fallback service worker registration failed:', fallbackError);
          }
        }
      };

      // Delay registration slightly to avoid conflicts with other startup processes
      setTimeout(registerServiceWorker, 1000);
    }
    
    // Set up beforeinstallprompt event listener at the window level
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event captured in RegisterServiceWorker');
      // Don't prevent default here - let the PWAInstallPrompt component handle it
    };
    
    // Set up appinstalled event listener
    const handleAppInstalled = (e: Event) => {
      console.log('App was installed successfully', e);
    };
    
    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}

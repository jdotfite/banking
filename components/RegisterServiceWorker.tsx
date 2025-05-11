'use client';

import { useEffect } from 'react';
import type { BeforeInstallPromptEvent } from '@/types';

export default function RegisterServiceWorker() {
  useEffect(() => {
    // Only register in production and on client-side
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerServiceWorker = async () => {
        try {
          if (window.isSecureContext) {
            // Use only one service worker path
            const registration = await navigator.serviceWorker.register('/sw.js', {
              scope: '/'
            });
            
            console.log('ServiceWorker registration successful with scope:', registration.scope);
            
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
        }
      };

      // Register service worker after page load
      window.addEventListener('load', registerServiceWorker);
    }
    
    // Set up beforeinstallprompt event listener at the window level
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event captured in RegisterServiceWorker');
      // Store event for later use by the PWAInstallPrompt component
      window.deferredPrompt = e;
      // Don't prevent default - let PWAInstallPrompt handle it
    };
    
    // Set up appinstalled event listener
    const handleAppInstalled = (e: Event) => {
      console.log('App was installed successfully', e);
      // Clear the stored prompt
      window.deferredPrompt = null;
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

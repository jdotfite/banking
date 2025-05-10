'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    console.log('Service worker functionality disabled to prevent compatibility issues');

    // Service workers are disabled due to:
    // 1. Next.js static export compatibility issues
    // 2. Cache management complexity
    // 3. Better reliability without service workers in this banking context
    // Existing service workers are unregistered to prevent any issues
    const unregisterAllServiceWorkers = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Unregister any existing service workers
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length > 0) {
            console.log(`Found ${registrations.length} service worker(s) to unregister.`);
            for (const registration of registrations) {
              await registration.unregister();
              console.log(`Unregistered service worker for scope: ${registration.scope}`);
            }
          }

          // Clear caches that might be causing issues
          if ('caches' in window) {
            try {
              const cacheNames = await caches.keys();
              if (cacheNames.length > 0) {
                await Promise.all(
                  cacheNames.map(cacheName => caches.delete(cacheName))
                );
                console.log('All caches cleared successfully');
              }
            } catch (error) {
              console.error('Error clearing caches:', error);
            }
          }
        } catch (error) {
          console.error('Error unregistering service workers:', error);
        }
      }
    };

    // Run this when the component mounts
    unregisterAllServiceWorkers();
    
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

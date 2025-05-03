'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Clear any caches that might be causing issues
          if ('caches' in window) {
            try {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
              );
              console.log('All caches cleared successfully');
            } catch (error) {
              console.error('Error clearing caches:', error);
            }
          }
          
          // Unregister any existing service workers first to ensure clean registration
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('Unregistered existing service worker');
          }
          
          // Register the service worker with explicit scope
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Don't use cached versions
          });
          
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Force update check immediately
          registration.update();
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found!');
            
            newWorker?.addEventListener('statechange', () => {
              console.log('Service Worker state changed:', newWorker.state);
              
              // When the service worker is installed, refresh the page to activate it
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker installed, refreshing to activate');
                window.location.reload();
              }
            });
          });
          
          // Check if the service worker is controlling the page
          if (!navigator.serviceWorker.controller) {
            console.log('Page not yet controlled by a service worker.');
          } else {
            console.log('Page is controlled by a service worker');
          }
          
          // Listen for controlling service worker changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed!');
          });
          
          // Check for PWA installability
          if ('getInstalledRelatedApps' in navigator) {
            try {
              // @ts-ignore - TypeScript doesn't know about this API yet
              const relatedApps = await navigator.getInstalledRelatedApps();
              console.log('Related installed apps:', relatedApps);
            } catch (err) {
              console.error('Error checking installed related apps:', err);
            }
          }
          
          // Set up interval to check for updates
          setInterval(() => {
            registration.update();
            console.log('Checking for Service Worker updates...');
          }, 60 * 60 * 1000); // Check every hour
          
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
        }
      } else {
        console.warn('Service workers are not supported in this browser.');
      }
    };

    // Register service worker when the component mounts
    registerSW();
    
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

'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Register the service worker with explicit scope
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker update found!');
            
            newWorker?.addEventListener('statechange', () => {
              console.log('Service Worker state changed:', newWorker.state);
            });
          });
          
          // Check if the service worker is controlling the page
          if (!navigator.serviceWorker.controller) {
            console.log('Page not yet controlled by a service worker.');
          }
          
          // Listen for controlling service worker changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed!');
          });
          
          // Log when beforeinstallprompt is fired
          window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired in RegisterServiceWorker');
          });
          
          // Log when the app is installed
          window.addEventListener('appinstalled', (e) => {
            console.log('App was installed', e);
          });
          
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
        }
      } else {
        console.warn('Service workers are not supported in this browser.');
      }
    };

    // Register service worker when the component mounts
    registerSW();
  }, []);

  return null;
}

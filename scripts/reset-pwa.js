// scripts/reset-pwa.js
// This script helps reset the PWA state by clearing caches and unregistering service workers
// Run this in the browser console when you need to reset the PWA state

(async function resetPWA() {
  console.log('🧹 Starting PWA reset process...');
  
  // 1. Clear localStorage PWA-related items
  console.log('Clearing localStorage PWA flags...');
  localStorage.removeItem('pwaPromptSeen');
  
  // 2. Unregister all service workers
  if ('serviceWorker' in navigator) {
    console.log('Unregistering service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('No service workers registered.');
    } else {
      for (const registration of registrations) {
        try {
          await registration.unregister();
          console.log(`Service worker at scope ${registration.scope} unregistered.`);
        } catch (error) {
          console.error(`Failed to unregister service worker at ${registration.scope}:`, error);
        }
      }
    }
  } else {
    console.log('Service workers not supported in this browser.');
  }
  
  // 3. Clear all caches
  if ('caches' in window) {
    console.log('Clearing caches...');
    try {
      const cacheNames = await caches.keys();
      
      if (cacheNames.length === 0) {
        console.log('No caches found.');
      } else {
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log(`Cache "${cacheName}" deleted.`);
        }
      }
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  } else {
    console.log('Cache API not supported in this browser.');
  }
  
  // 4. Check for any installed related apps
  if ('getInstalledRelatedApps' in navigator) {
    try {
      const relatedApps = await navigator.getInstalledRelatedApps();
      console.log('Related installed apps:', relatedApps);
    } catch (error) {
      console.error('Error checking installed related apps:', error);
    }
  }
  
  console.log('✅ PWA reset complete! Please refresh the page.');
  console.log('To fully reset, you may also need to:');
  console.log('1. Close all tabs of this site');
  console.log('2. Clear browser cache and cookies for this domain');
  console.log('3. Restart your browser');
})();

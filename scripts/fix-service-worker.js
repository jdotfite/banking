// scripts/fix-service-worker.js
/**
 * This script helps fix service worker issues by:
 * 1. Unregistering any existing service workers
 * 2. Clearing caches that might contain stale service worker data
 */

async function fixServiceWorker() {
  console.log('🔧 Starting service worker fix...');
  
  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    console.log('Unregistering service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('No service workers found to unregister.');
    } else {
      for (const registration of registrations) {
        await registration.unregister();
        console.log(`Service worker at ${registration.scope} unregistered.`);
      }
    }
  } else {
    console.log('Service Worker API not supported in this browser.');
  }
  
  // Clear caches
  if ('caches' in window) {
    console.log('Clearing caches...');
    try {
      const cacheNames = await caches.keys();
      
      if (cacheNames.length === 0) {
        console.log('No caches found to clear.');
      } else {
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        console.log('All caches cleared successfully.');
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  } else {
    console.log('Cache API not supported in this browser.');
  }
  
  console.log('✅ Service worker fix completed!');
  console.log('🔄 Reloading page in 2 seconds...');
  
  // Reload the page after a short delay
  setTimeout(() => {
    window.location.reload(true);
  }, 2000);
}

// Run the fix
fixServiceWorker().catch(error => {
  console.error('Error during service worker fix:', error);
});

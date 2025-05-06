// This script unregisters all service workers and clears caches
// Run this in the browser console to fix navigation redirection issues

async function unregisterAllServiceWorkers() {
  console.log('🔧 Starting service worker cleanup...');
  
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
  
  console.log('✅ Service worker cleanup completed!');
  console.log('🔄 Please refresh the page to complete the process');
}

// Run the cleanup
unregisterAllServiceWorkers().catch(error => {
  console.error('Error during service worker cleanup:', error);
});

/**
 * This script completely unregisters all service workers and clears all caches.
 * It's useful for resolving persistent service worker issues.
 */

(async function() {
  console.log('Starting service worker cleanup...');
  
  try {
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length === 0) {
        console.log('No service workers found to unregister.');
      } else {
        console.log(`Found ${registrations.length} service worker(s) to unregister.`);
        
        for (const registration of registrations) {
          try {
            const result = await registration.unregister();
            if (result) {
              console.log(`Successfully unregistered service worker for scope: ${registration.scope}`);
            } else {
              console.warn(`Failed to unregister service worker for scope: ${registration.scope}`);
            }
          } catch (err) {
            console.error(`Error unregistering service worker for scope ${registration.scope}:`, err);
          }
        }
      }
    } else {
      console.log('Service workers not supported in this browser.');
    }
    
    // Clear all caches
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        
        if (cacheNames.length === 0) {
          console.log('No caches found to clear.');
        } else {
          console.log(`Found ${cacheNames.length} cache(s) to clear.`);
          
          await Promise.all(
            cacheNames.map(async cacheName => {
              try {
                await caches.delete(cacheName);
                console.log(`Successfully cleared cache: ${cacheName}`);
              } catch (err) {
                console.error(`Error clearing cache ${cacheName}:`, err);
              }
            })
          );
        }
      } catch (err) {
        console.error('Error clearing caches:', err);
      }
    } else {
      console.log('Cache API not supported in this browser.');
    }
    
    console.log('Service worker cleanup completed.');
    console.log('Please reload the page to ensure all changes take effect.');
    
    // Notify the user
    alert('Service workers have been unregistered and caches cleared. Please reload the page.');
    
  } catch (err) {
    console.error('Unexpected error during service worker cleanup:', err);
    alert('An error occurred during service worker cleanup. See console for details.');
  }
})();

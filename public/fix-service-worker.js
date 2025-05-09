// This script unregisters all service workers and clears caches
// to resolve service worker related issues

(async function() {
  try {
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker unregistered successfully');
      }
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared successfully');
    }
    
    console.log('Service worker cleanup completed successfully');
    alert('Service worker has been reset. Please reload the page.');
  } catch (error) {
    console.error('Error cleaning up service worker:', error);
    alert('Error cleaning up service worker: ' + error.message);
  }
})();

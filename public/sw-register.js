// This script registers the service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function() {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('✅ Service Worker registered successfully:', registration.scope);
      
      // Check if the service worker is controlling the page
      if (!navigator.serviceWorker.controller) {
        console.log('Loading fresh service worker controller...');
      }
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found!');
        
        newWorker.addEventListener('statechange', () => {
          console.log('Service Worker state changed:', newWorker.state);
        });
      });
      
      // Check for updates every hour
      setInterval(() => {
        registration.update();
        console.log('Checking for Service Worker updates...');
      }, 60 * 60 * 1000);
      
    } catch (err) {
      console.error('❌ Service Worker registration failed:', err);
    }
  });
  
  // Listen for controlling service worker changes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker controller changed!');
  });
  
  // Log when beforeinstallprompt is fired or prevented
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
  });
  
  // Log when the app is installed
  window.addEventListener('appinstalled', (e) => {
    console.log('App was installed', e);
  });
}

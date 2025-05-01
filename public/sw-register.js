if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('? Service Worker registered:', registration.scope);
      
      // Ensure the service worker is controlling the page
      if (!navigator.serviceWorker.controller) {
        console.log('Loading fresh service worker controller...');
      }
    } catch (err) {
      console.error('? Service Worker registration failed:', err);
    }
  });
}

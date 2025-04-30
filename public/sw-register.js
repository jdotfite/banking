if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(
        function (registration) {
          console.log('✅ Service Worker registered:', registration.scope);
        },
        function (err) {
          console.warn('❌ Service Worker registration failed:', err);
        }
      );
    });
  }
  
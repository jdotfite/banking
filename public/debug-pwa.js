// Debug script to help troubleshoot PWA issues
console.log("PWA Debug Script Running");

// Check if running in a secure context
console.log("Is secure context:", window.isSecureContext);

// Check if service workers are supported
console.log("Service Worker API supported:", 'serviceWorker' in navigator);

// Check if running as standalone
console.log("Running as standalone:", window.matchMedia('(display-mode: standalone)').matches);

// Try to fetch the manifest
fetch('/manifest.json')
  .then(response => {
    console.log("Manifest fetch status:", response.status, response.statusText);
    console.log("Manifest Content-Type:", response.headers.get('content-type'));
    return response.json();
  })
  .then(data => {
    console.log("Manifest parsed successfully:", data);
  })
  .catch(error => {
    console.error("Error fetching manifest:", error);
  });

// Monitor beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log("beforeinstallprompt event fired", e);
});

// Log appinstalled event
window.addEventListener('appinstalled', (e) => {
  console.log("App was installed", e);
});

// Check if related apps are installed
if ('getInstalledRelatedApps' in navigator) {
  navigator.getInstalledRelatedApps()
    .then(apps => {
      console.log("Installed related apps:", apps);
    })
    .catch(error => {
      console.error("Error checking installed apps:", error);
    });
} else {
  console.log("getInstalledRelatedApps API not supported");
}

// Check for any CSP violations
document.addEventListener('securitypolicyviolation', (e) => {
  console.error("CSP violation:", e.blockedURI, e.violatedDirective);
});

console.log("PWA Debug Script Completed");

# Service Worker Guide

This guide explains how to fix service worker issues in the Banking App.

## Common Service Worker Issues

The most common service worker error is:

```
Unhandled Runtime Error
TypeError: Failed to update a ServiceWorker for scope ('http://localhost:3000/') with script ('http://localhost:3000/sw.js'): Not found
```

This error occurs when:
1. The service worker script (`sw.js`) is not found or not accessible
2. There are conflicts in service worker registration methods
3. The service worker script contains errors
4. Cache headers are preventing proper service worker registration

## How to Fix Service Worker Issues

We've created scripts to automatically fix service worker issues:

### Windows Users

Run one of these commands in your terminal:

```bash
# Using npm script
npm run fix-sw:win

# Or directly with PowerShell
powershell -ExecutionPolicy Bypass -File ./scripts/fix-sw-and-restart.ps1
```

### Mac/Linux Users

Run one of these commands in your terminal:

```bash
# Using npm script
npm run fix-sw:unix

# Or directly with bash
bash ./scripts/fix-sw-and-restart.sh
```

### Any Platform (Node.js)

```bash
# Using npm script
npm run fix-sw

# Or directly with Node.js
node ./scripts/fix-sw-and-restart.js
```

## What the Fix Scripts Do

The fix scripts perform the following actions:

1. Stop any running development servers
2. Clear the Next.js cache (`.next` directory)
3. Fix the service worker file by removing problematic code
4. Restart the development server

## Manual Fixes

If the automatic scripts don't resolve your issue, you can try these manual steps:

1. Delete the `.next` directory to clear the Next.js cache
2. Delete the service worker files in the `public` directory:
   - `sw.js`
   - `sw.js.map`
   - `workbox-*.js`
   - `workbox-*.js.map`
3. Restart the development server with `npm run dev`

## Preventing Service Worker Issues

To prevent service worker issues:

1. Don't modify the service worker files directly
2. Use the `RegisterServiceWorker` component for service worker registration
3. Avoid adding multiple service worker registration methods
4. Make sure cache headers allow service worker registration

## Debugging Service Worker Issues

If you're still experiencing issues:

1. Open Chrome DevTools (F12)
2. Go to the Application tab
3. Select "Service Workers" in the left sidebar
4. Check for any errors or warnings
5. Use the "Unregister" button to remove problematic service workers
6. Refresh the page and check the console for errors

## Additional Resources

- [Next.js PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

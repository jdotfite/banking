# Handling Cache Issues During Development

This guide provides solutions for dealing with caching issues when developing the Banking App.

## The Problem

When developing web applications, browser caching can sometimes cause confusion when changes don't appear to take effect. This can happen for several reasons:

1. Browser caching static assets and HTML
2. Service Worker caching (for PWAs)
3. Next.js build cache
4. React component state persistence

## Solutions Implemented

We've implemented several solutions to help manage caching during development:

### 1. Modified Next.js Configuration

The `next.config.js` file has been updated to disable caching in development mode:

```javascript
// Cache-Control headers are set to no-cache in development
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: process.env.NODE_ENV === 'development' 
            ? 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' 
            : 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
        // Other headers...
      ],
    },
  ];
}
```

### 2. Middleware Cache-Busting

The `middleware.ts` file now adds cache-busting headers to all responses in development mode:

```javascript
// Add cache-busting headers in development mode
if (process.env.NODE_ENV === 'development') {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
  
  // Add a timestamp header for debugging
  response.headers.set('X-Cache-Timestamp', new Date().toISOString());
}
```

### 3. Cache-Clearing Scripts

Two scripts have been added to help clear caches:

- `scripts/clear-cache-and-restart.ps1` (Windows PowerShell)
- `scripts/clear-cache-and-restart.sh` (Unix/Mac/Linux)

These scripts:
- Clear the Next.js `.next` cache directory
- Provide instructions for clearing browser cache
- Restart the development server

### 4. NPM Scripts

New NPM scripts have been added to package.json:

```json
"scripts": {
  "dev:clean": "rimraf .next && next dev",
  "build:clean": "rimraf .next && next build",
  "clear-cache:win": "powershell -ExecutionPolicy Bypass -File ./scripts/clear-cache-and-restart.ps1",
  "clear-cache:unix": "bash ./scripts/clear-cache-and-restart.sh",
  "test-nav": "next dev && echo 'Navigate to http://localhost:3000/test-nav.html to test navigation'"
}
```

### 5. Navigation Test Page

A test page has been created at `public/test-nav.html` that helps you:
- Test the bottom navigation in isolation
- Clear browser caches
- Add timestamp parameters to force refreshes
- Check cache-related headers

## How to Use These Tools

### When Changes Aren't Showing Up

1. **Hard Refresh**: Try a hard refresh first (Ctrl+F5 or Cmd+Shift+R)

2. **Clear Next.js Cache and Restart**:
   - Windows: `npm run clear-cache:win`
   - Mac/Linux: `npm run clear-cache:unix`

3. **Use the Test Navigation Page**:
   - Start the dev server: `npm run dev`
   - Navigate to: http://localhost:3000/test-nav.html
   - Use the buttons to clear cache and reload

4. **Use Browser Developer Tools**:
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache" while DevTools is open
   - Reload the page

5. **Use Incognito/Private Window**:
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P
   - Edge: Ctrl+Shift+N

6. **Add Query Parameters**:
   - Append a timestamp to force a fresh load:
   - Example: `http://localhost:3000/?refresh=123456789`

## Port Differences

If you're seeing different behavior on different ports (e.g., 3000 vs 3001):

- This is likely because each server instance has its own cache
- When you restart the server, it might pick a different port if the original is in use
- Always check which port you're using in the terminal output
- Use the cache-clearing techniques above on the specific port you're testing

## Service Worker Considerations

The PWA functionality is disabled in development mode (see `next.config.js`), but if you've previously installed the app as a PWA, you might need to:

1. Unregister service workers:
   - In Chrome DevTools → Application → Service Workers → Unregister
   
2. Clear site data:
   - In Chrome DevTools → Application → Storage → Clear site data

## Bottom Navigation Specific Issues

The bottom navigation component has been centralized in the AppContainer component to ensure it's loaded only once and consistently positioned across all pages. If you're still experiencing issues with the navigation:

1. Check that you're not importing and using BottomNav in individual page components
2. Verify that the transform styles in BottomNav.tsx are not being overridden
3. Use the test-nav.html page to isolate and test the navigation component

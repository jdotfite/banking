# Progressive Web App (PWA) Guide

This document provides information about the PWA functionality in the Banking App, including how it works, how to test it, and how to troubleshoot common issues.

## What is a PWA?

A Progressive Web App (PWA) is a web application that uses modern web capabilities to deliver an app-like experience to users. PWAs are:

- **Installable**: Users can add the app to their home screen
- **Offline-capable**: Works without an internet connection using service workers
- **Responsive**: Adapts to different screen sizes
- **App-like**: Provides a full-screen experience without browser UI

## PWA Features in the Banking App

The Banking App implements the following PWA features:

1. **Install Banner**: A customized prompt that encourages users to install the app
2. **Offline Support**: Core functionality works without an internet connection
3. **App Icon**: Custom icons for different platforms and sizes
4. **Splash Screens**: Custom splash screens for iOS devices
5. **Full-screen Mode**: Removes browser UI when launched from the home screen

## Testing PWA Functionality

To test the PWA functionality:

1. Open Chrome and navigate to the app
2. You should see an install banner at the top of the page
3. Click "Install" to add the app to your device
4. After installation, the app should launch in full-screen mode
5. Test offline functionality by enabling Chrome's offline mode (DevTools > Network > Offline)

## Troubleshooting PWA Issues

### PWA Install Banner Not Showing

If the PWA install banner is not showing:

1. **Check PWA Eligibility**: 
   - Open Chrome DevTools (F12)
   - Go to Application > Manifest
   - Verify that the manifest is properly loaded
   - Check for any errors in the "Identity" and "Presentation" sections

2. **Check Service Worker Registration**:
   - Go to Application > Service Workers
   - Verify that a service worker is registered for the site
   - Check the status (should be "activated" and "running")

3. **Clear PWA State**:
   - Run the reset script: `scripts/reset-pwa-and-restart.ps1` (Windows) or `scripts/reset-pwa-and-restart.sh` (Mac/Linux)
   - This will clear caches, unregister service workers, and restart the development server

4. **Manual Reset**:
   - Open Chrome and navigate to `chrome://serviceworker-internals`
   - Find any entries for your site and click "Unregister"
   - Open Chrome DevTools > Application > Clear Storage
   - Check all options and click "Clear site data"
   - Close all browser tabs for your site

5. **Check Console for Errors**:
   - Open Chrome DevTools > Console
   - Look for any errors related to service worker registration or PWA installation

### PWA Not Working Offline

If the PWA is not working offline:

1. **Check Service Worker Cache**:
   - Open Chrome DevTools > Application > Cache Storage
   - Verify that the necessary files are cached

2. **Check Network Requests**:
   - Open Chrome DevTools > Network
   - Enable offline mode
   - Refresh the page
   - Check which requests are failing

3. **Rebuild the Service Worker**:
   - Run `npm run build` to regenerate the service worker files
   - Test again in a fresh browser session

## Browser Support

PWA features are supported in:

- Chrome (desktop and mobile)
- Edge
- Firefox (partial support)
- Safari (partial support)

Note that Safari has limited PWA support, especially on iOS. The install experience on iOS is different:

1. Users must tap the Share button
2. Then select "Add to Home Screen"
3. The PWA banner in our app provides instructions for iOS users

## Debugging Tools

For advanced debugging:

1. **Chrome DevTools**:
   - Application > Manifest
   - Application > Service Workers
   - Application > Cache Storage
   - Application > Clear Storage

2. **Lighthouse**:
   - Open Chrome DevTools > Lighthouse
   - Select "Progressive Web App" category
   - Run an audit to check PWA compliance

3. **Chrome Flags**:
   - Navigate to `chrome://flags`
   - Search for "PWA" to find and enable experimental PWA features

## Reset Scripts

The app includes scripts to reset the PWA state:

- **Browser Console Script**: `scripts/reset-pwa.js` (copy and paste into browser console)
- **PowerShell Script**: `scripts/reset-pwa-and-restart.ps1` (for Windows)
- **Bash Script**: `scripts/reset-pwa-and-restart.sh` (for Mac/Linux)

These scripts will:
1. Clear localStorage PWA flags
2. Unregister service workers
3. Clear caches
4. Restart the development server (PowerShell/Bash scripts only)

## Implementation Details

The PWA functionality is implemented using:

1. **next-pwa**: A Next.js plugin for PWA support
2. **Workbox**: For service worker generation and caching strategies
3. **Custom Components**:
   - `PWAInstallPrompt.tsx`: Custom install banner
   - `RegisterServiceWorker.tsx`: Service worker registration

Key files:
- `public/manifest.json`: PWA metadata and configuration
- `public/sw.js`: Service worker implementation (generated)
- `public/sw-register.js`: Service worker registration script
- `next.config.js`: PWA configuration in Next.js

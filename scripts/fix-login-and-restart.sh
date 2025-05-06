#!/bin/bash

# Script to fix login page issues and restart the development server

echo "🔄 Fixing login page issues and restarting development server..."

# Stop any running Next.js processes
echo "🛑 Stopping any running Next.js processes..."
pkill -f "node.*next" || echo "ℹ️ No Next.js processes found running."

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
if [ -d ".next" ]; then
  rm -rf .next
  echo "✅ Next.js cache cleared."
else
  echo "ℹ️ No .next directory found."
fi

# Clear browser caches if possible
echo "🧹 Clearing browser service worker caches..."
if [ -f "public/sw.js" ]; then
  # Backup the original sw.js
  cp public/sw.js public/sw.js.bak
  
  # Create a new sw.js that clears all caches
  cat > public/sw.js << EOL
// Service worker that clears all caches
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
  console.log('Service worker activated and claimed clients');
});
EOL
  
  echo "✅ Service worker updated to clear caches."
else
  echo "ℹ️ No service worker file found."
fi

# Install dependencies if needed
echo "📦 Checking for node_modules..."
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed."
else
  echo "✅ Dependencies already installed."
fi

# Start the development server
echo "🚀 Starting development server..."
npm run dev &

# Restore the original sw.js after server starts
if [ -f "public/sw.js.bak" ]; then
  # Wait a bit for the server to start
  sleep 5
  cp public/sw.js.bak public/sw.js
  rm public/sw.js.bak
fi

# Keep the script running
wait

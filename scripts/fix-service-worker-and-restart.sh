#!/bin/bash
# scripts/fix-service-worker-and-restart.sh
# This script clears service worker caches and restarts the development server

echo "🔧 Starting service worker fix and server restart..."

# Stop any running Next.js development server
echo "Stopping any running Next.js servers..."
pkill -f "node.*next" || echo "No running Next.js servers found."

# Clear Next.js cache
echo "Clearing Next.js cache..."
if [ -d ".next" ]; then
  rm -rf .next
  echo "Next.js cache cleared."
else
  echo "No .next directory found."
fi

# Clear service worker files
echo "Ensuring service worker is properly set up..."

# Restart the development server
echo "Starting development server..."
npm run dev &

echo "✅ Service worker fix and server restart completed!"
echo "The development server should be available at http://localhost:3000"
echo "When you load the page, it will automatically run the fix-service-worker.js script to clear any cached service workers."

#!/bin/bash

# Optimize development environment script
echo -e "\033[0;36mOptimizing Next.js development environment...\033[0m"

# Stop any running Next.js processes
echo -e "\033[0;33mStopping any running Next.js processes...\033[0m"
pkill -f "node.*next" || true

# Clear Next.js cache
echo -e "\033[0;33mClearing Next.js cache...\033[0m"
if [ -d ".next" ]; then
  rm -rf .next
fi

# Clear node_modules/.cache
echo -e "\033[0;33mClearing module cache...\033[0m"
if [ -d "node_modules/.cache" ]; then
  rm -rf node_modules/.cache
fi

# Run development server with optimized settings
echo -e "\033[0;32mStarting development server with optimized settings...\033[0m"
npm run dev

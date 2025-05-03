#!/bin/bash
# clear-cache-and-restart.sh
# Script to clear Next.js cache and restart the development server

echo -e "\e[32mClearing Next.js cache and restarting development server...\e[0m"

# Stop any running Next.js processes (optional - uncomment if needed)
# pkill -f "node.*next"

# Clear Next.js cache
echo -e "\e[36mClearing .next cache folder...\e[0m"
if [ -d ".next" ]; then
    rm -rf .next
fi

# Clear browser cache instructions
echo -e "\n\e[33mBrowser Cache Clearing Instructions:\e[0m"
echo -e "1. Chrome/Edge: Press Ctrl+Shift+Delete, check 'Cached images and files', click 'Clear data'"
echo -e "2. Firefox: Press Ctrl+Shift+Delete, check 'Cache', click 'Clear Now'"
echo -e "3. For testing, use Chrome Incognito (Ctrl+Shift+N) or Firefox Private Window (Ctrl+Shift+P)"
echo -e "4. Use DevTools (F12) → Network tab → check 'Disable cache' while DevTools is open"
echo -e "5. Add query parameters to force refresh: http://localhost:3000/?refresh=$(date +%s)"

# Restart Next.js development server
echo -e "\n\e[36mRestarting Next.js development server...\e[0m"
npm run dev

echo -e "\n\e[32mDevelopment server restarted with fresh cache!\e[0m"

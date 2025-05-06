#!/bin/bash

# Restart the Next.js development server

# Make script executable
chmod +x "$0"

echo -e "\033[33mStopping any running Next.js development servers...\033[0m"
# Find and kill any running Next.js processes
pkill -f "node.*next" || echo -e "\033[36mNo running Next.js processes found.\033[0m"
echo -e "\033[32mAll Next.js processes stopped.\033[0m"

# Clear Next.js cache
echo -e "\033[33mClearing Next.js cache...\033[0m"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "\033[32mNext.js cache cleared.\033[0m"
else
    echo -e "\033[36mNo .next directory found.\033[0m"
fi

# Start the development server
echo -e "\033[33mStarting Next.js development server...\033[0m"
echo -e "\033[32mPlease run 'npm run dev' manually to start the server.\033[0m"
echo -e "\033[32mDevelopment server setup complete.\033[0m"

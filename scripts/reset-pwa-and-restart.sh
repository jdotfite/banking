#!/bin/bash
# Reset PWA and restart development server
# This script clears caches, removes service worker files, and restarts the Next.js development server

# Make script executable with: chmod +x scripts/reset-pwa-and-restart.sh

# Print with colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}🧹 Starting PWA reset and server restart process...${NC}"

# Stop any running Next.js processes
echo -e "${YELLOW}Stopping any running Next.js processes...${NC}"
pkill -f "node.*next" || echo -e "${YELLOW}No running Next.js processes found.${NC}"
echo -e "${GREEN}Next.js processes stopped.${NC}"

# Clear Next.js cache
echo -e "${YELLOW}Clearing Next.js cache...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo -e "${GREEN}.next directory removed.${NC}"
else
    echo -e "${YELLOW}.next directory not found.${NC}"
fi

# Remove service worker files
echo -e "${YELLOW}Removing service worker files...${NC}"
SW_FILES=("public/sw.js" "public/sw.js.map" "public/workbox-*.js" "public/workbox-*.js.map")

for pattern in "${SW_FILES[@]}"; do
    files=$(find public -name "$(basename $pattern)" 2>/dev/null)
    if [ -n "$files" ]; then
        for file in $files; do
            rm -f "$file"
            echo -e "${GREEN}Removed $(basename $file)${NC}"
        done
    else
        echo -e "${YELLOW}No files matching $pattern found.${NC}"
    fi
done

# Clear browser data instructions
echo -e "\n${MAGENTA}📋 Manual steps required:${NC}"
echo -e "${WHITE}1. Open Chrome and navigate to chrome://serviceworker-internals${NC}"
echo -e "${WHITE}2. Find any entries for your site and click 'Unregister'${NC}"
echo -e "${WHITE}3. Open Chrome DevTools (F12) > Application > Clear Storage${NC}"
echo -e "${WHITE}4. Check all options and click 'Clear site data'${NC}"
echo -e "${WHITE}5. Close all browser tabs for your site${NC}"

# Rebuild and restart the development server
echo -e "\n${CYAN}🚀 Rebuilding and restarting development server...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Start the development server
echo -e "${GREEN}Starting Next.js development server...${NC}"
npm run dev &

echo -e "\n${GREEN}✅ PWA reset complete and development server restarted!${NC}"
echo -e "${CYAN}Open your browser to http://localhost:3000 to test the PWA functionality.${NC}"

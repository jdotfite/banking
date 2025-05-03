#!/bin/bash
# Shell script to run the fix-sw-and-restart.js script

# ANSI color codes
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}Running service worker fix and server restart script...${NC}"

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Path to the Node.js script
JS_SCRIPT_PATH="$SCRIPT_DIR/fix-sw-and-restart.js"

# Check if the script exists
if [ ! -f "$JS_SCRIPT_PATH" ]; then
    echo -e "${RED}Error: Script not found at $JS_SCRIPT_PATH${NC}"
    exit 1
fi

# Make sure the script is executable
chmod +x "$JS_SCRIPT_PATH"

# Run the Node.js script
echo -e "${YELLOW}Executing $JS_SCRIPT_PATH...${NC}"
node "$JS_SCRIPT_PATH"

# Check the exit code
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Script executed successfully!${NC}"
else
    echo -e "${RED}Script execution failed with exit code $?${NC}"
    exit 1
fi

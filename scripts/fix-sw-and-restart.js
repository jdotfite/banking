// scripts/fix-sw-and-restart.js
/**
 * This script fixes service worker issues and restarts the development server
 * It combines the functionality of fix-service-worker.js with server restart
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.resolve(__dirname, '..');
const swPath = path.join(rootDir, 'public', 'sw.js');
const swMapPath = path.join(rootDir, 'public', 'sw.js.map');
const workboxPath = path.join(rootDir, 'public', 'workbox-*.js');

// Check if we're on Windows
const isWindows = process.platform === 'win32';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔧 Starting service worker fix and server restart...${colors.reset}`);

// Step 1: Stop any running development server
try {
  console.log(`${colors.yellow}Stopping any running development servers...${colors.reset}`);
  if (isWindows) {
    execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
  } else {
    execSync('pkill -f "next dev"', { stdio: 'ignore' });
  }
  console.log(`${colors.green}✅ Development servers stopped${colors.reset}`);
} catch (error) {
  console.log(`${colors.yellow}No running development servers found or could not be stopped${colors.reset}`);
}

// Step 2: Clear the Next.js cache
try {
  console.log(`${colors.yellow}Clearing Next.js cache...${colors.reset}`);
  const nextCacheDir = path.join(rootDir, '.next');
  if (fs.existsSync(nextCacheDir)) {
    if (isWindows) {
      execSync(`rmdir /s /q "${nextCacheDir}"`, { stdio: 'ignore' });
    } else {
      execSync(`rm -rf "${nextCacheDir}"`, { stdio: 'ignore' });
    }
  }
  console.log(`${colors.green}✅ Next.js cache cleared${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Error clearing Next.js cache: ${error.message}${colors.reset}`);
}

// Step 3: Fix the service worker file if it exists
try {
  if (fs.existsSync(swPath)) {
    console.log(`${colors.yellow}Fixing service worker file...${colors.reset}`);
    
    // Read the service worker file
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Fix the empty importScripts() call if it exists
    swContent = swContent.replace('importScripts();', '// No need to import additional scripts here');
    
    // Write the fixed content back
    fs.writeFileSync(swPath, swContent);
    
    console.log(`${colors.green}✅ Service worker file fixed${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Service worker file not found, will be generated during build${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}❌ Error fixing service worker file: ${error.message}${colors.reset}`);
}

// Step 4: Restart the development server
try {
  console.log(`${colors.magenta}🚀 Restarting development server...${colors.reset}`);
  
  // Use npm run dev in a detached process
  const command = isWindows ? 'start cmd /c "npm run dev"' : 'npm run dev &';
  execSync(command, { stdio: 'ignore', shell: true });
  
  console.log(`${colors.green}✅ Development server restarted${colors.reset}`);
  console.log(`${colors.cyan}🌐 Your app should be available at http://localhost:3000 in a few moments${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Error restarting development server: ${error.message}${colors.reset}`);
}

console.log(`${colors.green}✅ Service worker fix and server restart completed!${colors.reset}`);

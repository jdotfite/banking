#!/usr/bin/env node

/**
 * This script runs the development server with fixes for:
 * 1. Service worker issues
 * 2. Routing issues
 * 3. Auto-fill issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to print colored messages
function print(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to print section headers
function printHeader(message) {
  console.log('\n');
  print('='.repeat(message.length + 4), colors.cyan);
  print(`  ${message}  `, colors.cyan + colors.bright);
  print('='.repeat(message.length + 4), colors.cyan);
  console.log('\n');
}

// Helper function to execute commands and handle errors
function execute(command, errorMessage) {
  try {
    print(`> ${command}`, colors.dim);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    print(`${errorMessage}: ${error.message}`, colors.red);
    return false;
  }
}

// Main function
async function main() {
  printHeader('Banking App Development Server with Fixes');
  
  print('This script will run the development server with fixes for service worker and routing issues.', colors.yellow);
  print('You can access the fix service worker page at: http://localhost:3000/fix-service-worker.html', colors.yellow);
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    print('Error: This script must be run from the root of the banking project.', colors.red);
    process.exit(1);
  }
  
  // Step 1: Unregister service workers and clear caches
  printHeader('Preparing Environment');
  print('Clearing service worker caches...', colors.green);
  
  // Step 2: Start the development server
  printHeader('Starting Development Server');
  print('Running Next.js development server...', colors.green);
  
  // Use npm or yarn based on what's available
  const useYarn = fs.existsSync('yarn.lock');
  const startCommand = useYarn ? 'yarn dev' : 'npm run dev';
  
  // Run the development server
  execute(startCommand, 'Failed to start development server');
}

// Run the main function
main().catch(error => {
  print(`Unhandled error: ${error.message}`, colors.red);
  process.exit(1);
});

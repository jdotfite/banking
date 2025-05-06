# PowerShell script to fix login page issues and restart the development server

Write-Host "🔄 Fixing login page issues and restarting development server..." -ForegroundColor Cyan

# Stop any running Next.js processes
Write-Host "🛑 Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { Stop-Process -Id $_.Id -Force }
    Write-Host "✅ Next.js processes stopped." -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Next.js processes found running." -ForegroundColor Blue
}

# Clear Next.js cache
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Next.js cache cleared." -ForegroundColor Green
} else {
    Write-Host "ℹ️ No .next directory found." -ForegroundColor Blue
}

# Clear browser caches if possible
Write-Host "🧹 Clearing browser service worker caches..." -ForegroundColor Yellow
if (Test-Path "public/sw.js") {
    # Backup the original sw.js
    Copy-Item "public/sw.js" "public/sw.js.bak"
    
    # Create a new sw.js that clears all caches
    @"
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
"@ | Out-File -FilePath "public/sw.js" -Encoding utf8
    
    Write-Host "✅ Service worker updated to clear caches." -ForegroundColor Green
} else {
    Write-Host "ℹ️ No service worker file found." -ForegroundColor Blue
}

# Install dependencies if needed
Write-Host "📦 Checking for node_modules..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed." -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed." -ForegroundColor Green
}

# Start the development server
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
npm run dev

# Restore the original sw.js after server starts
if (Test-Path "public/sw.js.bak") {
    Copy-Item "public/sw.js.bak" "public/sw.js" -Force
    Remove-Item "public/sw.js.bak" -Force
}

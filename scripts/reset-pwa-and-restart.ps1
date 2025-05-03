# Reset PWA and restart development server
# This script clears caches, removes service worker files, and restarts the Next.js development server

Write-Host "🧹 Starting PWA reset and server restart process..." -ForegroundColor Cyan

# Stop any running Next.js processes
Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { 
        Write-Host "Stopping process with ID $($_.Id)..." -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force 
    }
    Write-Host "Next.js processes stopped." -ForegroundColor Green
} else {
    Write-Host "No running Next.js processes found." -ForegroundColor Yellow
}

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host ".next directory removed." -ForegroundColor Green
} else {
    Write-Host ".next directory not found." -ForegroundColor Yellow
}

# Remove service worker files
Write-Host "Removing service worker files..." -ForegroundColor Yellow
$swFiles = @(
    "public/sw.js",
    "public/sw.js.map",
    "public/workbox-*.js",
    "public/workbox-*.js.map"
)

foreach ($file in $swFiles) {
    $matchingFiles = Get-Item -Path $file -ErrorAction SilentlyContinue
    if ($matchingFiles) {
        foreach ($matchingFile in $matchingFiles) {
            Remove-Item -Path $matchingFile.FullName -Force
            Write-Host "Removed $($matchingFile.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "No files matching $file found." -ForegroundColor Yellow
    }
}

# Clear browser data instructions
Write-Host "`n📋 Manual steps required:" -ForegroundColor Magenta
Write-Host "1. Open Chrome and navigate to chrome://serviceworker-internals" -ForegroundColor White
Write-Host "2. Find any entries for your site and click 'Unregister'" -ForegroundColor White
Write-Host "3. Open Chrome DevTools (F12) > Application > Clear Storage" -ForegroundColor White
Write-Host "4. Check all options and click 'Clear site data'" -ForegroundColor White
Write-Host "5. Close all browser tabs for your site" -ForegroundColor White

# Rebuild and restart the development server
Write-Host "`n🚀 Rebuilding and restarting development server..." -ForegroundColor Cyan

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting Next.js development server..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

Write-Host "`n✅ PWA reset complete and development server restarted!" -ForegroundColor Green
Write-Host "Open your browser to http://localhost:3000 to test the PWA functionality." -ForegroundColor Cyan

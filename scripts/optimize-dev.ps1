# Optimize development environment script
Write-Host "Optimizing Next.js development environment..." -ForegroundColor Cyan

# Stop any running Next.js processes
Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

# Clear node_modules/.cache
Write-Host "Clearing module cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
}

# Run development server with optimized settings
Write-Host "Starting development server with optimized settings..." -ForegroundColor Green
npm run dev

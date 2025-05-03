# scripts/fix-service-worker-and-restart.ps1
# This script clears service worker caches and restarts the development server

Write-Host "Starting service worker fix and server restart..." -ForegroundColor Cyan

# Stop any running Next.js development server
Write-Host "Stopping any running Next.js servers..." -ForegroundColor Yellow
$nextProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { 
        Write-Host "Stopping process with ID: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force 
    }
    Write-Host "Next.js servers stopped." -ForegroundColor Green
} else {
    Write-Host "No running Next.js servers found." -ForegroundColor Yellow
}

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Next.js cache cleared." -ForegroundColor Green
} else {
    Write-Host "No .next directory found." -ForegroundColor Yellow
}

# Restart the development server
Write-Host "Starting development server..." -ForegroundColor Green
Start-Process -NoNewWindow npm -ArgumentList "run", "dev"

Write-Host "Service worker fix and server restart completed!" -ForegroundColor Cyan
Write-Host "The development server should be available at http://localhost:3000" -ForegroundColor Cyan
Write-Host "When you load the page, it will automatically run the fix-service-worker.js script." -ForegroundColor Cyan

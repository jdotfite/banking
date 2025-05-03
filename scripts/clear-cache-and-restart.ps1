# clear-cache-and-restart.ps1
# Script to clear Next.js cache and restart the development server

Write-Host "Clearing Next.js cache and restarting development server..." -ForegroundColor Green

# Stop any running Next.js processes (optional - uncomment if needed)
# Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force

# Clear Next.js cache
Write-Host "Clearing .next cache folder..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Clear browser cache instructions
Write-Host "`nBrowser Cache Clearing Instructions:" -ForegroundColor Yellow
Write-Host "1. Chrome/Edge: Press Ctrl+Shift+Delete, check 'Cached images and files', click 'Clear data'" -ForegroundColor White
Write-Host "2. Firefox: Press Ctrl+Shift+Delete, check 'Cache', click 'Clear Now'" -ForegroundColor White
Write-Host "3. For testing, use Chrome Incognito (Ctrl+Shift+N) or Firefox Private Window (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "4. Use DevTools (F12) → Network tab → check 'Disable cache' while DevTools is open" -ForegroundColor White

# Restart Next.js development server
Write-Host "`nRestarting Next.js development server..." -ForegroundColor Cyan
npm run dev

Write-Host "`nDevelopment server restarted with fresh cache!" -ForegroundColor Green
